-- A data-room clearance is an auditable human workflow record. It binds a
-- reviewed derivative to exact bytes and metadata; it does not inspect a PDF
-- or image semantically, and it does not certify the quality of legal advice.

create type public.data_room_clearance_review_role as enum (
  'finance_ops',
  'redaction',
  'counsel',
  'data_room_admin'
);

create table public.data_room_document_clearances (
  id uuid primary key default gen_random_uuid(),
  data_room_id uuid not null references public.data_rooms(id) on delete restrict,
  checksum_sha256 text not null check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  classification_label text not null default 'CONFIDENTIAL · SECONDARY TRANSFER REVIEW · NOT A LIVE OFFER'
    check (classification_label = 'CONFIDENTIAL · SECONDARY TRANSFER REVIEW · NOT A LIVE OFFER'),
  finance_ops_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  redaction_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  counsel_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  data_room_admin_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  expires_at timestamptz not null,
  voided_at timestamptz,
  voided_by uuid references public.profiles(id) on delete restrict,
  void_reason text,
  consumed_at timestamptz,
  consumed_by uuid references public.profiles(id) on delete restrict,
  consumed_version_id uuid,
  created_at timestamptz not null default now(),
  constraint data_room_clearance_reviewer_assignments_distinct check (
    finance_ops_reviewer_id <> redaction_reviewer_id
    and finance_ops_reviewer_id <> counsel_reviewer_id
    and finance_ops_reviewer_id <> data_room_admin_reviewer_id
    and redaction_reviewer_id <> counsel_reviewer_id
    and redaction_reviewer_id <> data_room_admin_reviewer_id
    and counsel_reviewer_id <> data_room_admin_reviewer_id
  ),
  constraint data_room_clearance_expiry_is_bounded check (
    expires_at > created_at
    and expires_at <= created_at + interval '30 days'
  ),
  constraint data_room_clearance_void_is_consistent check (
    (voided_at is null and voided_by is null and void_reason is null)
    or (
      voided_at is not null
      and voided_by is not null
      and char_length(trim(void_reason)) between 1 and 500
    )
  ),
  constraint data_room_clearance_consumption_is_consistent check (
    (consumed_at is null and consumed_by is null and consumed_version_id is null)
    or (consumed_at is not null and consumed_by is not null and consumed_version_id is not null)
  )
);

create index data_room_document_clearances_room_created_idx
  on public.data_room_document_clearances (data_room_id, created_at desc);
create index data_room_document_clearances_pending_idx
  on public.data_room_document_clearances (data_room_id, expires_at)
  where consumed_at is null and voided_at is null;

create table public.data_room_document_clearance_attestations (
  id uuid primary key default gen_random_uuid(),
  clearance_id uuid not null references public.data_room_document_clearances(id) on delete restrict,
  review_role public.data_room_clearance_review_role not null,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  attestation_statement text not null default 'I reviewed the assigned derivative in my capacity and confirm the required classification label is present. This record does not represent automated semantic analysis or certify professional counsel quality.'
    check (attestation_statement = 'I reviewed the assigned derivative in my capacity and confirm the required classification label is present. This record does not represent automated semantic analysis or certify professional counsel quality.'),
  attested_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (clearance_id, review_role),
  unique (clearance_id, reviewer_id)
);

create index data_room_document_clearance_attestations_clearance_idx
  on public.data_room_document_clearance_attestations (clearance_id, review_role);

alter table public.data_room_document_versions
  add column clearance_id uuid references public.data_room_document_clearances(id) on delete restrict;

create unique index data_room_document_versions_clearance_id_unique_idx
  on public.data_room_document_versions (clearance_id)
  where clearance_id is not null;

alter table public.data_room_document_clearances
  add constraint data_room_clearance_consumed_version_fkey
  foreign key (consumed_version_id)
  references public.data_room_document_versions(id)
  on delete restrict;

