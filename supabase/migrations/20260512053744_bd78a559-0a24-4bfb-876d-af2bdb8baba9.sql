
-- Wise transfers
CREATE TABLE IF NOT EXISTS public.wise_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  transfer_id text,
  quote_id text,
  recipient_id text,
  source_currency text,
  target_currency text,
  source_amount numeric,
  target_amount numeric,
  status text,
  reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wise_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own transfers" ON public.wise_transfers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own transfers" ON public.wise_transfers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own transfers" ON public.wise_transfers
  FOR UPDATE USING (auth.uid() = user_id);

-- Wise recipients
CREATE TABLE IF NOT EXISTS public.wise_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  wise_account_id text,
  account_holder_name text,
  currency text,
  country text,
  account_details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wise_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own recipients" ON public.wise_recipients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own recipients" ON public.wise_recipients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own recipients" ON public.wise_recipients
  FOR DELETE USING (auth.uid() = user_id);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS wise_transfers_touch ON public.wise_transfers;
CREATE TRIGGER wise_transfers_touch BEFORE UPDATE ON public.wise_transfers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Ensure chat tables emit full row payloads for realtime
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_sessions REPLICA IDENTITY FULL;
