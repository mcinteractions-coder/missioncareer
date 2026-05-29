
-- Posts table for blog, success stories, and festival offers
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('blog','success','festival')),
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  image TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX posts_kind_created_idx ON public.posts(kind, created_at DESC);

GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read all posts (festival popup logic filters by active client-side)
CREATE POLICY "Public can read posts" ON public.posts FOR SELECT TO anon, authenticated USING (true);

-- Leads / Free counseling form submissions
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  country TEXT,
  study_level TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX leads_created_idx ON public.leads(created_at DESC);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead; nobody can read via the public API (admin uses service role server fn)
CREATE POLICY "Anyone can submit a lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
