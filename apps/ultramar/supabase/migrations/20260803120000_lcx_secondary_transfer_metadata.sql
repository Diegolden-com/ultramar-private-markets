-- Reframe the existing LCX diligence workspace without changing its identity,
-- documents, access grants, requests, activity, or Storage paths. The fixed IDs
-- let an already-seeded environment receive the same safe metadata as a fresh seed.

update public.rounds
set
  slug = 'lcx-secondary-transfer-review',
  title = 'LCX Secondary Transfer Review',
  status = 'preparing',
  updated_at = now()
where id = '22222222-2222-4222-8222-222222222222'::uuid
  and issuer_id = '11111111-1111-4111-8111-111111111111'::uuid;

update public.data_rooms
set
  slug = 'lcx-secondary-transfer',
  name = 'LCX Secondary Transfer Data Room',
  description = 'Controlled diligence workspace for a potential transfer of existing Lavanderias CX equity. No SPV. Not a live offer.',
  updated_at = now()
where id = '33333333-3333-4333-8333-333333333333'::uuid
  and round_id = '22222222-2222-4222-8222-222222222222'::uuid;

update public.data_room_folders
set
  slug = 'transfer-documents',
  name = 'Transfer documents',
  description = 'Seller disclosure, counsel-reviewed transfer documents, buyer eligibility memo, and transfer restrictions.',
  updated_at = now()
where id = '40000000-0000-4000-8000-000000000006'::uuid
  and data_room_id = '33333333-3333-4333-8333-333333333333'::uuid;

update public.data_room_folders
set
  name = 'Holder and investor communications',
  description = 'Diligence Q&A, monthly update template, KPI definitions, notices, and adverse-event protocol.',
  updated_at = now()
where id = '40000000-0000-4000-8000-000000000008'::uuid
  and data_room_id = '33333333-3333-4333-8333-333333333333'::uuid;
