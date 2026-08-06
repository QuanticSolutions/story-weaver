-- 1. Visitor access token for chat sessions
ALTER TABLE public.chat_sessions ADD COLUMN IF NOT EXISTS visitor_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');

-- 2. Remove overly-permissive public policies
DROP POLICY IF EXISTS "public insert sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "public read sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "public update sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "public insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "public read messages" ON public.chat_messages;

-- 3. Staff-only access (visitors go through server functions using the service role)
CREATE POLICY "Staff read chat sessions" ON public.chat_sessions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write chat sessions" ON public.chat_sessions
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff read chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff write chat messages" ON public.chat_messages
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

REVOKE ALL ON public.chat_sessions FROM anon;
REVOKE ALL ON public.chat_messages FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.chat_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
GRANT ALL ON public.chat_messages TO service_role;

-- 4. Fix mutable search_path on trigger function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- 5. Restrict execution of SECURITY DEFINER functions.
-- Trigger-only functions are never callable from the API.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
-- Role helpers are only needed by RLS policy evaluation for signed-in users.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM anon, public;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;