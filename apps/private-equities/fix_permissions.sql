-- Grant usage on the public schema to the service_role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- QuickBooks OAuth tokens must remain backend-only.
REVOKE ALL ON TABLE public.quickbooks_tokens FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.quickbooks_tokens TO service_role;
