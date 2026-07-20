begin;

create extension if not exists pgtap with schema extensions;
select extensions.no_plan();

-- The LCX fixture is created by seed.sql; test principals are transaction-local.
insert into auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001',
    'authenticated',
    'authenticated',
    'no-grant@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"No Grant Investor"}',
    now(),
    now()
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002',
    'authenticated',
    'authenticated',
    'approved@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Approved Investor"}',
    now(),
    now()
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccc0003',
    'authenticated',
    'authenticated',
    'issuer@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"LCX Issuer"}',
    now(),
    now()
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddd0004',
    'authenticated',
    'authenticated',
    'admin@example.test',
    crypt('test-password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Data Room Admin"}',
    now(),
    now()
  );

update public.profiles
set role = 'issuer', issuer_id = '11111111-1111-4111-8111-111111111111'
where id = 'cccccccc-cccc-4ccc-8ccc-cccccccc0003';

update public.profiles
set role = 'admin'
where id = 'dddddddd-dddd-4ddd-8ddd-dddddddd0004';

-- A second room proves that folder, document, version, and audit relationships
-- cannot cross tenant boundaries.
insert into public.issuers (id, slug, name)
values ('55555555-5555-4555-8555-555555555551', 'other-issuer', 'Other issuer');

insert into public.rounds (id, issuer_id, slug, title, ticker, status)
values (
  '55555555-5555-4555-8555-555555555552',
  '55555555-5555-4555-8555-555555555551',
  'other-round',
  'Other round',
  'other',
  'preparing'
);

insert into public.data_rooms (id, round_id, slug, name)
values (
  '55555555-5555-4555-8555-555555555553',
  '55555555-5555-4555-8555-555555555552',
  'other-room',
  'Other room'
);

insert into public.data_room_folders (id, data_room_id, slug, name)
values (
  '55555555-5555-4555-8555-555555555554',
  '55555555-5555-4555-8555-555555555553',
  'other-folder',
  'Other folder'
);

