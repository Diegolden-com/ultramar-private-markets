-- A round status is not a release decision. This gate is global for the LCX
-- secondary-transfer workspace only; it deliberately does not constrain future
-- unrelated data rooms. It defaults to internal preparation and opens only
-- against an approved, fresh, versioned manifest. Managers retain their
-- existing draft, upload, clearance, and remediation powers while it is closed.

create type public.data_room_release_state as enum (
  'internal_preparation',
  'diligence_open'
);

create table public.data_room_release_manifests (
  id uuid primary key default gen_random_uuid(),
  manifest_revision bigint generated always as identity unique,
  manifest_schema_version smallint not null default 1
    check (manifest_schema_version = 1),
  release_context_data_room_id uuid not null
    references public.data_rooms(id) on delete restrict,
  scenario text not null default 'consolidated-secondary'
    check (scenario = 'consolidated-secondary'),
  finance_schema_version smallint not null default 3
    check (finance_schema_version = 3),
  -- This is an opaque ID from the PWA approval record, not a foreign key: the
  -- PWA and Ultramar databases are intentionally separate trust boundaries.
  pwa_approval_attestation_id uuid not null,
  pwa_source_id text not null
    check (
      pwa_source_id = btrim(pwa_source_id)
      and char_length(pwa_source_id) between 1 and 200
    ),
  -- Preserve both PWA hashes. The manifest/source hash binds the approved
  -- declaration; the snapshot/payload hash binds the rendered payload.
  pwa_manifest_sha256 text not null
    check (pwa_manifest_sha256 ~ '^[a-f0-9]{64}$'),
  pwa_snapshot_sha256 text not null
    check (pwa_snapshot_sha256 ~ '^[a-f0-9]{64}$'),
  -- PWA modelAsOf is a calendar cut, not a timestamp. Keep the same semantic
  -- representation here and reserve timestamps for publication freshness.
  model_as_of date not null,
  freshness_due_at timestamptz not null,
  approval_attestation text not null default 'This release manifest binds a controlled diligence opening to the approved PWA snapshot reference, model cut, freshness limit, and four human attestations. It contains no pricing, valuation, allocation, or transaction terms.'
    check (approval_attestation = 'This release manifest binds a controlled diligence opening to the approved PWA snapshot reference, model cut, freshness limit, and four human attestations. It contains no pricing, valuation, allocation, or transaction terms.'),
  finance_ops_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  redaction_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  counsel_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  data_room_admin_reviewer_id uuid not null references public.profiles(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint data_room_release_manifest_freshness_is_ordered
    check (
      freshness_due_at > (model_as_of::timestamp at time zone 'UTC')
      and freshness_due_at <= ((model_as_of::timestamp at time zone 'UTC') + interval '31 days')
    ),
  constraint data_room_release_manifest_reviewer_assignments_distinct check (
    finance_ops_reviewer_id <> redaction_reviewer_id
    and finance_ops_reviewer_id <> counsel_reviewer_id
    and finance_ops_reviewer_id <> data_room_admin_reviewer_id
    and redaction_reviewer_id <> counsel_reviewer_id
    and redaction_reviewer_id <> data_room_admin_reviewer_id
    and counsel_reviewer_id <> data_room_admin_reviewer_id
  )
);

create index data_room_release_manifests_context_created_idx
  on public.data_room_release_manifests (release_context_data_room_id, created_at desc);

create table public.data_room_release_manifest_attestations (
  id uuid primary key default gen_random_uuid(),
  manifest_id uuid not null
    references public.data_room_release_manifests(id) on delete restrict,
  review_role public.data_room_clearance_review_role not null,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  attestation_statement text not null default 'I reviewed the controlled release manifest for the declared scenario and confirm its opaque PWA snapshot reference, model cut, freshness limit, and approval gate are accurate for this diligence release. This attestation does not approve pricing, valuation, allocation, or transaction terms.'
    check (attestation_statement = 'I reviewed the controlled release manifest for the declared scenario and confirm its opaque PWA snapshot reference, model cut, freshness limit, and approval gate are accurate for this diligence release. This attestation does not approve pricing, valuation, allocation, or transaction terms.'),
  attested_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (manifest_id, review_role),
  unique (manifest_id, reviewer_id)
);

create index data_room_release_manifest_attestations_manifest_idx
  on public.data_room_release_manifest_attestations (manifest_id, review_role);

create table public.data_room_release_gate (
  data_room_id uuid primary key
    references public.data_rooms(id) on delete restrict,
  state public.data_room_release_state not null default 'internal_preparation',
  active_manifest_id uuid
    references public.data_room_release_manifests(id) on delete restrict,
  opened_at timestamptz,
  opened_by uuid references public.profiles(id) on delete restrict,
  closed_at timestamptz,
  closed_by uuid references public.profiles(id) on delete restrict,
  updated_at timestamptz not null default now(),
  constraint data_room_release_gate_open_requires_manifest check (
    state <> 'diligence_open' or active_manifest_id is not null
  )
);

-- Existing installations may already have the seeded LCX room. A fresh
-- migration runs before seed.sql, so create the row only when the room exists;
-- seed.sql performs the matching idempotent upsert after it creates the room.
insert into public.data_room_release_gate (data_room_id, state)
select id, 'internal_preparation'::public.data_room_release_state
from public.data_rooms
where id = '33333333-3333-4333-8333-333333333333'::uuid
on conflict (data_room_id) do nothing;

create function private.assert_data_room_release_reviewer_assignments(
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
    raise exception 'Each release reviewer must be an active manager for the release-context data room'
      using errcode = '23514';
  end if;
end;
$$;

create function private.data_room_release_manifest_is_approved(target_manifest_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.data_room_release_manifests m
      where m.id = target_manifest_id
        and m.manifest_schema_version = 1
        and m.release_context_data_room_id = '33333333-3333-4333-8333-333333333333'::uuid
        and m.scenario = 'consolidated-secondary'
        and m.finance_schema_version = 3
        and m.pwa_approval_attestation_id is not null
        and m.pwa_source_id = btrim(m.pwa_source_id)
        and char_length(m.pwa_source_id) between 1 and 200
        and m.pwa_manifest_sha256 ~ '^[a-f0-9]{64}$'
        and m.pwa_snapshot_sha256 ~ '^[a-f0-9]{64}$'
        and m.model_as_of <= (statement_timestamp() at time zone 'UTC')::date
        and m.model_as_of >= ((statement_timestamp() at time zone 'UTC')::date - 31)
        and m.freshness_due_at > statement_timestamp()
        and m.freshness_due_at <= (statement_timestamp() + interval '31 days')
        and m.freshness_due_at <= ((m.model_as_of::timestamp at time zone 'UTC') + interval '31 days')
        and private.profile_can_review_data_room(m.finance_ops_reviewer_id, m.release_context_data_room_id)
        and private.profile_can_review_data_room(m.redaction_reviewer_id, m.release_context_data_room_id)
        and private.profile_can_review_data_room(m.counsel_reviewer_id, m.release_context_data_room_id)
        and private.profile_can_review_data_room(m.data_room_admin_reviewer_id, m.release_context_data_room_id)
        and exists (
          select 1
          from public.data_room_release_manifest_attestations a
          where a.manifest_id = m.id
            and a.review_role = 'finance_ops'
            and a.reviewer_id = m.finance_ops_reviewer_id
        )
        and exists (
          select 1
          from public.data_room_release_manifest_attestations a
          where a.manifest_id = m.id
            and a.review_role = 'redaction'
            and a.reviewer_id = m.redaction_reviewer_id
        )
        and exists (
          select 1
          from public.data_room_release_manifest_attestations a
          where a.manifest_id = m.id
            and a.review_role = 'counsel'
            and a.reviewer_id = m.counsel_reviewer_id
        )
        and exists (
          select 1
          from public.data_room_release_manifest_attestations a
          where a.manifest_id = m.id
            and a.review_role = 'data_room_admin'
            and a.reviewer_id = m.data_room_admin_reviewer_id
        )
        and (
          select count(*)
          from public.data_room_release_manifest_attestations a
          where a.manifest_id = m.id
        ) = 4
    ),
    false
  )
$$;

create function private.data_room_diligence_is_open(target_data_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    -- The LCX launch control must not accidentally freeze future data rooms.
    when target_data_room_id <> '33333333-3333-4333-8333-333333333333'::uuid then true
    else coalesce(
      exists (
        select 1
        from public.data_room_release_gate g
        where g.data_room_id = '33333333-3333-4333-8333-333333333333'::uuid
          and g.state = 'diligence_open'
          and g.active_manifest_id is not null
          and private.data_room_release_manifest_is_approved(g.active_manifest_id)
      ),
      false
    )
  end
$$;

-- All unauthenticated and authenticated UI callers receive only the effective
-- binary state. It intentionally does not expose the manifest, reviewer
-- identities, source ID, or hash.
create function public.get_data_room_release_state()
returns public.data_room_release_state
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when private.data_room_diligence_is_open('33333333-3333-4333-8333-333333333333'::uuid)
      then 'diligence_open'::public.data_room_release_state
    else 'internal_preparation'::public.data_room_release_state
  end
$$;

-- Preserve manager access during preparation, but make investor grants
-- ineffective until the global release predicate is fully satisfied.
create or replace function private.user_has_data_room_access(target_data_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    private.user_can_manage_data_room(target_data_room_id)
    or (
      private.data_room_diligence_is_open(target_data_room_id)
      and exists (
        select 1
        from public.data_room_access_grants g
        join public.profiles p on p.id = g.user_id
        join public.data_rooms dr on dr.id = g.data_room_id
        join public.rounds r on r.id = dr.round_id
        join public.issuers i on i.id = r.issuer_id
        where g.data_room_id = target_data_room_id
          and g.user_id = (select auth.uid())
          and g.revoked_at is null
          and p.archived_at is null
          and dr.archived_at is null
          and r.archived_at is null
          and r.status <> 'archived'
          and i.archived_at is null
      )
    ),
    false
  )
$$;

create or replace function private.user_can_request_data_room(target_data_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    private.data_room_diligence_is_open(target_data_room_id)
    and exists (
      select 1
      from public.profiles p
      join public.data_rooms dr on dr.id = target_data_room_id
      join public.rounds r on r.id = dr.round_id
      join public.issuers i on i.id = r.issuer_id
      where p.id = (select auth.uid())
        and p.archived_at is null
        and dr.archived_at is null
        and r.archived_at is null
        and r.status <> 'archived'
        and i.archived_at is null
    ),
    false
  )
$$;

create or replace function private.user_can_view_document(target_document_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.data_room_documents d
      where d.id = target_document_id
        and (
          private.user_can_manage_data_room(d.data_room_id)
          or (
            private.data_room_diligence_is_open(d.data_room_id)
            and d.status = 'published'
            and d.archived_at is null
            and d.published_version_id is not null
            and private.data_room_clearance_is_active_for_version(d.published_version_id)
            and private.user_has_data_room_access(d.data_room_id)
          )
        )
    ),
    false
  )
$$;

create or replace function private.user_can_read_data_room_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    private.user_can_manage_data_room(private.storage_data_room_id(object_name))
    or exists (
      select 1
      from public.data_room_document_versions v
      join public.data_room_documents d on d.id = v.document_id
      where v.storage_path = object_name
        and v.archived_at is null
        and private.data_room_clearance_is_active_for_version(v.id)
        and private.data_room_diligence_is_open(d.data_room_id)
        and d.published_version_id = v.id
        and v.published_at is not null
        and d.status = 'published'
        and d.archived_at is null
        and private.user_has_data_room_access(d.data_room_id)
    ),
    false
  )
