create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

create type public.profile_role as enum ('investor', 'issuer', 'admin');
create type public.round_status as enum ('preparing', 'open', 'closed', 'archived');
create type public.document_status as enum ('draft', 'published', 'archived');
create type public.access_request_status as enum ('pending', 'approved', 'revoked');
create type public.data_room_activity_type as enum (
  'login',
  'open',
  'download',
  'upload',
  'publish',
  'folder_change',
  'metadata_change',
  'access_approved',
  'access_revoked'
);

create table public.issuers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  legal_name text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  issuer_id uuid references public.issuers(id) on delete set null,
  role public.profile_role not null default 'investor',
  email text not null,
  full_name text,
  last_seen_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint issuer_role_requires_issuer check (role <> 'issuer' or issuer_id is not null)
);

create unique index profiles_email_unique_idx on public.profiles (lower(email));
create index profiles_issuer_role_idx on public.profiles (issuer_id, role) where archived_at is null;

create table public.rounds (
  id uuid primary key default gen_random_uuid(),
  issuer_id uuid not null references public.issuers(id) on delete restrict,
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  ticker text not null,
  status public.round_status not null default 'preparing',
  opens_at timestamptz,
  closes_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (issuer_id, ticker)
);

create index rounds_issuer_status_idx on public.rounds (issuer_id, status) where archived_at is null;

create table public.data_rooms (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null unique references public.rounds(id) on delete restrict,
  slug text not null unique check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.data_room_folders (
  id uuid primary key default gen_random_uuid(),
  data_room_id uuid not null references public.data_rooms(id) on delete restrict,
  parent_id uuid,
  slug text not null check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text,
  readiness_status text not null default 'missing'
    check (readiness_status in ('ready', 'in_review', 'missing', 'gated')),
  sort_order integer not null default 0 check (sort_order >= 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (data_room_id, slug),
  unique (id, data_room_id),
  constraint folder_parent_belongs_to_data_room foreign key (parent_id, data_room_id)
    references public.data_room_folders(id, data_room_id) on delete restrict,
  constraint folder_not_own_parent check (parent_id is null or parent_id <> id)
);

create index data_room_folders_room_order_idx
  on public.data_room_folders (data_room_id, sort_order, name)
  where archived_at is null;
create index data_room_folders_parent_idx
  on public.data_room_folders (parent_id, sort_order)
  where archived_at is null;

create table public.data_room_documents (
  id uuid primary key default gen_random_uuid(),
  data_room_id uuid not null references public.data_rooms(id) on delete restrict,
  folder_id uuid not null,
  slug text not null check (slug = lower(slug) and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text,
  document_date date,
  status public.document_status not null default 'draft',
  sort_order integer not null default 0 check (sort_order >= 0),
  created_by uuid not null references public.profiles(id) on delete restrict,
  published_by uuid references public.profiles(id) on delete restrict,
  published_version_id uuid,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (data_room_id, slug),
  unique (id, data_room_id),
  constraint document_folder_belongs_to_data_room foreign key (folder_id, data_room_id)
    references public.data_room_folders(id, data_room_id) on delete restrict,
  constraint published_document_has_timestamp check (
    status <> 'published'
    or (
      published_version_id is not null
      and published_at is not null
      and archived_at is null
    )
  ),
  constraint archived_document_has_timestamp check (
    status <> 'archived' or archived_at is not null
  )
);

create index data_room_documents_room_status_idx
  on public.data_room_documents (data_room_id, status, sort_order, updated_at desc);
create index data_room_documents_folder_status_idx
  on public.data_room_documents (folder_id, status, sort_order, updated_at desc);

create table public.data_room_document_versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.data_room_documents(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  checksum_sha256 text check (checksum_sha256 is null or checksum_sha256 ~ '^[a-f0-9]{64}$'),
  is_current boolean not null default true,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  unique (document_id, version_number),
  unique (id, document_id)
);

alter table public.data_room_documents
  add constraint document_published_version_belongs_to_document
  foreign key (published_version_id, id)
  references public.data_room_document_versions(id, document_id)
  on delete restrict;

create unique index data_room_document_versions_current_idx
  on public.data_room_document_versions (document_id)
  where is_current and archived_at is null;
create index data_room_document_versions_history_idx
  on public.data_room_document_versions (document_id, version_number desc);

create table public.data_room_access_requests (
  id uuid primary key default gen_random_uuid(),
  data_room_id uuid not null references public.data_rooms(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  status public.access_request_status not null default 'pending',
  request_note text,
  resolution_note text,
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (data_room_id, user_id),
  constraint access_request_note_max_length check (
    request_note is null or char_length(request_note) <= 500
  ),
  constraint request_resolution_is_consistent check (
    (status = 'pending' and resolved_at is null and resolved_by is null)
    or (status in ('approved', 'revoked') and resolved_at is not null and resolved_by is not null)
  )
);

create index data_room_access_requests_queue_idx
  on public.data_room_access_requests (data_room_id, status, requested_at);

create table public.data_room_access_grants (
  id uuid primary key default gen_random_uuid(),
  data_room_id uuid not null references public.data_rooms(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  granted_by uuid not null references public.profiles(id) on delete restrict,
  granted_at timestamptz not null default now(),
  revoked_by uuid references public.profiles(id) on delete restrict,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (data_room_id, user_id),
  constraint grant_revocation_is_consistent check (
    (revoked_at is null and revoked_by is null)
    or (revoked_at is not null and revoked_by is not null)
  )
);

create index data_room_access_grants_active_idx
  on public.data_room_access_grants (data_room_id, user_id)
  where revoked_at is null;

create table public.data_room_visits (
  data_room_id uuid not null references public.data_rooms(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  last_visited_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (data_room_id, user_id)
);

create table public.data_room_activity_events (
  id uuid primary key default gen_random_uuid(),
  data_room_id uuid references public.data_rooms(id) on delete restrict,
  actor_user_id uuid not null references public.profiles(id) on delete restrict,
  document_id uuid,
  document_version_id uuid,
  event_type public.data_room_activity_type not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint activity_document_belongs_to_data_room foreign key (document_id, data_room_id)
    references public.data_room_documents(id, data_room_id) on delete restrict,
  constraint activity_version_belongs_to_document foreign key (document_version_id, document_id)
    references public.data_room_document_versions(id, document_id) on delete restrict,
  constraint activity_version_requires_document check (
    document_version_id is null or document_id is not null
  ),
  constraint login_event_has_no_document check (
    event_type <> 'login'
    or (document_id is null and document_version_id is null)
  ),
  constraint non_login_event_has_room check (
    event_type = 'login' or data_room_id is not null
  )
);

create index data_room_activity_events_room_time_idx
  on public.data_room_activity_events (data_room_id, occurred_at desc);
create index data_room_activity_events_actor_time_idx
  on public.data_room_activity_events (actor_user_id, occurred_at desc);
create index data_room_activity_events_document_time_idx
  on public.data_room_activity_events (document_id, occurred_at desc)
  where document_id is not null;

create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, new.id::text || '@invalid.local'),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function private.handle_new_user();

insert into public.profiles (id, email, full_name)
select
  u.id,
  coalesce(u.email, u.id::text || '@invalid.local'),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), '')
from auth.users u
on conflict (id) do update
set email = excluded.email,
    updated_at = now();

create function private.current_profile_role()
returns public.profile_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
    and p.archived_at is null
$$;

create function private.user_can_manage_data_room(target_data_room_id uuid)
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
      where p.id = (select auth.uid())
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
            and r.issuer_id = p.issuer_id
          )
        )
    ),
    false
  )