select extensions.is(
  (select count(*) from public.data_room_folders where data_room_id = '33333333-3333-4333-8333-333333333333'),
  8::bigint,
  'seed creates the eight LCX folders'
);
select extensions.ok(
  not (select public from storage.buckets where id = 'data-room-documents'),
  'document bucket is private'
);
select extensions.is(
  (select file_size_limit from storage.buckets where id = 'data-room-documents'),
  26214400::bigint,
  'document bucket enforces the 25 MiB limit'
);
select extensions.ok(
  not has_table_privilege('anon', 'public.data_room_documents', 'select'),
  'anonymous users have no document metadata grant'
);
select extensions.ok(
  not has_function_privilege('anon', 'public.publish_data_room_document(uuid)', 'execute'),
  'anonymous users cannot publish documents'
);
select extensions.ok(
  not has_function_privilege('anon', 'public.archive_data_room_document(uuid)', 'execute'),
  'anonymous users cannot archive documents'
);
select extensions.ok(
  not has_function_privilege(
    'anon',
    'public.append_data_room_document_version(uuid,uuid,text,text,text,bigint,text)',
    'execute'
  ),
  'anonymous users cannot append versions'
);
select extensions.ok(
  has_function_privilege(
    'authenticated',
    'public.append_data_room_document_version(uuid,uuid,text,text,text,bigint,text)',
    'execute'
  ),
  'authenticated managers can call the atomic append RPC'
);
select extensions.ok(
  has_function_privilege('authenticated', 'public.archive_data_room_document(uuid)', 'execute'),
  'authenticated managers can call the controlled archive RPC'
);
select extensions.is(
  (
    select count(*)
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'append_data_room_document_version',
        'archive_data_room_document',
        'publish_data_room_document',
        'resolve_data_room_access'
      )
      and p.prosecdef
  ),
  4::bigint,
  'all controlled mutation RPCs run as security definer'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_room_document_versions', 'insert'),
  'authenticated clients cannot insert document versions directly'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_room_document_versions', 'update'),
  'authenticated clients cannot update document versions directly'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.rounds', 'update'),
  'authenticated clients cannot update round ownership or lifecycle directly'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_rooms', 'update'),
  'authenticated clients cannot update data-room ownership or lifecycle directly'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_room_access_requests', 'update'),
  'authenticated clients cannot resolve access requests directly'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_room_access_grants', 'insert'),
  'authenticated clients cannot create access grants directly'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_room_access_grants', 'update'),
  'authenticated clients cannot revoke access grants directly'
);
select extensions.ok(
  has_column_privilege('authenticated', 'public.data_room_documents', 'title', 'update'),
  'authenticated managers retain document metadata update privileges'
);
select extensions.ok(
  not has_column_privilege('authenticated', 'public.data_room_documents', 'status', 'update'),
  'authenticated clients cannot change document status directly'
);
select extensions.ok(
  not has_column_privilege(
    'authenticated',
    'public.data_room_documents',
    'published_version_id',
    'update'
  ),
  'authenticated clients cannot change the published version pointer directly'
);
select extensions.ok(
  not has_column_privilege('authenticated', 'public.data_room_documents', 'data_room_id', 'update'),
  'authenticated clients cannot move documents between rooms'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.data_room_activity_events', 'insert'),
  'authenticated clients cannot insert audit events directly'
);
select extensions.ok(
  not has_function_privilege(
    'authenticated',
    'private.audit_data_room_document_change()',
    'execute'
  ),
  'authenticated clients cannot execute private audit triggers'
);
select extensions.ok(
  has_table_privilege('service_role', 'public.data_room_activity_events', 'insert'),
  'service role has an explicit event insert grant for server-only auditing'
);
select extensions.ok(
  has_table_privilege('service_role', 'public.rounds', 'update')
    and has_table_privilege('service_role', 'public.data_rooms', 'update'),
  'service role retains controlled round and data-room update privileges'
);
select extensions.is(
  (
    select count(*)
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname like 'data_room_objects_%'
      and cmd in ('SELECT', 'UPDATE', 'DELETE')
  ),
  0::bigint,
  'authenticated users have no direct read, update, or delete Storage policy'
);

