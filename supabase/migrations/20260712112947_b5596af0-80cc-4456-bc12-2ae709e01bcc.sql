
CREATE TABLE public.visitor_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  device TEXT,
  timezone TEXT,
  event_type TEXT NOT NULL DEFAULT 'pageview',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.visitor_events TO anon, authenticated;
GRANT ALL ON public.visitor_events TO service_role;
ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert visitor events" ON public.visitor_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "No public read" ON public.visitor_events FOR SELECT USING (false);
CREATE INDEX visitor_events_created_at_idx ON public.visitor_events (created_at DESC);
CREATE INDEX visitor_events_session_idx ON public.visitor_events (session_id, created_at DESC);