$$;

create function private.user_has_data_room_access(target_data_room_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    private.user_can_manage_data_room(target_data_room_id)
    or exists (
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
    ),
    false
  )
$$;

create function private.user_can_request_data_room(target_data_room_id uuid)
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

create function private.user_can_view_profile(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    target_user_id = (select auth.uid())
    or private.current_profile_role() = 'admin'
    or exists (
      select 1
      from public.profiles manager
      join public.issuers i on i.id = manager.issuer_id
      join public.rounds r on r.issuer_id = manager.issuer_id
      join public.data_rooms dr on dr.round_id = r.id
      join public.data_room_access_requests ar on ar.data_room_id = dr.id
      where manager.id = (select auth.uid())
        and manager.role = 'issuer'
        and manager.archived_at is null
        and i.archived_at is null
        and r.archived_at is null
        and r.status <> 'archived'
        and dr.archived_at is null
        and ar.user_id = target_user_id
    ),
    false
  )
$$;

create function private.user_can_view_document(target_document_id uuid)
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
            d.status = 'published'
            and d.archived_at is null
            and d.published_version_id is not null
            and private.user_has_data_room_access(d.data_room_id)
          )
        )
    ),
    false
  )
$$;

create function private.storage_data_room_id(object_name text)
returns uuid
language plpgsql
immutable
security invoker
set search_path = ''
as $$
declare
  first_segment text;
begin
  first_segment := split_part(object_name, '/', 1);
  if first_segment !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return null;
  end if;
  return first_segment::uuid;
exception when invalid_text_representation then
  return null;
end;
$$;

