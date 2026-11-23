DROP POLICY IF EXISTS "Anyone can insert visitor events" ON public.visitor_events;
REVOKE INSERT, SELECT, UPDATE, DELETE ON public.visitor_events FROM anon, authenticated;
GRANT ALL ON public.visitor_events TO service_role;