create function private.profile_can_review_data_room(
  target_profile_id uuid,
  target_data_room_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.profiles p
      join public.data_rooms dr on dr.id = target_data_room_id
      join public.rounds r on r.id = dr.round_id
      join public.issuers i on i.id = r.issuer_id
      where p.id = target_profile_id
        and p.archived_at is null
        and dr.archived_at is null
        and r.archived_at is null
        and r.status <> 'archived'
        and i.archived_at is null
        and (
          p.role = 'admin'
          or (
            p.role = 'issuer'
            and p.issuer_id is not null
            and p.issuer_id = r.issuer_id
          )
        )
    ),
    false
  )
$$;

create function private.assert_data_room_clearance_reviewer_assignments(
  target_data_room_id uuid,
  target_finance_ops_reviewer_id uuid,
  target_redaction_reviewer_id uuid,
  target_counsel_reviewer_id uuid,
  target_data_room_admin_reviewer_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if target_finance_ops_reviewer_id is null
    or target_redaction_reviewer_id is null
    or target_counsel_reviewer_id is null
    or target_data_room_admin_reviewer_id is null
    or target_finance_ops_reviewer_id = target_redaction_reviewer_id
    or target_finance_ops_reviewer_id = target_counsel_reviewer_id
    or target_finance_ops_reviewer_id = target_data_room_admin_reviewer_id
    or target_redaction_reviewer_id = target_counsel_reviewer_id
    or target_redaction_reviewer_id = target_data_room_admin_reviewer_id
    or target_counsel_reviewer_id = target_data_room_admin_reviewer_id
  then
    raise exception 'Finance Ops, redaction, counsel, and data-room admin reviewers must be four distinct identities'
      using errcode = '23514';
  end if;

  if not private.profile_can_review_data_room(target_finance_ops_reviewer_id, target_data_room_id)
    or not private.profile_can_review_data_room(target_redaction_reviewer_id, target_data_room_id)
    or not private.profile_can_review_data_room(target_counsel_reviewer_id, target_data_room_id)
    or not private.profile_can_review_data_room(target_data_room_admin_reviewer_id, target_data_room_id)
  then
    raise exception 'Each clearance reviewer must be an active data-room manager for this issuer'
      using errcode = '23514';
  end if;
end;
$$;

create function private.data_room_clearance_is_complete(target_clearance_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.data_room_document_clearances c
      where c.id = target_clearance_id
        and c.voided_at is null
        and private.profile_can_review_data_room(c.finance_ops_reviewer_id, c.data_room_id)
        and private.profile_can_review_data_room(c.redaction_reviewer_id, c.data_room_id)
        and private.profile_can_review_data_room(c.counsel_reviewer_id, c.data_room_id)
        and private.profile_can_review_data_room(c.data_room_admin_reviewer_id, c.data_room_id)
        and exists (
          select 1
          from public.data_room_document_clearance_attestations a
          where a.clearance_id = c.id
            and a.review_role = 'finance_ops'
            and a.reviewer_id = c.finance_ops_reviewer_id
        )
        and exists (
          select 1
          from public.data_room_document_clearance_attestations a
          where a.clearance_id = c.id
            and a.review_role = 'redaction'
            and a.reviewer_id = c.redaction_reviewer_id
        )
        and exists (
          select 1
          from public.data_room_document_clearance_attestations a
          where a.clearance_id = c.id
            and a.review_role = 'counsel'
            and a.reviewer_id = c.counsel_reviewer_id
        )
        and exists (
          select 1
          from public.data_room_document_clearance_attestations a
          where a.clearance_id = c.id
            and a.review_role = 'data_room_admin'
            and a.reviewer_id = c.data_room_admin_reviewer_id
        )
        and (
          select count(*)
          from public.data_room_document_clearance_attestations a
          where a.clearance_id = c.id
        ) = 4
    ),
    false
  )
$$;

