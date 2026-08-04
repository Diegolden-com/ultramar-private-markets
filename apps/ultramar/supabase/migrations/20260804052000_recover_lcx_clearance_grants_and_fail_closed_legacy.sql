-- Recovery for the first clearance-gate migration. The original baseline RLS
-- policies invoke selected private authorization helpers as authenticated. A
-- schema-wide revoke accidentally removed those grants in an already-applied
-- local migration. Restore only the documented baseline grants, then fail
-- closed every legacy LCX version that pre-dates a human clearance.

grant usage on schema private to authenticated;
grant usage on schema private to service_role;

grant execute on function private.current_profile_role() to authenticated;
grant execute on function private.user_can_manage_data_room(uuid) to authenticated;
grant execute on function private.user_has_data_room_access(uuid) to authenticated;
grant execute on function private.user_can_request_data_room(uuid) to authenticated;
grant execute on function private.user_can_view_profile(uuid) to authenticated;
grant execute on function private.user_can_view_document(uuid) to authenticated;
grant execute on function private.storage_data_room_id(text) to authenticated;
grant execute on function private.user_can_read_data_room_object(text) to authenticated;

-- A nullable clearance_id retains immutable legacy history. It must never
-- retain an active/current or investor-visible state after this migration.
-- Keep original publication data and file metadata intact for remediation and
-- audit; only archive the legacy version and the document it had published.
update public.data_room_document_versions v
set is_current = false,
    archived_at = coalesce(v.archived_at, statement_timestamp())
from public.data_room_documents d
where d.id = v.document_id
  and d.data_room_id = '33333333-3333-4333-8333-333333333333'
  and v.clearance_id is null;

update public.data_room_documents d
set status = 'archived',
    archived_at = coalesce(d.archived_at, statement_timestamp())
where d.data_room_id = '33333333-3333-4333-8333-333333333333'
  and d.status = 'published'
  and exists (
    select 1
    from public.data_room_document_versions v
    where v.id = d.published_version_id
      and v.clearance_id is null
  );

-- A consumed clearance is the immutable association between a derivative and
-- its specific version. The clearance must remain complete, unvoided, and
-- unexpired whenever an artifact is opened or downloaded.
create or replace function private.data_room_clearance_is_active_for_version(
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
      from public.data_room_document_versions v
      join public.data_room_documents d on d.id = v.document_id
      join public.data_room_document_clearances c on c.id = v.clearance_id
      where v.id = target_version_id
        and c.data_room_id = d.data_room_id
        and c.consumed_at is not null
        and c.consumed_version_id = v.id
        and c.voided_at is null
        and c.expires_at > statement_timestamp()
        and private.data_room_clearance_is_complete(c.id)
    ),
    false
  )
$$;

-- Investors can only see a document through an active, consumed clearance.
-- Managers retain metadata/history access for remediation, but signed-object
-- access is separately gated below.
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
            d.status = 'published'
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

-- Storage authorization follows the same version-level proof. This closes an
-- old signed/object path even if a legacy row is manually made published.
create or replace function private.user_can_read_data_room_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    exists (
      select 1
      from public.data_room_document_versions v
      join public.data_room_documents d on d.id = v.document_id
      where v.storage_path = object_name
        and v.archived_at is null
        and private.data_room_clearance_is_active_for_version(v.id)
        and (
          private.user_can_manage_data_room(d.data_room_id)
          or (
            d.published_version_id = v.id
            and v.published_at is not null
            and d.status = 'published'
            and d.archived_at is null
            and private.user_has_data_room_access(d.data_room_id)
          )
        )
    ),
    false
  )
$$;

-- RLS remains the primary data boundary. Recreate its two public-facing
-- policies so a missing, voided, expired, incomplete, or mismatched clearance
-- cannot become investor-visible through a future direct query.
drop policy if exists "documents_select_authorized" on public.data_room_documents;
create policy "documents_select_authorized"
on public.data_room_documents for select to authenticated
using (
  private.user_can_manage_data_room(data_room_id)
  or private.user_can_view_document(id)
);

drop policy if exists "versions_select_authorized" on public.data_room_document_versions;
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
          and data_room_document_versions.archived_at is null
          and private.user_can_view_document(d.id)
        )
      )
  )
);

-- The signed-document route uses this extra authorization boundary instead of
-- assuming its preceding RLS reads are sufficient. It permits a manager to
-- inspect a staged derivative only after its clearance is genuinely active.
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
            d.status = 'published'
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

-- Only new clearance helpers are non-callable to authenticated clients. Do
-- not revoke the baseline private helper grants restored above: RLS needs them.
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
revoke all on function private.data_room_clearance_is_active_for_version(uuid)
  from public, anon, authenticated;

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
grant execute on function private.data_room_clearance_is_active_for_version(uuid)
  to service_role;

revoke all on function public.can_view_data_room_document_version(uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.can_view_data_room_document_version(uuid, uuid)
  to authenticated, service_role;

notify pgrst, 'reload schema';
