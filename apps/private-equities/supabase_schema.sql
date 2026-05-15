-- Create a table to store QuickBooks OAuth tokens
create table if not exists public.quickbooks_tokens (
  user_id text primary key,
  access_token text not null,
  refresh_token text not null,
  realm_id text not null,
  expires_at timestamp with time zone not null,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.quickbooks_tokens enable row level security;

-- Tokens are backend-only. The service role performs OAuth storage and lookup;
-- anon/authenticated clients should never be able to query or mutate this table.
revoke all on public.quickbooks_tokens from public, anon, authenticated;
grant all on public.quickbooks_tokens to service_role;

-- Create a policy to allow the service role (backend) to do everything
-- Note: verification is handled by the backend logic, so simplified policy for service role is sufficient
drop policy if exists "Enable full access for service role" on public.quickbooks_tokens;
create policy "Enable full access for service role"
  on public.quickbooks_tokens
  for all
  to service_role
  using (true)
  with check (true);