update public.profiles
set archived_at = now()
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001","role":"authenticated"}',
  true
);
select extensions.throws_ok(
  $$insert into public.data_room_access_requests (data_room_id, user_id, request_note)
    values ('33333333-3333-4333-8333-333333333333', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001', 'Archived profile request')$$,
  '42501',
  null,
  'archived profile cannot create an access request'
);
reset role;

update public.profiles
set archived_at = null
where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001';

update public.data_rooms
set archived_at = now()
where id = '33333333-3333-4333-8333-333333333333';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001","role":"authenticated"}',
  true
);
select extensions.throws_ok(
  $$insert into public.data_room_access_requests (data_room_id, user_id, request_note)
    values ('33333333-3333-4333-8333-333333333333', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001', 'Archived room request')$$,
  '42501',
  null,
  'access request requires an active issuer, round, and data room'
);
reset role;

update public.data_rooms
set archived_at = null
where id = '33333333-3333-4333-8333-333333333333';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_rooms), 0::bigint, 'no-grant investor cannot enumerate data rooms');
select extensions.is((select count(*) from public.data_room_folders), 0::bigint, 'no-grant investor cannot enumerate folders');
select extensions.is((select count(*) from public.data_room_documents), 0::bigint, 'no-grant investor cannot enumerate documents');
select extensions.is((select count(*) from public.data_room_document_versions), 0::bigint, 'no-grant investor cannot enumerate versions');
select extensions.is((select count(*) from public.profiles), 1::bigint, 'no-grant investor can only read their own profile');
select extensions.is(
  public.can_manage_data_room('33333333-3333-4333-8333-333333333333'),
  false,
  'investor cannot manage the LCX room'
);
select extensions.throws_ok(
  $$insert into public.data_room_access_requests (data_room_id, user_id, request_note)
    values (
      '33333333-3333-4333-8333-333333333333',
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001',
      repeat('x', 501)
    )$$,
  '23514',
  null,
  'access request note cannot exceed 500 characters'
);
select extensions.lives_ok(
  $$insert into public.data_room_access_requests (data_room_id, user_id, request_note)
    values ('33333333-3333-4333-8333-333333333333', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001', 'Please review')$$,
  'no-grant investor can request access'
);
select extensions.is(
  (select status::text from public.data_room_access_requests where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001'),
  'pending',
  'request begins pending'
);
select extensions.throws_ok(
  $$select public.resolve_data_room_access(
      (select id from public.data_room_access_requests where user_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001'),
      'approved',
      null
    )$$,
  '42501',
  'Access request not found or not manageable',
  'security-definer resolution still rejects a non-manager'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.lives_ok(
  $$insert into public.data_room_access_requests (data_room_id, user_id, request_note)
    values ('33333333-3333-4333-8333-333333333333', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002', 'Requesting diligence access')$$,
  'second investor can request access independently'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccc0003","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_rooms), 1::bigint, 'associated issuer sees only the LCX room');
select extensions.is(
  public.can_manage_data_room('33333333-3333-4333-8333-333333333333'),
  true,
  'associated issuer can manage the LCX room'
);
select extensions.throws_ok(
  $$update public.rounds
    set issuer_id = '55555555-5555-4555-8555-555555555551'
    where id = '22222222-2222-4222-8222-222222222222'$$,
  '42501',
  null,
  'issuer cannot transfer a round to another issuer directly'
);
select extensions.throws_ok(
  $$update public.data_rooms
    set round_id = '55555555-5555-4555-8555-555555555552'
    where id = '33333333-3333-4333-8333-333333333333'$$,
  '42501',
  null,
  'issuer cannot transfer a data room to another round directly'
);
select extensions.throws_ok(
  $$update public.rounds
    set archived_at = now()
    where id = '22222222-2222-4222-8222-222222222222'$$,
  '42501',
  null,
  'issuer cannot archive a round directly'
);
select extensions.throws_ok(
  $$update public.data_rooms
    set archived_at = now()
    where id = '33333333-3333-4333-8333-333333333333'$$,
  '42501',
  null,
  'issuer cannot archive a data room directly'
);
select extensions.throws_ok(
  $$insert into public.data_room_folders (
      id, data_room_id, parent_id, slug, name
    ) values (
      '66666666-6666-4666-8666-666666666661',
      '33333333-3333-4333-8333-333333333333',
      '55555555-5555-4555-8555-555555555554',
      'cross-room-child',
      'Cross-room child'
    )$$,
  '23503',
  null,
  'folder parent must belong to the same data room'
);
select extensions.throws_ok(
  $$insert into public.data_room_documents (
      id, data_room_id, folder_id, slug, title, status, created_by
    ) values (
      '66666666-6666-4666-8666-666666666662',
      '33333333-3333-4333-8333-333333333333',
      '55555555-5555-4555-8555-555555555554',
      'cross-room-document',
      'Cross-room document',
      'draft',
      'cccccccc-cccc-4ccc-8ccc-cccccccc0003'
    )$$,
  '23503',
  null,
  'document folder must belong to the same data room'
);
select extensions.lives_ok(
  $$insert into public.data_room_documents (
      id, data_room_id, folder_id, slug, title, description, status, sort_order, created_by
    ) values (
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      '33333333-3333-4333-8333-333333333333',
      '40000000-0000-4000-8000-000000000002',
      'monthly-financial-package',
      'Monthly financial package',
      'Controlled test document.',
      'draft',
      10,
      'cccccccc-cccc-4ccc-8ccc-cccccccc0003'
    )$$,
  'issuer can create document metadata'
);
select extensions.throws_ok(
  $$insert into public.data_room_document_versions (
      id,
      document_id,
      version_number,
      storage_path,
      original_filename,
      mime_type,
      size_bytes,
      uploaded_by
    ) values (
      'ffffffff-ffff-4fff-8fff-ffffffff0009',
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      1,
      '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0009-direct.pdf',
      'direct.pdf',
      'application/pdf',
      100,
      'cccccccc-cccc-4ccc-8ccc-cccccccc0003'
    )$$,
  '42501',
  null,
  'issuer cannot bypass the append RPC with a direct version insert'
);
select extensions.lives_ok(
  $$insert into storage.objects (bucket_id, name, owner)
    values (
      'data-room-documents',
      '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0001-monthly-v1.pdf',
      'cccccccc-cccc-4ccc-8ccc-cccccccc0003'
    )$$,
  'issuer can upload a new unique object path'
);
select extensions.lives_ok(
  $$select public.append_data_room_document_version(
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      'ffffffff-ffff-4fff-8fff-ffffffff0001',
      '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0001-monthly-v1.pdf',
      'monthly-v1.pdf',
      'application/pdf',
      1024,
      repeat('a', 64)
    )$$,
  'atomic append creates version one'
);
select extensions.throws_ok(
  $$update public.data_room_document_versions
    set original_filename = 'replacement.pdf'
    where id = 'ffffffff-ffff-4fff-8fff-ffffffff0001'$$,
  '42501',
  null,
  'issuer cannot replace immutable version metadata directly'
);
select extensions.throws_ok(
  $$select public.append_data_room_document_version(
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      'ffffffff-ffff-4fff-8fff-ffffffff0009',
      '55555555-5555-4555-8555-555555555553/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0009-invalid.pdf',
      'invalid.pdf',
      'application/pdf',
      100,
      null
    )$$,
  '23514',
  'Storage path must match data room, document, and version',
  'append rejects metadata pointing at another room'
);
select extensions.is(
  (select count(*) from public.data_room_document_versions where document_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'),
  1::bigint,
  'failed append rolls back without corrupting version history'
);
select extensions.lives_ok(
  $$select public.publish_data_room_document('eeeeeeee-eeee-4eee-8eee-eeeeeeee0001')$$,
  'issuer can publish the current working version'
);
select extensions.is(
  (select published_version_id from public.data_room_documents where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'),
  'ffffffff-ffff-4fff-8fff-ffffffff0001'::uuid,
  'document points explicitly to published v1'
);
select extensions.throws_ok(
  $$update public.data_room_documents
    set published_version_id = null
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'$$,
  '42501',
  null,
  'issuer cannot change the published version pointer directly'
);
select extensions.throws_ok(
  $$update public.data_room_documents
    set data_room_id = '55555555-5555-4555-8555-555555555553'
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'$$,
  '42501',
  null,
  'issuer cannot move a document to another room directly'
);
reset role;

alter table public.data_room_documents
  disable trigger data_room_documents_set_updated_at;
update public.data_room_documents
set updated_at = timestamptz '2000-01-01 00:00:00+00'
where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001';
alter table public.data_room_documents
  enable trigger data_room_documents_set_updated_at;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccc0003","role":"authenticated"}',
  true
);
select extensions.lives_ok(
  $$update public.data_room_documents
    set title = 'Monthly financial package — reviewed'
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'$$,
  'issuer can update document metadata'
);
select extensions.ok(
  (
    select updated_at > timestamptz '2000-01-01 00:00:00+00'
    from public.data_room_documents
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'
  ),
  'document metadata updates advance the visible timestamp'
);
select extensions.lives_ok(
  $$update public.data_room_folders
    set readiness_status = 'ready'
    where id = '40000000-0000-4000-8000-000000000002'$$,
  'issuer can update folder readiness'
);
select extensions.lives_ok(
  $$insert into public.data_room_documents (
      id, data_room_id, folder_id, slug, title, status, created_by
    ) values (
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0002',
      '33333333-3333-4333-8333-333333333333',
      '40000000-0000-4000-8000-000000000002',
      'obsolete-working-paper',
      'Obsolete working paper',
      'draft',
      'cccccccc-cccc-4ccc-8ccc-cccccccc0003'
    )$$,
  'issuer can create a draft document'
);
select extensions.throws_ok(
  $$update public.data_room_documents
    set status = 'archived', archived_at = now()
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0002'$$,
  '42501',
  null,
  'issuer cannot archive a document with direct DML'
);
select extensions.lives_ok(
  $$select public.archive_data_room_document('eeeeeeee-eeee-4eee-8eee-eeeeeeee0002')$$,
  'issuer can soft-archive a draft document through the controlled RPC'
);
select extensions.is(
  (select count(*) from public.data_room_activity_events where event_type = 'upload'),
  1::bigint,
  'version append writes one server-owned upload event'
);
select extensions.is(
  (select count(*) from public.data_room_activity_events where event_type = 'publish'),
  1::bigint,
  'publication trigger writes one immutable event'
);
select extensions.is(
  (
    select count(*)
    from public.data_room_activity_events
    where event_type = 'metadata_change'
      and metadata ->> 'action' = 'update'
  ),
  1::bigint,
  'metadata update trigger writes its event'
);
select extensions.is(
  (
    select count(*)
    from public.data_room_activity_events
    where event_type = 'metadata_change'
      and metadata ->> 'action' = 'archive'
  ),
  1::bigint,
  'document archive trigger writes its event'
);
select extensions.is(
  (select count(*) from public.data_room_activity_events where event_type = 'folder_change'),
  1::bigint,
  'folder change trigger writes its event'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"dddddddd-dddd-4ddd-8ddd-dddddddd0004","role":"authenticated"}',
  true
);
select extensions.throws_ok(
  $$update public.data_room_access_requests
    set status = 'approved',
        resolved_at = now(),
        resolved_by = 'dddddddd-dddd-4ddd-8ddd-dddddddd0004'
    where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002'$$,
  '42501',
  null,
  'admin cannot resolve an access request with direct DML'
);
select extensions.throws_ok(
  $$insert into public.data_room_access_grants (
      data_room_id,
      user_id,
      granted_by
    ) values (
      '33333333-3333-4333-8333-333333333333',
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaa0001',
      'dddddddd-dddd-4ddd-8ddd-dddddddd0004'
    )$$,
  '42501',
  null,
  'admin cannot create an access grant with direct DML'
);
select extensions.lives_ok(
  $$select public.resolve_data_room_access(
      (select id from public.data_room_access_requests where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002'),
      'approved',
      'Approved for diligence'
    )$$,
  'admin can approve an access request atomically'
);
select extensions.is(
  (select count(*) from public.data_room_access_grants where revoked_at is null),
  1::bigint,
  'approval creates one active grant'
);
select extensions.throws_ok(
  $$update public.data_room_access_grants
    set revoked_by = 'dddddddd-dddd-4ddd-8ddd-dddddddd0004',
        revoked_at = now()
    where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002'$$,
  '42501',
  null,
  'admin cannot revoke an access grant with direct DML'
);
select extensions.is(
  (select count(*) from public.data_room_activity_events where event_type = 'access_approved'),
  1::bigint,
  'access status trigger writes approval audit'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_rooms), 1::bigint, 'approved investor can navigate the LCX room');
select extensions.is((select count(*) from public.data_room_documents), 1::bigint, 'approved investor sees only the published document');
select extensions.is((select count(*) from public.data_room_document_versions), 1::bigint, 'approved investor sees one published version');
select extensions.is(
  (select id from public.data_room_document_versions),
  'ffffffff-ffff-4fff-8fff-ffffffff0001'::uuid,
  'approved investor resolves published v1'
);
select extensions.is(
  (select count(*) from storage.objects where bucket_id = 'data-room-documents'),
  0::bigint,
  'approved investor cannot enumerate Storage objects directly'
);
select extensions.is(
  private.user_can_read_data_room_object(
    '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0001-monthly-v1.pdf'
  ),
  true,
  'server authorization helper accepts the published v1 path'
);
select extensions.throws_ok(
  $$insert into public.data_room_activity_events (
      data_room_id, actor_user_id, document_id, document_version_id, event_type
    ) values (
      '33333333-3333-4333-8333-333333333333',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002',
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      'ffffffff-ffff-4fff-8fff-ffffffff0001',
      'download'
    )$$,
  '42501',
  null,
  'investor cannot forge an audit event directly'
);
reset role;

-- Upload v2 and append it as the working version, but do not publish it yet.
alter table public.data_room_documents
  disable trigger data_room_documents_set_updated_at;
update public.data_room_documents
set updated_at = timestamptz '2000-01-01 00:00:00+00'
where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001';
alter table public.data_room_documents
  enable trigger data_room_documents_set_updated_at;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccc0003","role":"authenticated"}',
  true
);
select extensions.lives_ok(
  $$insert into storage.objects (bucket_id, name, owner)
    values (
      'data-room-documents',
      '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0002-monthly-v2.pdf',
      'cccccccc-cccc-4ccc-8ccc-cccccccc0003'
    )$$,
  'issuer uploads the staged v2 object'
);
select extensions.lives_ok(
  $$select public.append_data_room_document_version(
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      'ffffffff-ffff-4fff-8fff-ffffffff0002',
      '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0002-monthly-v2.pdf',
      'monthly-v2.pdf',
      'application/pdf',
      2048,
      repeat('b', 64)
    )$$,
  'atomic append stages v2 without publishing it'
);
select extensions.is(
  (select published_version_id from public.data_room_documents where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'),
  'ffffffff-ffff-4fff-8fff-ffffffff0001'::uuid,
  'staging v2 preserves the published v1 pointer'
);
select extensions.is(
  (
    select id
    from public.data_room_document_versions
    where document_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'
      and is_current
  ),
  'ffffffff-ffff-4fff-8fff-ffffffff0002'::uuid,
  'v2 becomes the current working version atomically'
);
select extensions.is(
  (select published_at from public.data_room_document_versions where id = 'ffffffff-ffff-4fff-8fff-ffffffff0002'),
  null::timestamptz,
  'staged v2 remains unpublished'
);
select extensions.is(
  (
    select updated_at
    from public.data_room_documents
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'
  ),
  timestamptz '2000-01-01 00:00:00+00',
  'staging v2 does not advance the document visible timestamp'
);
select extensions.throws_ok(
  $$delete from storage.objects
    where bucket_id = 'data-room-documents'$$,
  '42501',
  null,
  'issuer cannot delete version history from Storage directly'
);
select extensions.is(
  (select count(*) from storage.objects where bucket_id = 'data-room-documents'),
  0::bigint,
  'issuer cannot enumerate Storage objects directly'
);
reset role;

select extensions.is(
  (select count(*) from storage.objects where bucket_id = 'data-room-documents'),
  2::bigint,
  'denied manager delete preserves both physical objects'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_room_document_versions), 1::bigint, 'investor still sees exactly one version while v2 is staged');
select extensions.is(
  (select id from public.data_room_document_versions),
  'ffffffff-ffff-4fff-8fff-ffffffff0001'::uuid,
  'investor continues resolving v1 while v2 is staged'
);
select extensions.is(
  private.user_can_read_data_room_object(
    '33333333-3333-4333-8333-333333333333/eeeeeeee-eeee-4eee-8eee-eeeeeeee0001/ffffffff-ffff-4fff-8fff-ffffffff0002-monthly-v2.pdf'
  ),
  false,
  'server authorization helper rejects staged v2'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccc0003","role":"authenticated"}',
  true
);
select extensions.lives_ok(
  $$select public.publish_data_room_document('eeeeeeee-eeee-4eee-8eee-eeeeeeee0001')$$,
  'issuer explicitly publishes staged v2'
);
select extensions.is(
  (select published_version_id from public.data_room_documents where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'),
  'ffffffff-ffff-4fff-8fff-ffffffff0002'::uuid,
  'publication advances the explicit pointer to v2'
);
select extensions.ok(
  (
    select updated_at > timestamptz '2000-01-01 00:00:00+00'
    from public.data_room_documents
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001'
  ),
  'publishing v2 advances the document visible timestamp'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_room_document_versions), 1::bigint, 'investor still sees only one version after republish');
select extensions.is(
  (select id from public.data_room_document_versions),
  'ffffffff-ffff-4fff-8fff-ffffffff0002'::uuid,
  'investor resolves newly published v2 and no longer sees v1'
);
reset role;

-- Archiving either the profile or any room ownership link revokes access even
-- while the grant and JWT are still otherwise valid.
update public.profiles
set archived_at = now()
where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_room_documents), 0::bigint, 'archived profile immediately loses document access');
select extensions.is(
  private.user_has_data_room_access('33333333-3333-4333-8333-333333333333'),
  false,
  'archived profile fails the access helper despite an active grant'
);
reset role;

update public.profiles
set archived_at = null
where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002';

update public.data_rooms
set archived_at = now()
where id = '33333333-3333-4333-8333-333333333333';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_rooms), 0::bigint, 'archived room disappears from investor navigation');
select extensions.is((select count(*) from public.data_room_documents), 0::bigint, 'archived room immediately cuts document access');
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccc0003","role":"authenticated"}',
  true
);
select extensions.is(
  public.can_manage_data_room('33333333-3333-4333-8333-333333333333'),
  false,
  'archived room also cuts issuer management access'
);
select extensions.is(
  (select count(*) from public.profiles),
  1::bigint,
  'archived room prevents issuer from enumerating request profiles'
);
reset role;

