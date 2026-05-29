CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_key, created_at);

GRANT SELECT, INSERT, DELETE ON public.chat_messages TO anon, authenticated;
GRANT ALL ON public.chat_messages TO service_role;

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages by session_key"
  ON public.chat_messages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete chat messages"
  ON public.chat_messages FOR DELETE
  TO anon, authenticated
  USING (true);