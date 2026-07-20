insert into public.issuers (id, slug, name, legal_name)
values (
  '11111111-1111-4111-8111-111111111111',
  'lavanderias-cx',
  'Lavanderias CX',
  'Lavanderias CX'
)
on conflict (id) do nothing;

insert into public.rounds (id, issuer_id, slug, title, ticker, status)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'lcx-capital-round',
  'LCX Capital',
  'lcx',
  'preparing'
)
on conflict (id) do nothing;

insert into public.data_rooms (id, round_id, slug, name, description)
values (
  '33333333-3333-4333-8333-333333333333',
  '22222222-2222-4222-8222-222222222222',
  'lcx-capital',
  'LCX Capital Data Room',
  'Controlled diligence workspace for the Lavanderias CX expansion round.'
)
on conflict (id) do nothing;

insert into public.data_room_folders (
  id,
  data_room_id,
  slug,
  name,
  description,
  readiness_status,
  sort_order
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333333',
    'issuer-formation-authority',
    'Issuer formation and authority',
    'Final issuer, board approvals, signing authority, and beneficial ownership record.',
    'missing',
    10
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '33333333-3333-4333-8333-333333333333',
    'historical-financials',
    'Historical financials',
    'Monthly P&L, balance sheet, cash movement, and bank reconciliation.',
    'in_review',
    20
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '33333333-3333-4333-8333-333333333333',
    'store-operating-metrics',
    'Store-level operating metrics',
    'Revenue by site, machine utilization, tickets, utilities, maintenance, and seasonality.',
    'in_review',
    30
  ),
  (
    '40000000-0000-4000-8000-000000000004',
    '33333333-3333-4333-8333-333333333333',
    'leases-permits-insurance',
    'Leases, permits, and insurance',
    'Lease terms, renewals, permits, utility contracts, and insurance certificates.',
    'missing',
    40
  ),
  (
    '40000000-0000-4000-8000-000000000005',
    '33333333-3333-4333-8333-333333333333',
    'cap-table-current-debt',
    'Cap table and current debt',
    'Ownership, related-party balances, loans, liens, guarantees, and existing investor rights.',
    'missing',
    50
  ),
  (
    '40000000-0000-4000-8000-000000000006',
    '33333333-3333-4333-8333-333333333333',
    'offering-documents',
    'Offering documents',
    'Term sheet, subscription agreement, risk factors, eligibility memo, and transfer restrictions.',
    'gated',
    60
  ),
  (
    '40000000-0000-4000-8000-000000000007',
    '33333333-3333-4333-8333-333333333333',
    'oracle-data-connector',
    'Oracle data connector',
    'Accounting export, mappings, data freshness, signature policy, and exception review.',
    'in_review',
    70
  ),
  (
    '40000000-0000-4000-8000-000000000008',
    '33333333-3333-4333-8333-333333333333',
    'investor-communications',
    'Investor communications',
    'Monthly update template, KPI definitions, notices, and adverse-event protocol.',
    'missing',
    80
  )
on conflict (id) do nothing;