create function private.assert_data_room_clearance_for_upload(
  target_clearance_id uuid,
  target_data_room_id uuid,
  target_checksum_sha256 text,
  target_mime_type text,
  target_size_bytes bigint,
  actor_user_id uuid,
  require_unconsumed boolean default true
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_clearance public.data_room_document_clearances;
begin
  select * into target_clearance
  from public.data_room_document_clearances
  where id = target_clearance_id
  for update;

  if target_clearance.id is null
    or target_clearance.data_room_id <> target_data_room_id
    or target_clearance.checksum_sha256 <> lower(trim(target_checksum_sha256))
    or target_clearance.mime_type <> lower(trim(target_mime_type))
    or target_clearance.size_bytes <> target_size_bytes
    or target_clearance.classification_label <> 'CONFIDENTIAL · SECONDARY TRANSFER REVIEW · NOT A LIVE OFFER'
  then
    raise exception 'Clearance does not match this derivative fingerprint, MIME type, size, and classification'
      using errcode = '23514';
  end if;

  if target_clearance.voided_at is not null
    or target_clearance.expires_at <= statement_timestamp()
  then
    raise exception 'Clearance is voided or expired'
      using errcode = '23514';
  end if;

  if require_unconsumed and target_clearance.consumed_at is not null then
    raise exception 'Clearance has already been consumed by a document version'
      using errcode = '23514';
  end if;

  if actor_user_id is not null
    and actor_user_id in (
      target_clearance.finance_ops_reviewer_id,
      target_clearance.redaction_reviewer_id,
      target_clearance.counsel_reviewer_id,
      target_clearance.data_room_admin_reviewer_id
    )
  then
    raise exception 'The uploader cannot be one of this derivative clearance reviewers'
      using errcode = '42501';
  end if;

  if not private.data_room_clearance_is_complete(target_clearance.id) then
    raise exception 'Clearance requires all four assigned human attestations from active reviewers'
      using errcode = '23514';
  end if;
end;
$$;

create or replace function private.enforce_data_room_version_storage_path()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_data_room_id uuid;
  filename text;
begin
  select d.data_room_id into target_data_room_id
  from public.data_room_documents d
  where d.id = new.document_id;

  filename := split_part(new.storage_path, '/', 3);

  if target_data_room_id is null
    or split_part(new.storage_path, '/', 1) <> target_data_room_id::text
    or split_part(new.storage_path, '/', 2) <> new.document_id::text
    or filename not like new.id::text || '-%'
    or length(filename) <= length(new.id::text) + 1
    or split_part(new.storage_path, '/', 4) <> ''
    or not private.is_safe_data_room_derivative(new.original_filename, new.mime_type)
    or not private.is_safe_data_room_derivative(filename, new.mime_type)
    or new.checksum_sha256 is null
    or new.checksum_sha256 !~ '^[a-f0-9]{64}$'
    or new.clearance_id is null
  then
    raise exception 'Data-room versions require a cleared redacted derivative with a SHA-256 checksum'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create or replace function private.audit_data_room_version_upload()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_data_room_id uuid;
begin
  if (select auth.uid()) is null then
    return new;
  end if;

  select d.data_room_id into target_data_room_id
  from public.data_room_documents d
  where d.id = new.document_id;

  insert into public.data_room_activity_events (
    data_room_id,
    actor_user_id,
    document_id,
    document_version_id,
    event_type,
    metadata,
    occurred_at
  ) values (
    target_data_room_id,
    (select auth.uid()),
    new.document_id,
    new.id,
    'upload',
    jsonb_build_object(
      'version_number', new.version_number,
      'original_filename', new.original_filename,
      'clearance_id', new.clearance_id
    ),
    statement_timestamp()
  );

  return new;
end;
$$;

revoke all on function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text
) from public, anon, authenticated, service_role;
drop function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text
);