update public.data_rooms
set archived_at = null
where id = '33333333-3333-4333-8333-333333333333';

update public.rounds
set archived_at = now()
where id = '22222222-2222-4222-8222-222222222222';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_room_documents), 0::bigint, 'archived round immediately cuts document access');
select extensions.is(
  private.user_has_data_room_access('33333333-3333-4333-8333-333333333333'),
  false,
  'archived round fails the access helper despite an active grant'
);
reset role;

update public.rounds
set archived_at = null
where id = '22222222-2222-4222-8222-222222222222';

update public.issuers
set archived_at = now()
where id = '11111111-1111-4111-8111-111111111111';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_room_documents), 0::bigint, 'archived issuer immediately cuts document access');
select extensions.is(
  private.user_has_data_room_access('33333333-3333-4333-8333-333333333333'),
  false,
  'archived issuer fails the access helper despite an active grant'
);
reset role;

update public.issuers
set archived_at = null
where id = '11111111-1111-4111-8111-111111111111';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-cccc-4ccc-8ccc-cccccccc0003","role":"authenticated"}',
  true
);
select extensions.lives_ok(
  $$select public.resolve_data_room_access(
      (select id from public.data_room_access_requests where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002'),
      'revoked',
      'Diligence window closed'
    )$$,
  'associated issuer can revoke investor access'
);
select extensions.is(
  (select count(*) from public.data_room_activity_events where event_type = 'access_revoked'),
  1::bigint,
  'access status trigger writes revocation audit'
);
reset role;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002","role":"authenticated"}',
  true
);
select extensions.is((select count(*) from public.data_room_documents), 0::bigint, 'revoked investor immediately loses document access');
select extensions.is((select count(*) from public.data_room_document_versions), 0::bigint, 'revoked investor immediately loses version access');
select extensions.is(
  (select status::text from public.data_room_access_requests where user_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002'),
  'revoked',
  'revoked request state remains visible to the investor'
);
reset role;

select extensions.lives_ok(
  $$insert into public.data_room_activity_events (
      data_room_id, actor_user_id, event_type, occurred_at
    ) values (
      '33333333-3333-4333-8333-333333333333',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002',
      'login',
      statement_timestamp()
    )$$,
  'trusted server can associate a login with a room without a document'
);
select extensions.throws_ok(
  $$insert into public.data_room_activity_events (
      data_room_id, actor_user_id, document_id, event_type
    ) values (
      '33333333-3333-4333-8333-333333333333',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbb0002',
      'eeeeeeee-eeee-4eee-8eee-eeeeeeee0001',
      'login'
    )$$,
  '23514',
  null,
  'login audit shape rejects document references'
);

select * from extensions.finish();
rollback;
