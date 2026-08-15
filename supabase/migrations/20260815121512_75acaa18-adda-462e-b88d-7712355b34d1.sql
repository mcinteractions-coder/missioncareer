CREATE TABLE public.dream_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  country TEXT,
  course TEXT,
  study_level TEXT,
  dream_university TEXT,
  dream_course TEXT,
  dream_city TEXT,
  dream_country TEXT,
  salary_estimate TEXT,
  lifestyle TEXT,
  one_line TEXT,
  emoji TEXT,
  color TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX dream_cards_created_idx ON public.dream_cards(created_at DESC);

GRANT INSERT ON public.dream_cards TO anon, authenticated;
GRANT ALL ON public.dream_cards TO service_role;

ALTER TABLE public.dream_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a dream card" ON public.dream_cards FOR INSERT TO anon, authenticated WITH CHECK (true);