create function private.user_can_read_data_room_object(object_name text)
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
        and d.published_version_id = v.id
        and v.published_at is not null
        and v.archived_at is null
        and d.status = 'published'
        and d.archived_at is null
        and private.user_has_data_room_access(d.data_room_id)
    ),
    false
  )
$$;

create function private.audit_data_room_folder_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  action_name text;
begin
  if actor_id is null then
    return new;
  end if;

  action_name := case
    when tg_op = 'INSERT' then 'create'
    when old.archived_at is null and new.archived_at is not null then 'archive'
    else 'update'
  end;

  insert into public.data_room_activity_events (
    data_room_id,
    actor_user_id,
    event_type,
    metadata,
    occurred_at
  ) values (
    new.data_room_id,
    actor_id,
    'folder_change',
    jsonb_build_object(
      'action', action_name,
      'folder_id', new.id,
      'folder_name', new.name
    ),
    statement_timestamp()
  );

  return new;
end;
$$;

create function private.enforce_data_room_version_storage_path()
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
  then
    raise exception 'Storage path must match data room, document, and version'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create function private.audit_data_room_document_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := (select auth.uid());
  version_number integer;
begin
  if actor_id is null then
    return new;
  end if;

  if old.status <> 'archived' and new.status = 'archived' then
    insert into public.data_room_activity_events (
      data_room_id,
      actor_user_id,
      document_id,
      document_version_id,
      event_type,
      metadata,
      occurred_at
    ) values (
      new.data_room_id,
      actor_id,
      new.id,
      new.published_version_id,
      'metadata_change',
      jsonb_build_object('action', 'archive'),
      statement_timestamp()
    );
  elsif new.status = 'published'
    and (
      old.status <> 'published'
      or new.published_version_id is distinct from old.published_version_id
      or new.published_at is distinct from old.published_at
    )
  then
    select v.version_number into version_number
    from public.data_room_document_versions v
    where v.id = new.published_version_id;

    insert into public.data_room_activity_events (
      data_room_id,
      actor_user_id,
      document_id,
      document_version_id,
      event_type,
      metadata,
      occurred_at
    ) values (
      new.data_room_id,
      actor_id,
      new.id,
      new.published_version_id,
      'publish',
      jsonb_build_object('version_number', version_number),
      statement_timestamp()
    );
  elsif row(
    old.folder_id,
    old.slug,
    old.title,
    old.description,
    old.document_date,
    old.sort_order
  ) is distinct from row(
    new.folder_id,
    new.slug,
    new.title,
    new.description,
    new.document_date,
    new.sort_order
  )
  then
    insert into public.data_room_activity_events (
      data_room_id,
      actor_user_id,
      document_id,
      document_version_id,
      event_type,
      metadata,
      occurred_at
    ) values (
      new.data_room_id,
      actor_id,
      new.id,
      new.published_version_id,
      'metadata_change',
      jsonb_build_object('action', 'update'),
      statement_timestamp()
    );
  end if;

  return new;
end;
$$;

create function private.audit_data_room_version_upload()
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
      'original_filename', new.original_filename
    ),
    statement_timestamp()
  );

  return new;
end;
$$;

create function private.audit_data_room_access_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.status = new.status
    or new.status not in ('approved', 'revoked')
    or (select auth.uid()) is null
  then
    return new;
  end if;

  insert into public.data_room_activity_events (
    data_room_id,
    actor_user_id,
    event_type,
    metadata,
    occurred_at
  ) values (
    new.data_room_id,
    (select auth.uid()),
    case
      when new.status = 'approved' then 'access_approved'::public.data_room_activity_type
      else 'access_revoked'::public.data_room_activity_type
    end,
    jsonb_build_object('subject_user_id', new.user_id, 'request_id', new.id),
    statement_timestamp()
  );

  return new;
end;
$$;

revoke all on all functions in schema private from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.current_profile_role() to authenticated;
grant execute on function private.user_can_manage_data_room(uuid) to authenticated;
grant execute on function private.user_has_data_room_access(uuid) to authenticated;
grant execute on function private.user_can_request_data_room(uuid) to authenticated;
grant execute on function private.user_can_view_profile(uuid) to authenticated;
grant execute on function private.user_can_view_document(uuid) to authenticated;
grant execute on function private.storage_data_room_id(text) to authenticated;
grant execute on function private.user_can_read_data_room_object(text) to authenticated;
grant usage on schema private to service_role;
grant execute on all functions in schema private to service_role;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'issuers',
    'profiles',
    'rounds',
    'data_rooms',
    'data_room_folders',
    'data_room_documents',
    'data_room_access_requests',
    'data_room_access_grants',
    'data_room_visits'
  ]
  loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function private.set_updated_at()',
      table_name || '_set_updated_at',
      table_name
    );
  end loop;