$$;

create or replace function public.can_view_data_room_document_version(
  target_document_id uuid,
  target_version_id uuid
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
      from public.data_room_documents d
      join public.data_room_document_versions v
        on v.id = target_version_id
       and v.document_id = d.id
      where d.id = target_document_id
        and v.archived_at is null
        and private.data_room_clearance_is_active_for_version(v.id)
        and (
          private.user_can_manage_data_room(d.data_room_id)
          or (
            private.data_room_diligence_is_open(d.data_room_id)
            and d.status = 'published'
            and d.archived_at is null
            and d.published_version_id = v.id
            and v.published_at is not null
            and private.user_has_data_room_access(d.data_room_id)
          )
        )
    ),
    false
  )
$$;

create or replace function public.resolve_data_room_access(
  request_id uuid,
  resolution public.access_request_status,
  note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_request public.data_room_access_requests;
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  if resolution not in ('approved', 'revoked') then
    raise exception 'Resolution must be approved or revoked' using errcode = '22023';
  end if;

  select * into target_request
  from public.data_room_access_requests
  where id = request_id
  for update;

  if target_request.id is null
    or not private.user_can_manage_data_room(target_request.data_room_id)
  then
    raise exception 'Access request not found or not manageable' using errcode = '42501';
  end if;

  if resolution = 'approved' and not private.data_room_diligence_is_open(target_request.data_room_id) then
    raise exception 'Diligence is not open; investor access cannot be approved'
      using errcode = '23514';
  end if;

  update public.data_room_access_requests
  set status = resolution,
      resolution_note = nullif(trim(note), ''),
      resolved_at = now(),
      resolved_by = actor_user_id
  where id = target_request.id;

  if resolution = 'approved' then
    insert into public.data_room_access_grants (
      data_room_id,
      user_id,
      granted_by,
      granted_at,
      revoked_by,
      revoked_at
    ) values (
      target_request.data_room_id,
      target_request.user_id,
      actor_user_id,
      now(),
      null,
      null
    )
    on conflict (data_room_id, user_id) do update
      set granted_by = excluded.granted_by,
          granted_at = excluded.granted_at,
          revoked_by = null,
          revoked_at = null;
  else
    update public.data_room_access_grants
    set revoked_by = actor_user_id,
        revoked_at = now()
    where data_room_id = target_request.data_room_id
      and user_id = target_request.user_id
      and revoked_at is null;
  end if;
end;
$$;

create function public.create_data_room_release_manifest(
  target_release_context_data_room_id uuid,
  target_pwa_approval_attestation_id uuid,
  target_pwa_source_id text,
  target_pwa_manifest_sha256 text,
  target_pwa_snapshot_sha256 text,
  target_model_as_of date,
  target_freshness_due_at timestamptz,
  target_finance_ops_reviewer_id uuid,
  target_redaction_reviewer_id uuid,
  target_counsel_reviewer_id uuid,
  target_data_room_admin_reviewer_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  created_manifest_id uuid;
  normalized_source_id text := btrim(coalesce(target_pwa_source_id, ''));
  normalized_manifest_sha256 text := lower(btrim(coalesce(target_pwa_manifest_sha256, '')));
  normalized_snapshot_sha256 text := lower(btrim(coalesce(target_pwa_snapshot_sha256, '')));
begin
  if actor_user_id is null
    or not private.user_can_manage_data_room(target_release_context_data_room_id)
  then
    raise exception 'Release context is not manageable' using errcode = '42501';
  end if;

  if target_release_context_data_room_id <> '33333333-3333-4333-8333-333333333333'::uuid then
    raise exception 'This release manifest is reserved for the LCX secondary-transfer data room'
      using errcode = '22023';
  end if;

  if target_pwa_approval_attestation_id is null
    or char_length(normalized_source_id) not between 1 and 200
    or normalized_manifest_sha256 !~ '^[a-f0-9]{64}$'
    or normalized_snapshot_sha256 !~ '^[a-f0-9]{64}$'
    or target_model_as_of is null
    or target_freshness_due_at is null
    or target_model_as_of > (statement_timestamp() at time zone 'UTC')::date
    or target_model_as_of < ((statement_timestamp() at time zone 'UTC')::date - 31)
    or target_freshness_due_at <= statement_timestamp()
    or target_freshness_due_at > (statement_timestamp() + interval '31 days')
    or target_freshness_due_at <= (target_model_as_of::timestamp at time zone 'UTC')
    or target_freshness_due_at > ((target_model_as_of::timestamp at time zone 'UTC') + interval '31 days')
  then
    raise exception 'Release manifest requires an opaque PWA approval ID, source ID, hashes, a model cut no more than 31 days old, and a future freshness limit no more than 31 days away'
      using errcode = '23514';
  end if;

  perform private.assert_data_room_release_reviewer_assignments(
    target_release_context_data_room_id,
    target_finance_ops_reviewer_id,
    target_redaction_reviewer_id,
    target_counsel_reviewer_id,
    target_data_room_admin_reviewer_id
  );

  insert into public.data_room_release_manifests (
    release_context_data_room_id,
    scenario,
    finance_schema_version,
    pwa_approval_attestation_id,
    pwa_source_id,
    pwa_manifest_sha256,
    pwa_snapshot_sha256,
    model_as_of,
    freshness_due_at,
    finance_ops_reviewer_id,
    redaction_reviewer_id,
    counsel_reviewer_id,
    data_room_admin_reviewer_id,
    created_by
  ) values (
    target_release_context_data_room_id,
    'consolidated-secondary',
    3,
    target_pwa_approval_attestation_id,
    normalized_source_id,
    normalized_manifest_sha256,
    normalized_snapshot_sha256,
    target_model_as_of,
    target_freshness_due_at,
    target_finance_ops_reviewer_id,
    target_redaction_reviewer_id,
    target_counsel_reviewer_id,
    target_data_room_admin_reviewer_id,
    actor_user_id
  )
  returning id into created_manifest_id;

  return created_manifest_id;
end;
$$;

create function public.attest_data_room_release_manifest(
  target_manifest_id uuid,
  target_review_role public.data_room_clearance_review_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_manifest public.data_room_release_manifests;
  expected_reviewer_id uuid;
begin
  if actor_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  select * into target_manifest
  from public.data_room_release_manifests
  where id = target_manifest_id
  for update;

  if target_manifest.id is null then
    raise exception 'Release manifest not found' using errcode = '42501';
  end if;

  expected_reviewer_id := case target_review_role
    when 'finance_ops' then target_manifest.finance_ops_reviewer_id
    when 'redaction' then target_manifest.redaction_reviewer_id
    when 'counsel' then target_manifest.counsel_reviewer_id
    when 'data_room_admin' then target_manifest.data_room_admin_reviewer_id
  end;

  if expected_reviewer_id is distinct from actor_user_id
    or not private.profile_can_review_data_room(actor_user_id, target_manifest.release_context_data_room_id)
  then
    raise exception 'Only the assigned active reviewer may record this release attestation'
      using errcode = '42501';
  end if;

  insert into public.data_room_release_manifest_attestations (
    manifest_id,
    review_role,
    reviewer_id
  ) values (
    target_manifest.id,
    target_review_role,
    actor_user_id
  )
  on conflict (manifest_id, review_role) do nothing;
end;
$$;

create function public.open_data_room_diligence(target_manifest_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_manifest public.data_room_release_manifests;
begin
  if actor_user_id is null
    or private.current_profile_role() <> 'admin'
  then
    raise exception 'Only an active platform administrator may open diligence' using errcode = '42501';
  end if;

  select * into target_manifest
  from public.data_room_release_manifests
  where id = target_manifest_id
  for update;

  if target_manifest.id is null
    or not private.data_room_release_manifest_is_approved(target_manifest.id)
  then
    raise exception 'Diligence requires a fresh release manifest with four valid human attestations'
      using errcode = '23514';
  end if;

  perform 1
  from public.data_room_release_gate
  where data_room_id = target_manifest.release_context_data_room_id
  for update;

  if not found then
    raise exception 'Global release gate is unavailable' using errcode = '23514';
  end if;

  update public.data_room_release_gate
  set state = 'diligence_open',
      active_manifest_id = target_manifest.id,
      opened_at = statement_timestamp(),
      opened_by = actor_user_id,
      closed_at = null,
      closed_by = null,
      updated_at = statement_timestamp()
  where data_room_id = target_manifest.release_context_data_room_id;

  insert into public.data_room_activity_events (
    data_room_id,
    actor_user_id,
    event_type,
    metadata,
    occurred_at
  ) values (
    target_manifest.release_context_data_room_id,
    actor_user_id,
    'metadata_change',
    jsonb_build_object('action', 'release_opened', 'manifest_id', target_manifest.id, 'manifest_revision', target_manifest.manifest_revision),
    statement_timestamp()
  );
end;
$$;

create function public.close_data_room_diligence()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  closing_manifest public.data_room_release_manifests;
begin
  if actor_user_id is null
    or private.current_profile_role() <> 'admin'
  then
    raise exception 'Only an active platform administrator may close diligence' using errcode = '42501';
  end if;

  select m.* into closing_manifest
  from public.data_room_release_gate g
  left join public.data_room_release_manifests m on m.id = g.active_manifest_id
  where g.data_room_id = '33333333-3333-4333-8333-333333333333'::uuid
  for update of g;

  update public.data_room_release_gate
  set state = 'internal_preparation',
      active_manifest_id = null,
      closed_at = statement_timestamp(),
      closed_by = actor_user_id,
      updated_at = statement_timestamp()
  where data_room_id = '33333333-3333-4333-8333-333333333333'::uuid;

  if closing_manifest.id is not null then
    insert into public.data_room_activity_events (
      data_room_id,
      actor_user_id,
      event_type,
      metadata,
      occurred_at
    ) values (
      closing_manifest.release_context_data_room_id,
      actor_user_id,
      'metadata_change',
      jsonb_build_object('action', 'release_closed', 'manifest_id', closing_manifest.id, 'manifest_revision', closing_manifest.manifest_revision),
      statement_timestamp()
    );
  end if;
end;
$$;

alter table public.data_room_release_manifests enable row level security;
alter table public.data_room_release_manifest_attestations enable row level security;
alter table public.data_room_release_gate enable row level security;

create policy "data_room_release_manifests_select_manager"
on public.data_room_release_manifests for select to authenticated
using (private.user_can_manage_data_room(release_context_data_room_id));

create policy "data_room_release_manifest_attestations_select_manager"
on public.data_room_release_manifest_attestations for select to authenticated
using (
  exists (
    select 1
    from public.data_room_release_manifests m
    where m.id = data_room_release_manifest_attestations.manifest_id
      and private.user_can_manage_data_room(m.release_context_data_room_id)
  )
);

create policy "data_room_release_gate_select_platform_admin"
on public.data_room_release_gate for select to authenticated
using (private.current_profile_role() = 'admin');

revoke all on function private.assert_data_room_release_reviewer_assignments(uuid, uuid, uuid, uuid, uuid)
  from public, anon, authenticated;
revoke all on function private.data_room_release_manifest_is_approved(uuid)
  from public, anon, authenticated;
revoke all on function private.data_room_diligence_is_open(uuid)
  from public, anon, authenticated;
grant execute on function private.assert_data_room_release_reviewer_assignments(uuid, uuid, uuid, uuid, uuid)
  to service_role;
grant execute on function private.data_room_release_manifest_is_approved(uuid)
  to service_role;
grant execute on function private.data_room_diligence_is_open(uuid)
  to service_role;

revoke all on function public.get_data_room_release_state()
  from public, anon, authenticated, service_role;
grant execute on function public.get_data_room_release_state()
  to anon, authenticated, service_role;

revoke all on function public.create_data_room_release_manifest(
  uuid, uuid, text, text, text, date, timestamptz, uuid, uuid, uuid, uuid
) from public, anon, authenticated, service_role;
grant execute on function public.create_data_room_release_manifest(
  uuid, uuid, text, text, text, date, timestamptz, uuid, uuid, uuid, uuid
) to authenticated, service_role;

revoke all on function public.attest_data_room_release_manifest(
  uuid, public.data_room_clearance_review_role
) from public, anon, authenticated, service_role;
grant execute on function public.attest_data_room_release_manifest(
  uuid, public.data_room_clearance_review_role
) to authenticated, service_role;

revoke all on function public.open_data_room_diligence(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.open_data_room_diligence(uuid)
  to authenticated, service_role;

revoke all on function public.close_data_room_diligence()
  from public, anon, authenticated, service_role;
grant execute on function public.close_data_room_diligence()
  to authenticated, service_role;

revoke all on function public.resolve_data_room_access(uuid, public.access_request_status, text)
  from public, anon, authenticated, service_role;
grant execute on function public.resolve_data_room_access(uuid, public.access_request_status, text)
  to authenticated, service_role;

revoke all on function public.can_view_data_room_document_version(uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.can_view_data_room_document_version(uuid, uuid)
  to authenticated, service_role;

revoke all on table
  public.data_room_release_manifests,
  public.data_room_release_manifest_attestations,
  public.data_room_release_gate
from public, anon, authenticated;
grant select on table
  public.data_room_release_manifests,
  public.data_room_release_manifest_attestations
to authenticated;
grant all privileges on table
  public.data_room_release_manifests,
  public.data_room_release_manifest_attestations,
  public.data_room_release_gate
to service_role;

notify pgrst, 'reload schema';
