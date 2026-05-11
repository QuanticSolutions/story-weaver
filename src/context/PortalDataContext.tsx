import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { sampleClient as fallback, type SampleClient } from "@/data/sampleClient";
import { toast } from "sonner";

type PortalFileRow = {
  id: string;
  name: string;
  category: string;
  uploaded_by: string;
  created_at: string;
  size: string;
  storage_path: string | null;
};

type PortalNotifRow = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
};

interface PortalDataValue {
  client: SampleClient;
  loading: boolean;
  uploadFile: (file: File) => Promise<void>;
  downloadFile: (fileId: number | string) => Promise<void>;
  markNotificationRead: (id: number | string) => Promise<void>;
  markAllRead: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

const PortalDataContext = createContext<PortalDataValue | undefined>(undefined);

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function bytesToSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const { userId, projectId } = usePortalAuth();
  const [client, setClient] = useState<SampleClient>(fallback);
  const [loading, setLoading] = useState(true);
  const [fileRows, setFileRows] = useState<PortalFileRow[]>([]);
  const [notifRows, setNotifRows] = useState<PortalNotifRow[]>([]);

  const loadAll = async () => {
    if (!userId || !projectId) { setLoading(false); return; }
    setLoading(true);

    const [{ data: project }, { data: profile }, { data: files }, { data: notifs }] = await Promise.all([
      supabase.from("projects").select("*").eq("id", projectId).maybeSingle(),
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("portal_files").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
      supabase.from("portal_notifications").select("*").eq("project_id", projectId).order("created_at", { ascending: false }),
    ]);

    setFileRows((files as PortalFileRow[]) || []);
    setNotifRows((notifs as PortalNotifRow[]) || []);

    if (!project) { setLoading(false); return; }
    const p: any = project;

    const stages = (p.stages as any[]).map((s, i) => ({
      id: i + 1,
      name: s.name,
      status: s.status,
      completedDate: s.approvedAt || null,
      notes: s.notes || "",
    }));

    const mapped: SampleClient = {
      name: profile?.name || p.client_name,
      email: profile?.email || p.client_email,
      phone: profile?.phone || "",
      avatar: profile?.avatar || (p.client_name || "JH").split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase(),
      projectId: p.id,
      bookTitle: p.book_title,
      genre: p.genre,
      assignedManager: p.assigned_manager,
      startDate: p.start_date,
      estimatedCompletion: p.estimated_completion,
      stages: stages as any,
      billing: (p.invoices as any[]) || [],
      files: ((files as PortalFileRow[]) || []).map((f, i) => ({
        id: i + 1,
        name: f.name,
        type: f.category as any,
        uploadedBy: f.uploaded_by,
        date: fmtDate(f.created_at),
        size: f.size || "—",
      })) as any,
      notifications: ((notifs as PortalNotifRow[]) || []).map((n, i) => ({
        id: i + 1,
        message: n.message,
        date: fmtDate(n.created_at),
        read: n.read,
        type: n.type as any,
      })) as any,
      messages: ((p.messages as any[]) || []).map((m: any) => ({
        id: m.id,
        from: m.from,
        role: m.role,
        avatar: m.avatar,
        message: m.message,
        date: m.date,
        time: m.time,
        fromClient: m.fromClient,
      })),
    };

    setClient(mapped);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    if (!projectId) return;
    const channel = supabase
      .channel(`portal-${projectId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects", filter: `id=eq.${projectId}` }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "portal_files", filter: `project_id=eq.${projectId}` }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "portal_notifications", filter: `project_id=eq.${projectId}` }, loadAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, projectId]);

  const uploadFile = async (file: File) => {
    if (!projectId || !userId) { toast.error("Not logged in"); return; }
    const ext = file.name.split(".").pop();
    const storagePath = `${projectId}/${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("project-files").upload(storagePath, file);
    if (upErr) { toast.error("Upload failed", { description: upErr.message }); return; }
    const category =
      /\.(pdf)$/i.test(file.name) ? "Brief" :
      /\.(docx?|txt|rtf)$/i.test(file.name) ? "Manuscript" :
      /\.(jpe?g|png|webp|gif)$/i.test(file.name) ? "Cover" : "Other";
    const { error: insErr } = await supabase.from("portal_files").insert({
      project_id: projectId,
      name: file.name,
      category,
      uploaded_by: "Client",
      size: bytesToSize(file.size),
      storage_path: storagePath,
    });
    if (insErr) { toast.error("Save failed", { description: insErr.message }); return; }
    toast.success("File uploaded", { description: file.name });
  };

  const downloadFile = async (fileId: number | string) => {
    const idx = typeof fileId === "number" ? fileId - 1 : -1;
    const row = idx >= 0 ? fileRows[idx] : fileRows.find((r) => r.id === fileId);
    if (!row?.storage_path) { toast.error("File unavailable in demo"); return; }
    const { data, error } = await supabase.storage.from("project-files").createSignedUrl(row.storage_path, 60);
    if (error || !data) { toast.error("Download failed"); return; }
    window.open(data.signedUrl, "_blank");
  };

  const markNotificationRead = async (id: number | string) => {
    const idx = typeof id === "number" ? id - 1 : -1;
    const row = idx >= 0 ? notifRows[idx] : notifRows.find((r) => r.id === id);
    if (!row) return;
    await supabase.from("portal_notifications").update({ read: true }).eq("id", row.id);
  };

  const markAllRead = async () => {
    if (!projectId) return;
    await supabase.from("portal_notifications").update({ read: true }).eq("project_id", projectId);
  };

  const sendMessage = async (text: string) => {
    if (!projectId || !text.trim()) return;
    const { data: cur } = await supabase.from("projects").select("messages").eq("id", projectId).maybeSingle();
    const existing: any[] = (cur?.messages as any[]) || [];
    const now = new Date();
    const next = {
      id: existing.length ? Math.max(...existing.map((m) => m.id || 0)) + 1 : 1,
      from: client.name,
      role: "Client",
      avatar: client.avatar,
      message: text.trim(),
      date: now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      fromClient: true,
    };
    await supabase.from("projects").update({ messages: [...existing, next] }).eq("id", projectId);
  };

  return (
    <PortalDataContext.Provider value={{ client, loading, uploadFile, downloadFile, markNotificationRead, markAllRead, sendMessage }}>
      {children}
    </PortalDataContext.Provider>
  );
}

export function usePortalData() {
  const ctx = useContext(PortalDataContext);
  if (!ctx) throw new Error("usePortalData must be used within PortalDataProvider");
  return ctx;
}

export function useClient(): SampleClient {
  return usePortalData().client;
}