end;
$$;

create trigger data_room_folders_audit_change
  after insert or update on public.data_room_folders
  for each row execute function private.audit_data_room_folder_change();

create trigger data_room_documents_audit_change
  after update on public.data_room_documents
  for each row execute function private.audit_data_room_document_change();

create trigger data_room_document_versions_enforce_storage_path
  before insert or update of id, document_id, storage_path
  on public.data_room_document_versions
  for each row execute function private.enforce_data_room_version_storage_path();

create trigger data_room_document_versions_audit_upload
  after insert on public.data_room_document_versions
  for each row execute function private.audit_data_room_version_upload();

create trigger data_room_access_requests_audit_status
  after update of status on public.data_room_access_requests
  for each row execute function private.audit_data_room_access_status();

alter table public.issuers enable row level security;
alter table public.profiles enable row level security;
alter table public.rounds enable row level security;
alter table public.data_rooms enable row level security;
alter table public.data_room_folders enable row level security;
alter table public.data_room_documents enable row level security;
alter table public.data_room_document_versions enable row level security;
alter table public.data_room_access_requests enable row level security;
alter table public.data_room_access_grants enable row level security;
alter table public.data_room_visits enable row level security;
alter table public.data_room_activity_events enable row level security;

create policy "profiles_select_authorized"
on public.profiles for select to authenticated
using (private.user_can_view_profile(id));

create policy "profiles_update_self"
on public.profiles for update to authenticated
using (id = (select auth.uid()) and archived_at is null)
with check (id = (select auth.uid()) and archived_at is null);

create policy "issuers_select_authorized"
on public.issuers for select to authenticated
using (
  archived_at is null
  and exists (
    select 1
    from public.rounds r
    join public.data_rooms dr on dr.round_id = r.id
    where r.issuer_id = issuers.id
      and private.user_has_data_room_access(dr.id)
  )
);

create policy "issuers_update_admin"
on public.issuers for update to authenticated
using (private.current_profile_role() = 'admin')
with check (private.current_profile_role() = 'admin');

create policy "rounds_select_authorized"
on public.rounds for select to authenticated
using (
  archived_at is null
  and exists (
    select 1 from public.data_rooms dr
    where dr.round_id = rounds.id
      and private.user_has_data_room_access(dr.id)
  )
);

create policy "data_rooms_select_authorized"
on public.data_rooms for select to authenticated
using (archived_at is null and private.user_has_data_room_access(id));

create policy "folders_select_authorized"
on public.data_room_folders for select to authenticated
using (
  private.user_can_manage_data_room(data_room_id)
  or (archived_at is null and private.user_has_data_room_access(data_room_id))
);

create policy "folders_insert_manager"
on public.data_room_folders for insert to authenticated
with check (private.user_can_manage_data_room(data_room_id));

create policy "folders_update_manager"
on public.data_room_folders for update to authenticated
using (private.user_can_manage_data_room(data_room_id))
with check (private.user_can_manage_data_room(data_room_id));

create policy "documents_select_authorized"
on public.data_room_documents for select to authenticated
using (
  private.user_can_manage_data_room(data_room_id)
  or (
    status = 'published'
    and archived_at is null
    and private.user_has_data_room_access(data_room_id)
  )
);

create policy "documents_insert_manager"
on public.data_room_documents for insert to authenticated
with check (
  created_by = (select auth.uid())
  and private.user_can_manage_data_room(data_room_id)
);

create policy "documents_update_manager"
on public.data_room_documents for update to authenticated
using (private.user_can_manage_data_room(data_room_id))
with check (private.user_can_manage_data_room(data_room_id));

create policy "versions_select_authorized"
on public.data_room_document_versions for select to authenticated
using (
  exists (
    select 1
    from public.data_room_documents d
    where d.id = data_room_document_versions.document_id
      and (
        private.user_can_manage_data_room(d.data_room_id)
        or (
          d.published_version_id = data_room_document_versions.id
          and data_room_document_versions.published_at is not null
          and private.user_can_view_document(data_room_document_versions.document_id)
        )
      )
  )
);

create policy "access_requests_select_self_or_manager"
on public.data_room_access_requests for select to authenticated
using (
  user_id = (select auth.uid())
  or private.user_can_manage_data_room(data_room_id)
);

create policy "access_requests_insert_self"
on public.data_room_access_requests for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and resolved_at is null
  and resolved_by is null
  and private.user_can_request_data_room(data_room_id)
);

