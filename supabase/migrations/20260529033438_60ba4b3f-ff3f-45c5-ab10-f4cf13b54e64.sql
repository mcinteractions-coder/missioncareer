
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS rating integer;

ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_kind_check;
ALTER TABLE public.posts ADD CONSTRAINT posts_kind_check
  CHECK (kind IN ('blog','success','festival','review','admit'));

INSERT INTO public.posts (kind, title, text, rating, sort_order) VALUES
('review', 'Rishikesh', 'Mission Career guided me step by step for Germany admission. Very professional and supportive staff.', 5, 1),
('review', 'Karan', 'Best consultancy in Kandivali. Very honest guidance.', 5, 2),
('review', 'Akshada', 'Got my visa smoothly without stress.', 5, 3),
('review', 'Pooja', 'Staff is friendly and explains everything clearly.', 5, 4),
('review', 'Akshay', 'Highly recommended for study abroad.', 5, 5),
('review', 'Sneha', 'Helped me choose correct university.', 5, 6);

INSERT INTO public.posts (kind, title, text, university, sort_order) VALUES
('admit', 'Martin Ronak Angello', '', 'TU Berlin', 1),
('admit', 'Jayesh Sharma', '', 'TU Dresden', 2),
('admit', 'Riya Patil', '', 'TU Braunschweig', 3),
('admit', 'Hrushikesh Shetty', '', 'Indiana University', 4);
