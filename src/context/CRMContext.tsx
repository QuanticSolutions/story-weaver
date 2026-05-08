import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  initialLeads,
  initialProjects,
  initialChats,
  initialNotifications,
  type Lead,
  type Project,
  type Chat,
  type Notification,
  type ChatMessage,
  type Stage,
  type Invoice,
  type Task,
  type InternalNote,
  type ProjectMessage,
} from "@/data/crmData";

interface CRMContextValue {
  leads: Lead[];
  projects: Project[];
  chats: Chat[];
  notifications: Notification[];

  updateLeadStatus: (leadId: string, status: Lead["status"]) => void;
  addLeadMessage: (leadId: string, message: string, staffName: string) => void;
  assignLead: (leadId: string, staffName: string) => void;
  updateLeadNotes: (leadId: string, notes: string) => void;
  addLead: (lead: Lead) => void;

  updateStageStatus: (projectId: string, stageName: string, status: Stage["status"]) => void;
  updateStageNotes: (projectId: string, stageName: string, notes: string) => void;
  assignStageToProduction: (projectId: string, stageName: string, staffName: string) => void;
  addTask: (projectId: string, task: Task) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  submitTask: (taskId: string, notes: string) => void;
  approveTask: (taskId: string) => void;
  addInvoice: (projectId: string, invoice: Invoice) => void;
  updateInvoiceStatus: (projectId: string, invoiceId: string, status: Invoice["status"], method?: string) => void;
  addInternalNote: (projectId: string, note: string, author: string) => void;
  addProjectMessage: (projectId: string, message: string, sender: { name: string; avatar: string; role: string; fromClient: boolean }) => void;
  addProject: (project: Project) => void;
  signProjectContract: (projectId: string, type: "nda" | "contract", signerName: string) => void;

  sendChatMessage: (chatId: string, message: string, staffName: string) => void;
  assignChat: (chatId: string, staffName: string) => void;
  closeChat: (chatId: string) => void;
  addChat: (chat: Chat) => void;
  addVisitorMessage: (chatId: string, message: string) => void;

  markNotificationRead: (id: number) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id">) => void;

  unreadChatCount: number;
  unreadNotificationCount: (role?: string) => number;
}

