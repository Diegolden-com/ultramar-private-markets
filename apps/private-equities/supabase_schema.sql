-- Create a table to store QuickBooks OAuth tokens
create table quickbooks_tokens (
  user_id text primary key,
  access_token text not null,
  refresh_token text not null,
  realm_id text not null,
  expires_at timestamp with time zone not null,
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table quickbooks_tokens enable row level security;

-- Create a policy to allow the service role (backend) to do everything
-- Note: verification is handled by the backend logic, so simplified policy for service role is sufficient
create policy "Enable full access for service role"
  on quickbooks_tokens
  for all
  using ( auth.role() = 'service_role' );
