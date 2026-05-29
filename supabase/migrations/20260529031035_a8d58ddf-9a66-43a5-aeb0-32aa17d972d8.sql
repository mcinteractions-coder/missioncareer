ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS posts_kind_sort_idx ON public.posts (kind, sort_order, created_at DESC);