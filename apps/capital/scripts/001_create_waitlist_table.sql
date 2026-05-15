-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (public signup)
DROP POLICY IF EXISTS "Allow anyone to join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow public to view waitlist status" ON public.waitlist;
DROP POLICY IF EXISTS "Public can join waitlist" ON public.waitlist;
CREATE POLICY "Public can join waitlist"
ON public.waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

REVOKE ALL ON public.waitlist FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
