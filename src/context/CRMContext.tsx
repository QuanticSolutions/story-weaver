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

  // ---------- DB sync: leads, projects, notifications ----------
  useEffect(() => {
    let cancelled = false;
    const loadCore = async () => {
      const [{ data: leadRows }, { data: projectRows }, { data: notifRows }] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("crm_notifications").select("*").order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;

      if (leadRows && leadRows.length) {
        const mapped: Lead[] = leadRows.map((l: any) => ({
          id: l.id, projectId: l.project_id || "", name: l.name, email: l.email, phone: l.phone,
          source: l.source, serviceInterest: l.service_interest || [],
          status: l.status, assignedTo: l.assigned_to,
          notes: l.notes || "", createdAt: l.created_at_text || fmtTime(l.created_at).date,
          lastContact: l.last_contact, ipAddress: l.ip_address || "0.0.0.0", location: l.location || "Unknown",
          chatHistory: l.chat_history || [],
        }));
        setLeads(mapped);
      }

      if (projectRows && projectRows.length) {
        const mapped: Project[] = projectRows.map((p: any) => ({
          id: p.id, clientName: p.client_name, clientEmail: p.client_email, clientId: p.client_id_text || "",
          bookTitle: p.book_title, genre: p.genre, assignedManager: p.assigned_manager || "",
          assignedProduction: p.assigned_production || [],
          startDate: p.start_date || "", estimatedCompletion: p.estimated_completion || "",
          totalValue: Number(p.total_value) || 0, amountPaid: Number(p.amount_paid) || 0, outstanding: Number(p.outstanding) || 0,
          health: p.health,
          stages: p.stages || [], invoices: p.invoices || [],
          ndaSigned: p.nda_signed, ndaSignedAt: p.nda_signed_at, ndaSignedBy: p.nda_signed_by,
          contractSigned: p.contract_signed, contractSignedAt: p.contract_signed_at, contractSignedBy: p.contract_signed_by,
          tasks: p.tasks || [], internalNotes: p.internal_notes || [], messages: p.messages || [],
        }));
        setProjects(mapped);
      }

      if (notifRows && notifRows.length) {
        const mapped: Notification[] = notifRows.map((n: any) => {
          const t = fmtTime(n.created_at);
          return {
            id: typeof n.id === "string" ? Math.abs(n.id.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) : n.id,
            type: n.type, message: n.message, time: t.time, date: t.date, read: !!n.read,
            targetRole: n.target_roles || [], link: n.link || undefined,
          };
        });
        setNotifications(mapped);
      }
    };
    loadCore();

    const chatChan = supabase
      .channel("chat-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_sessions" }, () => loadChats())
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () => loadChats())
      .subscribe();
    const coreChan = supabase
      .channel("crm-core")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, loadCore)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, loadCore)
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_notifications" }, loadCore)
      .subscribe();

    const loadChats = async () => {
      const { data: sessions } = await supabase
        .from("chat_sessions").select("*").order("created_at", { ascending: false });
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
          id: s.id, leadId: s.lead_id, visitorName: s.visitor_name, visitorEmail: s.visitor_email, visitorPhone: s.visitor_phone,
          ipAddress: s.ip_address || "0.0.0.0", location: s.location || "Unknown — Browser Session",
          startedAt: `${t.date} ${t.time}`, status: (s.status as Chat["status"]) || "Waiting", assignedStaff: s.assigned_staff,
          unread: sm.filter((m: any) => m.sender === "visitor").length,
          messages: sm.map((m: any) => ({ from: m.sender, staffName: m.staff_name || undefined, message: m.message, ...fmtTime(m.created_at) })),
        };
      });
      setChats((prev) => {
        const seeds = prev.filter((c) => c.id.startsWith("CHAT-"));
        return [...liveChats, ...seeds];
      });
    };
    loadChats();

    return () => {
      cancelled = true;
      supabase.removeChannel(chatChan);
      supabase.removeChannel(coreChan);
    };
  }, []);



  const persistLead = (lead: Lead) => {
    void supabase.from("leads").update({
      status: lead.status, assigned_to: lead.assignedTo, notes: lead.notes,
      last_contact: lead.lastContact, chat_history: lead.chatHistory as any,
    }).eq("id", lead.id);
  };
  const persistProject = (pr: Project) => {
    void supabase.from("projects").update({
      stages: pr.stages as any, tasks: pr.tasks as any, invoices: pr.invoices as any,
      internal_notes: pr.internalNotes as any, messages: (pr.messages || []) as any,
      amount_paid: pr.amountPaid, outstanding: pr.outstanding, total_value: pr.totalValue,
      nda_signed: pr.ndaSigned, nda_signed_at: pr.ndaSignedAt, nda_signed_by: pr.ndaSignedBy,
      contract_signed: pr.contractSigned, contract_signed_at: pr.contractSignedAt, contract_signed_by: pr.contractSignedBy,
      assigned_manager: pr.assignedManager, assigned_production: pr.assignedProduction as any,
      health: pr.health,
    }).eq("id", pr.id);
  };
  const mapLeads = (updater: (l: Lead) => Lead, targetId: string) =>
    setLeads((p) => p.map((l) => {
      if (l.id !== targetId) return l;
      const next = updater(l);
      persistLead(next);
      return next;
    }));
  const mapProjects = (updater: (pr: Project) => Project, targetId: string) =>
    setProjects((p) => p.map((pr) => {
      if (pr.id !== targetId) return pr;
      const next = updater(pr);
      persistProject(next);
      return next;
    }));

  const value: CRMContextValue = {
    leads,
    projects,
    chats,
    notifications,

    updateLeadStatus: (leadId, status) => mapLeads((l) => ({ ...l, status }), leadId),
    addLeadMessage: (leadId, message, staffName) => {
      const t = now();
      mapLeads((l) => ({ ...l, chatHistory: [...l.chatHistory, { from: "staff", staffName, message, ...t }], lastContact: t.date }), leadId);
    },
    assignLead: (leadId, staffName) => mapLeads((l) => ({ ...l, assignedTo: staffName }), leadId),
    updateLeadNotes: (leadId, notes) => mapLeads((l) => ({ ...l, notes }), leadId),
    addLead: (lead) => {
      setLeads((p) => [lead, ...p]);
      void supabase.from("leads").insert({
        id: lead.id, project_id: lead.projectId, name: lead.name, email: lead.email, phone: lead.phone,
        source: lead.source, service_interest: lead.serviceInterest as any, status: lead.status,
        assigned_to: lead.assignedTo, notes: lead.notes, created_at_text: lead.createdAt,
        last_contact: lead.lastContact, ip_address: lead.ipAddress, location: lead.location,
        chat_history: lead.chatHistory as any,
      });
    },

    updateStageStatus: (projectId, stageName, status) =>
      mapProjects((pr) => ({ ...pr, stages: pr.stages.map((s) => (s.name === stageName ? { ...s, status } : s)) }), projectId),
    updateStageNotes: (projectId, stageName, notes) =>
      mapProjects((pr) => ({ ...pr, stages: pr.stages.map((s) => (s.name === stageName ? { ...s, notes } : s)) }), projectId),
    assignStageToProduction: (projectId, stageName, staffName) =>
      mapProjects((pr) => ({ ...pr, stages: pr.stages.map((s) => (s.name === stageName ? { ...s, assignedTo: staffName } : s)) }), projectId),
    addTask: (projectId, task) => mapProjects((pr) => ({ ...pr, tasks: [...pr.tasks, task] }), projectId),
    updateTaskStatus: (taskId, status) =>
      setProjects((p) => p.map((pr) => {
        if (!pr.tasks.some((t) => t.id === taskId)) return pr;
        const next = { ...pr, tasks: pr.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) };
        persistProject(next);
        return next;
      })),
    submitTask: (taskId, submittedNotes) =>
      setProjects((p) => p.map((pr) => {
        if (!pr.tasks.some((t) => t.id === taskId)) return pr;
        const next = { ...pr, tasks: pr.tasks.map((t) => (t.id === taskId ? { ...t, status: "Submitted" as const, submittedNotes } : t)) };
        persistProject(next);
        return next;
      })),
    approveTask: (taskId) =>
      setProjects((p) => p.map((pr) => {
        if (!pr.tasks.some((t) => t.id === taskId)) return pr;
        const next = { ...pr, tasks: pr.tasks.map((t) => (t.id === taskId ? { ...t, status: "Completed" as const } : t)) };
        persistProject(next);
        return next;
      })),
    addInvoice: (projectId, invoice) =>
      mapProjects((pr) => ({ ...pr, invoices: [...pr.invoices, invoice] }), projectId),
    updateInvoiceStatus: (projectId, invoiceId, status, method) =>
      mapProjects((pr) => {
        const invoices = pr.invoices.map((inv) =>
          inv.id === invoiceId ? { ...inv, status, method: method ?? inv.method } : inv,
        );
        const amountPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
        const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
        return { ...pr, invoices, amountPaid, outstanding };
      }, projectId),
    addInternalNote: (projectId, note, author) => {
      const t = now();
      const entry: InternalNote = { author, note, date: t.date };
      mapProjects((pr) => ({ ...pr, internalNotes: [entry, ...pr.internalNotes] }), projectId);
    },
    addProjectMessage: (projectId, message, sender) => {
      const t = now();
      mapProjects((pr) => {
        const msgs = pr.messages || [];
        const nxt: ProjectMessage = {
          id: msgs.length ? Math.max(...msgs.map((m) => m.id)) + 1 : 1,
          from: sender.name, role: sender.role, avatar: sender.avatar, message,
          date: t.date, time: t.time, fromClient: sender.fromClient,
        };
        return { ...pr, messages: [...msgs, nxt] };
      }, projectId);
      // also drop a portal notification if this is staff replying
      if (!sender.fromClient) {
        void supabase.from("portal_notifications").insert({
          project_id: projectId, type: "message", message: `${sender.name} sent you a new message.`,
        });
      }
    },
    addProject: (project) => {
      setProjects((p) => [project, ...p]);
      void supabase.from("projects").insert({
        id: project.id, client_name: project.clientName, client_email: project.clientEmail,
        client_id_text: project.clientId, book_title: project.bookTitle, genre: project.genre,
        assigned_manager: project.assignedManager, assigned_production: project.assignedProduction as any,
        start_date: project.startDate, estimated_completion: project.estimatedCompletion,
        total_value: project.totalValue, amount_paid: project.amountPaid, outstanding: project.outstanding,
        health: project.health, stages: project.stages as any, invoices: project.invoices as any,
        tasks: project.tasks as any, internal_notes: project.internalNotes as any,
        messages: (project.messages || []) as any,
        nda_signed: project.ndaSigned, contract_signed: project.contractSigned,
      });
    },
    signProjectContract: (projectId, type, signerName) => {
      const t = now();
      mapProjects((pr) => type === "nda"
        ? { ...pr, ndaSigned: true, ndaSignedAt: t.date, ndaSignedBy: signerName }
        : { ...pr, contractSigned: true, contractSignedAt: t.date, contractSignedBy: signerName },
        projectId);
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
