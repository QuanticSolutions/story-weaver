import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const startSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(3).max(40),
});

const sessionSchema = z.object({
  sessionId: z.string().uuid(),
  token: z.string().min(16).max(200),
});

const sendSchema = sessionSchema.extend({
  message: z.string().trim().min(1).max(2000),
});

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function assertSession(sessionId: string, token: string) {
  const db = await admin();
  const { data, error } = await db
    .from("chat_sessions")
    .select("id, visitor_token")
    .eq("id", sessionId)
    .maybeSingle();
  if (error || !data || data.visitor_token !== token) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return db;
}

export const startVisitorChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => startSchema.parse(d))
  .handler(async ({ data }) => {
    const db = await admin();
    const { data: session, error } = await db
      .from("chat_sessions")
      .insert({
        visitor_name: data.name,
        visitor_email: data.email,
        visitor_phone: data.phone,
        status: "Waiting",
      })
      .select("id, visitor_token")
      .single();
    if (error || !session) throw new Error("Unable to start chat");

    await db.from("chat_messages").insert({
      session_id: session.id,
      sender: "staff",
      staff_name: "AWH",
      message: "Thanks for reaching out! A publishing consultant will be with you shortly.",
    });

    return { sessionId: session.id, token: session.visitor_token };
  });

export const getVisitorMessages = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => sessionSchema.parse(d))
  .handler(async ({ data }) => {
    const db = await assertSession(data.sessionId, data.token);
    const { data: rows } = await db
      .from("chat_messages")
      .select("id, sender, staff_name, message, created_at")
      .eq("session_id", data.sessionId)
      .order("created_at", { ascending: true });
    return { messages: rows ?? [] };
  });

export const sendVisitorMessage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => sendSchema.parse(d))
  .handler(async ({ data }) => {
    const db = await assertSession(data.sessionId, data.token);
    const { error } = await db
      .from("chat_messages")
      .insert({ session_id: data.sessionId, sender: "visitor", message: data.message });
    if (error) throw new Error("Unable to send message");
    await db
      .from("chat_sessions")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.sessionId);
    return { ok: true };
  });
