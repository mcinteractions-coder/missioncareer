
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS session_id text;
CREATE INDEX IF NOT EXISTS visitor_events_session_id_idx ON public.visitor_events (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_session_id_idx ON public.bookings (session_id);
CREATE INDEX IF NOT EXISTS leads_session_id_idx ON public.leads (session_id);