const CRMContext = createContext<CRMContextValue | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const now = () => {
    const d = new Date();
    return {
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
  };

  const fmtTime = (iso: string) => {
    const d = new Date(iso);
    return {
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    };
  };

  // ---------- Live chat: sync DB sessions+messages into `chats` ----------
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data: sessions } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("created_at", { ascending: false });
      if (!sessions || cancelled) return;
      const ids = sessions.map((s: any) => s.id);
      const { data: msgs } = ids.length
        ? await supabase.from("chat_messages").select("*").in("session_id", ids).order("created_at", { ascending: true })
        : { data: [] as any[] };
      if (cancelled) return;
      const liveChats: Chat[] = sessions.map((s: any) => {
        const sm = (msgs || []).filter((m: any) => m.session_id === s.id);
        const t = fmtTime(s.created_at);
        return {
          id: s.id,
          leadId: s.lead_id,
          visitorName: s.visitor_name,
          visitorEmail: s.visitor_email,
          visitorPhone: s.visitor_phone,
          ipAddress: s.ip_address || "0.0.0.0",
          location: s.location || "Unknown — Browser Session",
          startedAt: `${t.date} ${t.time}`,
          status: (s.status as Chat["status"]) || "Waiting",
          assignedStaff: s.assigned_staff,
          unread: sm.filter((m: any) => m.sender === "visitor").length,
          messages: sm.map((m: any) => ({ from: m.sender, staffName: m.staff_name || undefined, message: m.message, ...fmtTime(m.created_at) })),
        };
      });
      setChats((prev) => {
        const seeds = prev.filter((c) => c.id.startsWith("CHAT-"));
        return [...liveChats, ...seeds];
      });
    };
    load();

    const channel = supabase
      .channel("chat-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_sessions" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () => load())
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);


  const value: CRMContextValue = {
    leads,
    projects,
    chats,
    notifications,

    updateLeadStatus: (leadId, status) =>
      setLeads((p) => p.map((l) => (l.id === leadId ? { ...l, status } : l))),
    addLeadMessage: (leadId, message, staffName) => {
      const t = now();
      setLeads((p) =>
        p.map((l) =>
          l.id === leadId
            ? { ...l, chatHistory: [...l.chatHistory, { from: "staff", staffName, message, ...t }], lastContact: t.date }
            : l,
        ),
      );
    },
    assignLead: (leadId, staffName) =>
      setLeads((p) => p.map((l) => (l.id === leadId ? { ...l, assignedTo: staffName } : l))),
    updateLeadNotes: (leadId, notes) =>
      setLeads((p) => p.map((l) => (l.id === leadId ? { ...l, notes } : l))),
    addLead: (lead) => setLeads((p) => [lead, ...p]),

    updateStageStatus: (projectId, stageName, status) =>
      setProjects((p) =>
        p.map((pr) =>
          pr.id === projectId
            ? { ...pr, stages: pr.stages.map((s) => (s.name === stageName ? { ...s, status } : s)) }
            : pr,
        ),
      ),
    updateStageNotes: (projectId, stageName, notes) =>
      setProjects((p) =>
        p.map((pr) =>
          pr.id === projectId
            ? { ...pr, stages: pr.stages.map((s) => (s.name === stageName ? { ...s, notes } : s)) }
            : pr,
        ),
      ),
    assignStageToProduction: (projectId, stageName, staffName) =>
      setProjects((p) =>
        p.map((pr) =>
          pr.id === projectId
            ? { ...pr, stages: pr.stages.map((s) => (s.name === stageName ? { ...s, assignedTo: staffName } : s)) }
            : pr,
        ),
      ),
    addTask: (projectId, task) =>
      setProjects((p) =>
        p.map((pr) => (pr.id === projectId ? { ...pr, tasks: [...pr.tasks, task] } : pr)),
      ),
    updateTaskStatus: (taskId, status) =>
      setProjects((p) =>
        p.map((pr) => ({
          ...pr,
          tasks: pr.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        })),
      ),
    submitTask: (taskId, submittedNotes) =>
      setProjects((p) =>
        p.map((pr) => ({
          ...pr,
          tasks: pr.tasks.map((t) => (t.id === taskId ? { ...t, status: "Submitted" as const, submittedNotes } : t)),
        })),
      ),
    approveTask: (taskId) =>
      setProjects((p) =>
        p.map((pr) => ({
          ...pr,
          tasks: pr.tasks.map((t) => (t.id === taskId ? { ...t, status: "Completed" as const } : t)),
        })),
      ),
    addInvoice: (projectId, invoice) =>
      setProjects((p) =>
        p.map((pr) => (pr.id === projectId ? { ...pr, invoices: [...pr.invoices, invoice] } : pr)),
      ),
    updateInvoiceStatus: (projectId, invoiceId, status, method) =>
      setProjects((p) =>
        p.map((pr) => {
          if (pr.id !== projectId) return pr;
          const invoices = pr.invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status, method: method ?? inv.method } : inv,
          );
          const amountPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
          const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
          return { ...pr, invoices, amountPaid, outstanding };
        }),
      ),
    addInternalNote: (projectId, note, author) => {
      const t = now();
      const entry: InternalNote = { author, note, date: t.date };
      setProjects((p) =>
        p.map((pr) => (pr.id === projectId ? { ...pr, internalNotes: [entry, ...pr.internalNotes] } : pr)),
      );
    },
    addProjectMessage: (projectId, message, sender) => {
      const t = now();
      setProjects((p) =>
        p.map((pr) => {
          if (pr.id !== projectId) return pr;
          const msgs = pr.messages || [];
          const next: ProjectMessage = {
            id: msgs.length ? Math.max(...msgs.map((m) => m.id)) + 1 : 1,
            from: sender.name,
            role: sender.role,
            avatar: sender.avatar,
            message,
            date: t.date,
            time: t.time,
            fromClient: sender.fromClient,
          };
          return { ...pr, messages: [...msgs, next] };
        }),
      );
    },
    addProject: (project) => setProjects((p) => [project, ...p]),
    signProjectContract: (projectId, type, signerName) => {
      const t = now();
      setProjects((p) =>
        p.map((pr) => {
          if (pr.id !== projectId) return pr;
          if (type === "nda") return { ...pr, ndaSigned: true, ndaSignedAt: t.date, ndaSignedBy: signerName };
          return { ...pr, contractSigned: true, contractSignedAt: t.date, contractSignedBy: signerName };
        }),
      );
    },

    sendChatMessage: (chatId, message, staffName) => {
      const t = now();
      const msg: ChatMessage = { from: "staff", staffName, message, ...t };
      setChats((p) => p.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg], unread: 0 } : c)));
      if (chatId.startsWith("CHAT-")) return;
      void supabase.from("chat_messages").insert({ session_id: chatId, sender: "staff", staff_name: staffName, message });
      void supabase.from("chat_sessions").update({ status: "Active", updated_at: new Date().toISOString() }).eq("id", chatId);
    },
    assignChat: (chatId, staffName) => {
      setChats((p) => p.map((c) => (c.id === chatId ? { ...c, assignedStaff: staffName, status: "Active" } : c)));
      if (!chatId.startsWith("CHAT-")) {
        void supabase.from("chat_sessions").update({ assigned_staff: staffName, status: "Active" }).eq("id", chatId);
      }
    },
    closeChat: (chatId) => {
      setChats((p) => p.map((c) => (c.id === chatId ? { ...c, status: "Closed" } : c)));
      if (!chatId.startsWith("CHAT-")) {
        void supabase.from("chat_sessions").update({ status: "Closed" }).eq("id", chatId);
      }
    },
    addChat: (chat) => setChats((p) => [chat, ...p]),
    addVisitorMessage: (chatId, message) => {
      const t = now();
      const msg: ChatMessage = { from: "visitor", message, ...t };
      setChats((p) =>
        p.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg], unread: c.unread + 1 } : c)),
      );
      if (!chatId.startsWith("CHAT-")) {
        void supabase.from("chat_messages").insert({ session_id: chatId, sender: "visitor", message });
      }
    },

    markNotificationRead: (id) =>
      setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n))),
    markAllRead: () => setNotifications((p) => p.map((n) => ({ ...n, read: true }))),
    addNotification: (n) =>
      setNotifications((p) => [{ id: Date.now(), ...n }, ...p]),

    unreadChatCount: chats.filter((c) => c.unread > 0 || c.status === "Active" || c.status === "Waiting").length,
    unreadNotificationCount: (role?: string) =>
      notifications.filter((n) => !n.read && (!role || n.targetRole.includes(role as never))).length,
  };

  const memoed = useMemo(() => value, [leads, projects, chats, notifications]);

  return <CRMContext.Provider value={memoed}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
