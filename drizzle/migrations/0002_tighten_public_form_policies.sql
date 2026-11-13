-- bookings: no public read; validated inserts only
DROP POLICY IF EXISTS "Anyone can read booked slots" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can book a slot" ON public.bookings;
CREATE POLICY "Anyone can book a valid slot" ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND char_length(btrim(full_name)) BETWEEN 1 AND 120
  AND char_length(btrim(phone)) BETWEEN 6 AND 25
  AND (email IS NULL OR char_length(email) <= 254)
  AND (country IS NULL OR char_length(country) <= 80)
  AND (notes IS NULL OR char_length(notes) <= 2000)
  AND char_length(slot_time) <= 20
  AND mode IN ('offline','online')
  AND slot_date >= (now() AT TIME ZONE 'Asia/Kolkata')::date - 1
);

CREATE OR REPLACE FUNCTION public.get_taken_slots(_date date, _mode text)
RETURNS TABLE(slot_time text) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.slot_time FROM public.bookings b WHERE b.slot_date = _date AND b.mode = _mode;
$$;

CREATE OR REPLACE FUNCTION public.get_todays_meetings(_date date)
RETURNS TABLE(id uuid, full_name text, phone text, country text, slot_time text, slot_date date)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.id, split_part(btrim(b.full_name), ' ', 1),
    CASE WHEN length(regexp_replace(b.phone, '\D', '', 'g')) >= 4
      THEN left(regexp_replace(b.phone, '\D', '', 'g'), 2) || 'xxxxxx' || right(regexp_replace(b.phone, '\D', '', 'g'), 2)
      ELSE '•••' END,
    b.country, b.slot_time, b.slot_date
  FROM public.bookings b WHERE b.slot_date = _date ORDER BY b.slot_time;
$$;
GRANT EXECUTE ON FUNCTION public.get_taken_slots(date, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_todays_meetings(date) TO anon, authenticated;

-- leads: validated inserts
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a valid lead" ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(btrim(full_name)) BETWEEN 1 AND 120
  AND (phone IS NULL OR char_length(phone) <= 25)
  AND (email IS NULL OR char_length(email) <= 254)
  AND (phone IS NOT NULL OR email IS NOT NULL)
  AND (country IS NULL OR char_length(country) <= 80)
  AND (study_level IS NULL OR char_length(study_level) <= 80)
  AND (message IS NULL OR char_length(message) <= 4000)
  AND (session_id IS NULL OR char_length(session_id) <= 128)
);

-- dream_cards & chat_messages: written only by the server
DROP POLICY IF EXISTS "Anyone can submit a dream card" ON public.dream_cards;
DROP POLICY IF EXISTS "Anyone can delete chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read messages by session_key" ON public.chat_messages;