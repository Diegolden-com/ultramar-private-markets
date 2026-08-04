-- LCX is a secondary-transfer diligence room. Raw workbooks and tabular source
-- files must never enter its private bucket, even when a manager bypasses the
-- browser UI and calls Storage/RPC endpoints directly.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'data-room-documents',
  'data-room-documents',
  false,
  26214400,
  array['application/pdf', 'image/jpeg', 'image/png']::text[]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Uploads now pass through the authenticated server route, which checks file
-- bytes and calculates the checksum. Do not leave an authenticated Storage
-- INSERT policy that could bypass those checks.
drop policy if exists "data_room_objects_insert_manager" on storage.objects;

create or replace function private.is_safe_data_room_derivative(
  target_filename text,
  target_mime_type text
)
returns boolean
language plpgsql
immutable
security invoker
set search_path = ''
as $$
declare
  normalized_filename text := lower(trim(target_filename));
  normalized_mime_type text := lower(trim(target_mime_type));
begin
  if normalized_filename is null
    or normalized_filename = ''
    or char_length(normalized_filename) > 180
    or position('/' in normalized_filename) > 0
    or position(chr(92) in normalized_filename) > 0
    or normalized_filename ~ '(^|[.])(xlsx?|xlsm|xlsb|csv|tsv|ods|numbers)([.]|$)'
  then
    return false;
  end if;

  return case normalized_mime_type
    when 'application/pdf' then normalized_filename ~ '[.]pdf$'
    when 'image/jpeg' then normalized_filename ~ '[.](jpg|jpeg)$'
    when 'image/png' then normalized_filename ~ '[.]png$'
    else false
  end;
end;
$$;

revoke all on function private.is_safe_data_room_derivative(text, text)
  from public, anon, authenticated;

-- Existing files remain in immutable history, but an unsupported prior version
-- can no longer be current or published after this policy takes effect.
with invalid_versions as (
  update public.data_room_document_versions v
  set is_current = false,
      published_at = null,
      archived_at = coalesce(v.archived_at, statement_timestamp())
  where not private.is_safe_data_room_derivative(v.original_filename, v.mime_type)
     or not private.is_safe_data_room_derivative(split_part(v.storage_path, '/', 3), v.mime_type)
  returning v.id
)
update public.data_room_documents d
set status = 'draft',
    published_version_id = null,
    published_at = null
where d.archived_at is null
  and d.published_version_id in (select id from invalid_versions);

alter table public.data_room_document_versions
  drop constraint if exists data_room_document_versions_checksum_sha256_check;

-- NOT VALID preserves the historical audit record while enforcing a real
-- checksum on every new version from this point forward.
alter table public.data_room_document_versions
  add constraint data_room_document_versions_checksum_sha256_check
  check (checksum_sha256 ~ '^[a-f0-9]{64}$') not valid;

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
  then
    raise exception 'Data-room versions must use a reviewed redacted derivative with a SHA-256 checksum'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create or replace function public.append_data_room_document_version(
  target_document_id uuid,
  target_version_id uuid,
  target_storage_path text,
  target_original_filename text,
  target_mime_type text,
  target_size_bytes bigint,
  target_checksum_sha256 text default null
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
    true,
    actor_user_id,
    null,
    null
  )
  returning * into appended_version;

  return appended_version;
end;
$$;