create function public.append_data_room_document_version(
  target_document_id uuid,
  target_version_id uuid,
  target_storage_path text,
  target_original_filename text,
  target_mime_type text,
  target_size_bytes bigint,
  target_checksum_sha256 text,
  target_clearance_id uuid
)
returns public.data_room_document_versions
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_document public.data_room_documents;
  next_version_number integer;
  appended_version public.data_room_document_versions;
  storage_filename text;
  stored_metadata jsonb;
  stored_mime_type text;
  stored_size_bytes bigint;
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  select * into target_document
  from public.data_room_documents
  where id = target_document_id
  for update;

  if target_document.id is null
    or not private.user_can_manage_data_room(target_document.data_room_id)
  then
    raise exception 'Document not found or not manageable' using errcode = '42501';
  end if;

  storage_filename := split_part(target_storage_path, '/', 3);

  if target_version_id is null
    or split_part(target_storage_path, '/', 1) <> target_document.data_room_id::text
    or split_part(target_storage_path, '/', 2) <> target_document.id::text
    or storage_filename not like target_version_id::text || '-%'
    or length(storage_filename) <= length(target_version_id::text) + 1
    or split_part(target_storage_path, '/', 4) <> ''
  then
    raise exception 'Storage path must match data room, document, and version'
      using errcode = '23514';
  end if;

  if not private.is_safe_data_room_derivative(target_original_filename, target_mime_type)
    or not private.is_safe_data_room_derivative(storage_filename, target_mime_type)
  then
    raise exception 'Only reviewed redacted PDF, JPEG, or PNG derivatives are permitted'
      using errcode = '23514';
  end if;

  if target_size_bytes is null
    or target_size_bytes <= 0
    or target_size_bytes > 26214400
    or nullif(lower(trim(target_checksum_sha256)), '') is null
    or lower(trim(target_checksum_sha256)) !~ '^[a-f0-9]{64}$'
  then
    raise exception 'Version metadata requires a bounded file size and SHA-256 checksum'
      using errcode = '23514';
  end if;

  perform private.assert_data_room_clearance_for_upload(
    target_clearance_id,
    target_document.data_room_id,
    target_checksum_sha256,
    target_mime_type,
    target_size_bytes,
    actor_user_id,
    true
  );

  select o.metadata into stored_metadata
  from storage.objects o
  where o.bucket_id = 'data-room-documents'
    and o.name = target_storage_path;

  stored_mime_type := lower(nullif(trim(stored_metadata ->> 'mimetype'), ''));
  if nullif(stored_metadata ->> 'size', '') is not null
    and (stored_metadata ->> 'size') ~ '^[0-9]+$'
  then
    stored_size_bytes := (stored_metadata ->> 'size')::bigint;
  end if;

  if stored_metadata is null
    or stored_mime_type is distinct from lower(trim(target_mime_type))
    or stored_size_bytes is distinct from target_size_bytes
  then
    raise exception 'Storage object is missing or does not match the derivative metadata'
      using errcode = '23514';
  end if;

  select coalesce(max(v.version_number), 0) + 1
  into next_version_number
  from public.data_room_document_versions v
  where v.document_id = target_document.id;

  update public.data_room_document_versions
  set is_current = false
  where document_id = target_document.id
    and is_current;

  insert into public.data_room_document_versions (
    id,
    document_id,
    version_number,
    storage_path,
    original_filename,
    mime_type,
    size_bytes,
    checksum_sha256,
    clearance_id,
    is_current,
    uploaded_by,
    published_at,
    archived_at
  ) values (
    target_version_id,
    target_document.id,
    next_version_number,
    target_storage_path,
    trim(target_original_filename),
    lower(trim(target_mime_type)),
    target_size_bytes,
    lower(trim(target_checksum_sha256)),
    target_clearance_id,
    true,
    actor_user_id,
    null,
    null
  )
  returning * into appended_version;

  update public.data_room_document_clearances
  set consumed_at = statement_timestamp(),
      consumed_by = actor_user_id,
      consumed_version_id = appended_version.id
  where id = target_clearance_id
    and consumed_at is null;

  if not found then
    raise exception 'Clearance was already consumed' using errcode = '23514';
  end if;

  return appended_version;