create policy "access_grants_select_self_or_manager"
on public.data_room_access_grants for select to authenticated
using (
  user_id = (select auth.uid())
  or private.user_can_manage_data_room(data_room_id)
);

create policy "visits_select_self_or_manager"
on public.data_room_visits for select to authenticated
using (
  user_id = (select auth.uid())
  or private.user_can_manage_data_room(data_room_id)
);

create policy "visits_insert_self"
on public.data_room_visits for insert to authenticated
with check (
  user_id = (select auth.uid())
  and private.user_has_data_room_access(data_room_id)
);

create policy "visits_update_self"
on public.data_room_visits for update to authenticated
using (
  user_id = (select auth.uid())
  and private.user_has_data_room_access(data_room_id)
)
with check (
  user_id = (select auth.uid())
  and private.user_has_data_room_access(data_room_id)
);

create policy "activity_select_self_or_manager"
on public.data_room_activity_events for select to authenticated
using (
  actor_user_id = (select auth.uid())
  or (data_room_id is not null and private.user_can_manage_data_room(data_room_id))
);

create function public.can_manage_data_room(target_data_room_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.user_can_manage_data_room(target_data_room_id)
$$;

create function public.append_data_room_document_version(
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

  if nullif(trim(target_original_filename), '') is null
    or nullif(trim(target_mime_type), '') is null
    or target_size_bytes is null
    or target_size_bytes <= 0
  then
    raise exception 'Version metadata is incomplete' using errcode = '23514';
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
    trim(target_mime_type),
    target_size_bytes,
    nullif(lower(trim(target_checksum_sha256)), ''),
    true,
    actor_user_id,
    null,
    null
  )
  returning * into appended_version;

  return appended_version;
end;
$$;

create function public.resolve_data_room_access(
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

create function public.publish_data_room_document(target_document_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_document public.data_room_documents;
  target_version public.data_room_document_versions;
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
    and archived_at is null;

  if target_version.id is null then
    raise exception 'A current document version is required before publishing' using errcode = '23514';
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

create function public.archive_data_room_document(target_document_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_user_id uuid := (select auth.uid());
  target_document public.data_room_documents;
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

  update public.data_room_documents
  set status = 'archived',
      archived_at = now()
  where id = target_document.id;
end;
$$;

revoke all on function public.can_manage_data_room(uuid) from public, anon;
grant execute on function public.can_manage_data_room(uuid) to authenticated;
grant execute on function public.can_manage_data_room(uuid) to service_role;
revoke all on function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text
) from public, anon, authenticated, service_role;
grant execute on function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text
) to authenticated;
grant execute on function public.append_data_room_document_version(
  uuid, uuid, text, text, text, bigint, text
) to service_role;
revoke all on function public.resolve_data_room_access(uuid, public.access_request_status, text)
  from public, anon, authenticated, service_role;
grant execute on function public.resolve_data_room_access(uuid, public.access_request_status, text)
  to authenticated;
grant execute on function public.resolve_data_room_access(uuid, public.access_request_status, text)
  to service_role;
revoke all on function public.publish_data_room_document(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.publish_data_room_document(uuid) to authenticated;
grant execute on function public.publish_data_room_document(uuid) to service_role;
revoke all on function public.archive_data_room_document(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.archive_data_room_document(uuid) to authenticated;
grant execute on function public.archive_data_room_document(uuid) to service_role;

revoke all on all tables in schema public from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, last_seen_at) on public.profiles to authenticated;

grant select on public.issuers, public.rounds, public.data_rooms to authenticated;
grant update on public.issuers to authenticated;

grant select, insert, update on public.data_room_folders to authenticated;
grant select, insert on public.data_room_documents to authenticated;
grant update (folder_id, title, description, document_date, sort_order)
  on public.data_room_documents to authenticated;
grant select on public.data_room_document_versions to authenticated;

grant select on public.data_room_access_requests to authenticated;
grant insert (data_room_id, user_id, request_note) on public.data_room_access_requests to authenticated;

grant select on public.data_room_access_grants to authenticated;
grant select, insert, update on public.data_room_visits to authenticated;
grant select on public.data_room_activity_events to authenticated;

grant all privileges on table
  public.issuers,
  public.profiles,
  public.rounds,
  public.data_rooms,
  public.data_room_folders,
  public.data_room_documents,
  public.data_room_document_versions,
  public.data_room_access_requests,
  public.data_room_access_grants,
  public.data_room_visits,
  public.data_room_activity_events
to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'data-room-documents',
  'data-room-documents',
  false,
  26214400,
  array[
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "data_room_objects_insert_manager"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'data-room-documents'
  and private.user_can_manage_data_room(private.storage_data_room_id(name))
);
