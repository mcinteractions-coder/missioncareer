CREATE TABLE public.caller_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller text NOT NULL,
  student_name text NOT NULL,
  student_phone text NOT NULL,
  month text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.caller_meetings TO service_role;
ALTER TABLE public.caller_meetings ENABLE ROW LEVEL SECURITY;
CREATE INDEX caller_meetings_month_idx ON public.caller_meetings(month, caller);