end;
$$;

create or replace function public.publish_data_room_document(target_document_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_document public.data_room_documents;
  target_version public.data_room_document_versions;
  target_clearance public.data_room_document_clearances;
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  select * into target_document
  from public.data_room_documents
  where id = target_document_id
  for update;

  if target_document.id is null
    or not private.user_can_manage_data_room(target_document.data_room_id)
  then
    raise exception 'Document not found or not manageable' using errcode = '42501';
  end if;

  select * into target_version
  from public.data_room_document_versions
  where document_id = target_document_id
    and is_current
    and archived_at is null
  for update;

  if target_version.id is null or target_version.clearance_id is null then
    raise exception 'A current cleared document version is required before publishing' using errcode = '23514';
  end if;

  perform private.assert_data_room_clearance_for_upload(
    target_version.clearance_id,
    target_document.data_room_id,
    target_version.checksum_sha256,
    target_version.mime_type,
    target_version.size_bytes,
    null,
    false
  );

  select * into target_clearance
  from public.data_room_document_clearances
  where id = target_version.clearance_id
  for update;

  if target_clearance.consumed_at is null
    or target_clearance.consumed_version_id is distinct from target_version.id
  then
    raise exception 'Current version is not the immutable consumer of its clearance'
      using errcode = '23514';
  end if;

  update public.data_room_document_versions
  set published_at = now(),
      archived_at = null
  where id = target_version.id;

  update public.data_room_documents
  set status = 'published',
      published_by = actor_user_id,
      published_version_id = target_version.id,
      published_at = now(),
      archived_at = null
  where id = target_document_id;

  if not found then
    raise exception 'Document not found or not manageable' using errcode = '42501';
  end if;
end;
$$;

create function public.create_data_room_document_clearance(
  target_data_room_id uuid,
  target_checksum_sha256 text,
  target_mime_type text,
  target_size_bytes bigint,
  target_finance_ops_reviewer_id uuid,
  target_redaction_reviewer_id uuid,
  target_counsel_reviewer_id uuid,
  target_data_room_admin_reviewer_id uuid,
  target_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  created_clearance_id uuid;
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  if not private.user_can_manage_data_room(target_data_room_id) then
    raise exception 'Data room not found or not manageable' using errcode = '42501';
  end if;

  if nullif(lower(trim(target_checksum_sha256)), '') is null
    or lower(trim(target_checksum_sha256)) !~ '^[a-f0-9]{64}$'
    or lower(trim(target_mime_type)) not in ('application/pdf', 'image/jpeg', 'image/png')
    or target_size_bytes is null
    or target_size_bytes <= 0
    or target_size_bytes > 26214400
    or target_expires_at is null
    or target_expires_at <= statement_timestamp()
    or target_expires_at > statement_timestamp() + interval '30 days'
  then
    raise exception 'Clearance requires a bounded future SHA-256, permitted MIME type, and size'
      using errcode = '23514';
  end if;

  perform private.assert_data_room_clearance_reviewer_assignments(
    target_data_room_id,
    target_finance_ops_reviewer_id,
    target_redaction_reviewer_id,
    target_counsel_reviewer_id,
    target_data_room_admin_reviewer_id
  );

  insert into public.data_room_document_clearances (
    data_room_id,
    checksum_sha256,
    mime_type,
    size_bytes,
    finance_ops_reviewer_id,
    redaction_reviewer_id,
    counsel_reviewer_id,
    data_room_admin_reviewer_id,
    created_by,
    expires_at
  ) values (
    target_data_room_id,
    lower(trim(target_checksum_sha256)),
    lower(trim(target_mime_type)),
    target_size_bytes,
    target_finance_ops_reviewer_id,
    target_redaction_reviewer_id,
    target_counsel_reviewer_id,
    target_data_room_admin_reviewer_id,
    actor_user_id,
    target_expires_at
  )
  returning id into created_clearance_id;

  return created_clearance_id;
end;
$$;

create function public.attest_data_room_document_clearance(
  target_clearance_id uuid,
  target_review_role public.data_room_clearance_review_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_clearance public.data_room_document_clearances;
  expected_reviewer_id uuid;
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  select * into target_clearance
  from public.data_room_document_clearances
  where id = target_clearance_id
  for update;

  if target_clearance.id is null
    or not private.user_can_manage_data_room(target_clearance.data_room_id)
  then
    raise exception 'Clearance not found or not manageable' using errcode = '42501';
  end if;

  if target_clearance.voided_at is not null
    or target_clearance.consumed_at is not null
    or target_clearance.expires_at <= statement_timestamp()
  then
    raise exception 'Only an active, unconsumed, unexpired clearance can be attested'
      using errcode = '23514';
  end if;

  expected_reviewer_id := case target_review_role
    when 'finance_ops' then target_clearance.finance_ops_reviewer_id
    when 'redaction' then target_clearance.redaction_reviewer_id
    when 'counsel' then target_clearance.counsel_reviewer_id
    when 'data_room_admin' then target_clearance.data_room_admin_reviewer_id
  end;

  if expected_reviewer_id is distinct from actor_user_id
    or not private.profile_can_review_data_room(actor_user_id, target_clearance.data_room_id)
  then
    raise exception 'Only the assigned active reviewer may record this attestation'
      using errcode = '42501';
  end if;

  insert into public.data_room_document_clearance_attestations (
    clearance_id,
    review_role,
    reviewer_id
  ) values (
    target_clearance.id,
    target_review_role,
    actor_user_id
  )
  on conflict (clearance_id, review_role) do nothing;
end;
$$;

create function public.void_data_room_document_clearance(
  target_clearance_id uuid,
  target_reason text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_clearance public.data_room_document_clearances;
  normalized_reason text := nullif(trim(target_reason), '');
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  select * into target_clearance
  from public.data_room_document_clearances
  where id = target_clearance_id
  for update;

  if target_clearance.id is null
    or not private.user_can_manage_data_room(target_clearance.data_room_id)
  then
    raise exception 'Clearance not found or not manageable' using errcode = '42501';
  end if;

  if target_clearance.consumed_at is not null then
    raise exception 'A consumed clearance cannot be voided' using errcode = '23514';
  end if;

  if target_clearance.voided_at is not null then
    return;
  end if;

  if normalized_reason is null or char_length(normalized_reason) > 500 then
    raise exception 'A void reason of 1 to 500 characters is required' using errcode = '23514';
  end if;

  update public.data_room_document_clearances
  set voided_at = statement_timestamp(),
      voided_by = actor_user_id,
      void_reason = normalized_reason
  where id = target_clearance.id;
end;
$$;

create function public.list_data_room_clearance_reviewer_candidates(target_data_room_id uuid)
returns table (
  id uuid,
  email text,
  full_name text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null
    or not private.user_can_manage_data_room(target_data_room_id)
  then
    raise exception 'Data room not found or not manageable' using errcode = '42501';
  end if;

  return query
  select p.id, p.email, p.full_name
  from public.profiles p
  where private.profile_can_review_data_room(p.id, target_data_room_id)
  order by lower(p.email), p.id;
end;
$$;

create function public.assert_data_room_document_clearance(
  target_clearance_id uuid,
  target_data_room_id uuid,
  target_checksum_sha256 text,
  target_mime_type text,
  target_size_bytes bigint
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
begin
  if actor_user_id is null
    or not private.user_can_manage_data_room(target_data_room_id)
  then
    raise exception 'Data room not found or not manageable' using errcode = '42501';
  end if;

  perform private.assert_data_room_clearance_for_upload(
    target_clearance_id,
    target_data_room_id,
    target_checksum_sha256,
    target_mime_type,
    target_size_bytes,
    actor_user_id,
    true
  );
end;
$$;

alter table public.data_room_document_clearances enable row level security;
alter table public.data_room_document_clearance_attestations enable row level security;

create policy "data_room_clearances_select_manager"
on public.data_room_document_clearances for select to authenticated
using (private.user_can_manage_data_room(data_room_id));

create policy "data_room_clearance_attestations_select_manager"
on public.data_room_document_clearance_attestations for select to authenticated
using (
  exists (
    select 1
    from public.data_room_document_clearances c
    where c.id = data_room_document_clearance_attestations.clearance_id
      and private.user_can_manage_data_room(c.data_room_id)
  )
);

-- The base data-room migration grants authenticated callers the small set of
-- private authorization helpers that RLS policies invoke. Do not repeat its
-- schema-wide revoke here: that would remove those grants mid-migration and
-- make every authenticated policy evaluation fail. These four helpers are new
-- and are implementation details of the clearance RPCs, so restrict only them.
revoke all on function private.profile_can_review_data_room(uuid, uuid)
  from public, anon, authenticated;
revoke all on function private.assert_data_room_clearance_reviewer_assignments(
  uuid, uuid, uuid, uuid, uuid
) from public, anon, authenticated;
revoke all on function private.data_room_clearance_is_complete(uuid)
  from public, anon, authenticated;
revoke all on function private.assert_data_room_clearance_for_upload(
  uuid, uuid, text, text, bigint, uuid, boolean
) from public, anon, authenticated;

grant execute on function private.profile_can_review_data_room(uuid, uuid)
  to service_role;
grant execute on function private.assert_data_room_clearance_reviewer_assignments(
  uuid, uuid, uuid, uuid, uuid
) to service_role;
grant execute on function private.data_room_clearance_is_complete(uuid)
  to service_role;
grant execute on function private.assert_data_room_clearance_for_upload(
  uuid, uuid, text, text, bigint, uuid, boolean
) to service_role;

revoke all on function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text, uuid
) from public, anon, authenticated, service_role;
grant execute on function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text, uuid
) to authenticated, service_role;

revoke all on function public.create_data_room_document_clearance(
  uuid, text, text, bigint, uuid, uuid, uuid, uuid, timestamptz
) from public, anon, authenticated, service_role;
grant execute on function public.create_data_room_document_clearance(
  uuid, text, text, bigint, uuid, uuid, uuid, uuid, timestamptz
) to authenticated, service_role;

revoke all on function public.attest_data_room_document_clearance(
  uuid, public.data_room_clearance_review_role
) from public, anon, authenticated, service_role;
grant execute on function public.attest_data_room_document_clearance(
  uuid, public.data_room_clearance_review_role
) to authenticated, service_role;

revoke all on function public.void_data_room_document_clearance(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.void_data_room_document_clearance(uuid, text)
  to authenticated, service_role;

revoke all on function public.list_data_room_clearance_reviewer_candidates(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.list_data_room_clearance_reviewer_candidates(uuid)
  to authenticated, service_role;

revoke all on function public.assert_data_room_document_clearance(uuid, uuid, text, text, bigint)
  from public, anon, authenticated, service_role;
grant execute on function public.assert_data_room_document_clearance(uuid, uuid, text, text, bigint)
  to authenticated, service_role;

revoke all on table
  public.data_room_document_clearances,
  public.data_room_document_clearance_attestations
from public, anon, authenticated;
grant select on table
  public.data_room_document_clearances,
  public.data_room_document_clearance_attestations
to authenticated;
grant all privileges on table
  public.data_room_document_clearances,
  public.data_room_document_clearance_attestations
to service_role;

notify pgrst, 'reload schema';
