export type CRMRole = "project_manager" | "salesperson" | "production" | "admin";

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: CRMRole;
  avatar: string;
  phone: string;
  department: string;
  joinedDate: string;
  activeProjects?: number;
  activeLeads?: number;
  activeTasks?: number;
}

export interface ChatMessage {
  from: "visitor" | "staff";
  staffName?: string;
  message: string;
  time: string;
  date: string;
}

export interface Lead {
  id: string;
  projectId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  serviceInterest: string[];
  status: "New Lead" | "Contacted" | "Qualified" | "Closed Won" | "Closed Lost";
  assignedTo: string | null;
  notes: string;
  createdAt: string;
  lastContact: string | null;
  ipAddress: string;
  location: string;
  chatHistory: ChatMessage[];
}

export interface Stage {
  name: string;
  status: "Not Started" | "In Progress" | "On Hold (Client)" | "On Hold (Company)" | "Completed";
  assignedTo: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  notes: string;
}

export interface Invoice {
  id: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Unpaid";
  date: string;
  method: string;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: "Not Started" | "In Progress" | "On Hold" | "Submitted" | "Completed";
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  projectId?: string;
  bookTitle?: string;
  submittedNotes?: string;
}

export interface InternalNote {
  author: string;
  note: string;
  date: string;
}

export interface ProjectMessage {
  id: number;
  from: string;
  role: string;
  avatar: string;
  message: string;
  date: string;
  time: string;
  fromClient: boolean;
}

export interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  clientId: string;
  bookTitle: string;
  genre: string;
  assignedManager: string;
  assignedProduction: string[];
  startDate: string;
  estimatedCompletion: string;
  totalValue: number;
  amountPaid: number;
  outstanding: number;
  health: "On Track" | "Needs Attention" | "Overdue" | "Completed";
  stages: Stage[];
  invoices: Invoice[];
  ndaSigned: boolean;
  ndaSignedAt: string | null;
  ndaSignedBy: string | null;
  contractSigned: boolean;
  contractSignedAt: string | null;
  contractSignedBy: string | null;
  tasks: Task[];
  internalNotes: InternalNote[];
  messages?: ProjectMessage[];
}

export interface Chat {
  id: string;
  leadId: string | null;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  ipAddress: string;
  location: string;
  startedAt: string;
  status: "Active" | "Waiting" | "Closed";
  assignedStaff: string | null;
  unread: number;
  messages: ChatMessage[];
}

export interface Notification {
  id: number;
  type: "new_lead" | "new_chat" | "task" | "stage" | "payment" | "visitor" | "contract";
  message: string;
  time: string;
  date: string;
  read: boolean;
  targetRole: CRMRole[];
  link?: string;
}

export const crmUsers: CRMUser[] = [
  { id: "USR-001", name: "Sarah Collins", email: "sarah.collins@awh.com", password: "pm2024", role: "project_manager", avatar: "SC", phone: "+1 (214) 555-0101", department: "Project Management", joinedDate: "January 10, 2023", activeProjects: 4 },
  { id: "USR-002", name: "Marcus Webb", email: "marcus.webb@awh.com", password: "sales2024", role: "salesperson", avatar: "MW", phone: "+1 (214) 555-0102", department: "Sales", joinedDate: "March 5, 2023", activeLeads: 12 },
  { id: "USR-003", name: "Priya Nair", email: "priya.nair@awh.com", password: "prod2024", role: "production", avatar: "PN", phone: "+1 (214) 555-0103", department: "Production — Editing", joinedDate: "June 1, 2023", activeTasks: 3 },
  { id: "USR-004", name: "Daniel Osei", email: "daniel.osei@awh.com", password: "prod2024", role: "production", avatar: "DO", phone: "+1 (214) 555-0104", department: "Production — Design", joinedDate: "August 14, 2023", activeTasks: 2 },
];

export const initialLeads: Lead[] = [
  { id: "LEAD-001", projectId: "AWH-2024-0051", name: "Rachel Monroe", email: "rachel.monroe@email.com", phone: "+1 (312) 555-0201", source: "Website Form", serviceInterest: ["Ghostwriting", "Cover Design", "Publishing"], status: "Contacted", assignedTo: "Marcus Webb", notes: "Interested in a memoir. Has a full outline ready. Budget flexible.", createdAt: "May 20, 2024", lastContact: "May 22, 2024", ipAddress: "104.28.44.12", location: "Chicago, Illinois, US",
    chatHistory: [
      { from: "visitor", message: "Hi, I'm interested in ghostwriting services for my memoir.", time: "2:14 PM", date: "May 20, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "Hi Rachel! Thank you for reaching out. I'd love to learn more about your project. What is your memoir about?", time: "2:16 PM", date: "May 20, 2024" },
      { from: "visitor", message: "It's about my journey as a first-generation immigrant building a business in the US. About 15 years of story.", time: "2:18 PM", date: "May 20, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "That sounds like a compelling story — exactly the kind we love working on. Can I get your email so we can send over some details and schedule a free consultation?", time: "2:20 PM", date: "May 20, 2024" },
    ],
  },
  { id: "LEAD-002", projectId: "AWH-2024-0052", name: "Thomas Kline", email: "thomas.kline@email.com", phone: "+1 (415) 555-0202", source: "Live Chat", serviceInterest: ["Cover Design", "Formatting"], status: "Qualified", assignedTo: "Marcus Webb", notes: "Manuscript is complete. Only needs design and formatting. Wants fast turnaround.", createdAt: "May 18, 2024", lastContact: "May 21, 2024", ipAddress: "172.16.0.44", location: "San Francisco, California, US",
    chatHistory: [
      { from: "visitor", message: "My manuscript is already done. I need someone to design the cover and format it for Amazon KDP.", time: "10:05 AM", date: "May 18, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "Perfect! We specialize in exactly that. Can you share the genre and any style references you have in mind for the cover?", time: "10:08 AM", date: "May 18, 2024" },
    ],
  },
  { id: "LEAD-003", projectId: "AWH-2024-0053", name: "Fatima Al-Hassan", email: "fatima.alhassan@email.com", phone: "+1 (202) 555-0203", source: "Website Form", serviceInterest: ["Full Package"], status: "New Lead", assignedTo: null, notes: "", createdAt: "May 25, 2024", lastContact: null, ipAddress: "198.51.100.22", location: "Washington D.C., US", chatHistory: [] },
  { id: "LEAD-004", projectId: "AWH-2024-0048", name: "Kevin Bautista", email: "kevin.bautista@email.com", phone: "+1 (718) 555-0204", source: "Live Chat", serviceInterest: ["Children's Book", "Illustrations"], status: "Closed Won", assignedTo: "Marcus Webb", notes: "Converted to client. Project started. Children's book with 24 illustrations.", createdAt: "May 1, 2024", lastContact: "May 10, 2024", ipAddress: "203.0.113.55", location: "New York, New York, US",
    chatHistory: [
      { from: "visitor", message: "I want to publish a children's book with custom illustrations. Where do I start?", time: "3:30 PM", date: "May 1, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "Great choice! Children's books are one of our favorites to work on. We handle everything from illustrations to publishing. Let's set up a quick call — what time works for you?", time: "3:33 PM", date: "May 1, 2024" },
    ],
  },
  { id: "LEAD-005", projectId: "AWH-2024-0049", name: "Sandra Whitfield", email: "sandra.whitfield@email.com", phone: "+1 (305) 555-0205", source: "Website Form", serviceInterest: ["Marketing"], status: "Closed Lost", assignedTo: "Marcus Webb", notes: "Went with a competitor. Price was the objection.", createdAt: "April 28, 2024", lastContact: "May 3, 2024", ipAddress: "192.0.2.88", location: "Miami, Florida, US", chatHistory: [] },
];

export const initialProjects: Project[] = [
  { id: "AWH-2024-0047", clientName: "James R. Harrington", clientEmail: "james.harrington@email.com", clientId: "CLIENT-001", bookTitle: "The Forgotten Meridian", genre: "Thriller / Mystery", assignedManager: "Sarah Collins", assignedProduction: ["Priya Nair"], startDate: "March 3, 2024", estimatedCompletion: "August 15, 2024", totalValue: 5479, amountPaid: 4400, outstanding: 1079, health: "On Track",
    stages: [
      { name: "Ghostwriting", status: "Completed", assignedTo: "Priya Nair", submittedAt: "April 8, 2024", approvedAt: "April 10, 2024", notes: "Approved after 2 revisions." },
      { name: "Editing & Proofreading", status: "Completed", assignedTo: "Priya Nair", submittedAt: "April 30, 2024", approvedAt: "May 2, 2024", notes: "No major issues." },
      { name: "Cover Design", status: "Completed", assignedTo: "Daniel Osei", submittedAt: "May 18, 2024", approvedAt: "May 20, 2024", notes: "Concept 2 selected." },
      { name: "Formatting", status: "In Progress", assignedTo: "Priya Nair", submittedAt: null, approvedAt: null, notes: "eBook and Paperback in progress." },
      { name: "Publishing", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "" },
      { name: "Author Website", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "" },
      { name: "Marketing", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "" },
      { name: "Illustrations", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "Optional — not selected." },
    ],
    invoices: [
      { id: "INV-001", description: "Ghostwriting", amount: 2800, status: "Paid", date: "March 5, 2024", method: "Wise" },
      { id: "INV-002", description: "Editing", amount: 950, status: "Paid", date: "April 12, 2024", method: "PayPal" },
      { id: "INV-003", description: "Cover Design", amount: 650, status: "Paid", date: "April 28, 2024", method: "Wise" },
      { id: "INV-004", description: "Formatting", amount: 480, status: "Pending", date: "May 22, 2024", method: "" },
      { id: "INV-005", description: "Publishing", amount: 599, status: "Unpaid", date: "Due Jun 1, 2024", method: "" },
    ],
    ndaSigned: true, ndaSignedAt: "March 3, 2024", ndaSignedBy: "James R. Harrington",
    contractSigned: true, contractSignedAt: "March 3, 2024", contractSignedBy: "James R. Harrington",
    tasks: [
      { id: "TASK-001", title: "Format eBook (EPUB)", assignedTo: "Priya Nair", status: "In Progress", dueDate: "June 1, 2024", priority: "High", projectId: "AWH-2024-0047", bookTitle: "The Forgotten Meridian" },
      { id: "TASK-002", title: "Format Paperback (PDF with bleed)", assignedTo: "Priya Nair", status: "Not Started", dueDate: "June 5, 2024", priority: "High", projectId: "AWH-2024-0047", bookTitle: "The Forgotten Meridian" },
      { id: "TASK-003", title: "Set up Amazon KDP account", assignedTo: "Sarah Collins", status: "Not Started", dueDate: "June 10, 2024", priority: "Medium", projectId: "AWH-2024-0047", bookTitle: "The Forgotten Meridian" },
    ],
    internalNotes: [
      { author: "Sarah Collins", note: "Client is very responsive. Prefers communication via portal messages.", date: "March 5, 2024" },
      { author: "Marcus Webb", note: "Closed after 2 consultations. Upsell potential for marketing package.", date: "March 3, 2024" },
    ],
    messages: [
      { id: 1, from: "Sarah Collins", role: "Project Manager", avatar: "SC", message: "Hi James, formatting has now started. We're working on the eBook version first. Expected completion within 10 days.", date: "May 23, 2024", time: "10:14 AM", fromClient: false },
      { id: 2, from: "James R. Harrington", role: "Client", avatar: "JH", message: "That's great to hear! Will the paperback formatting be done at the same time?", date: "May 23, 2024", time: "11:02 AM", fromClient: true },
      { id: 3, from: "Sarah Collins", role: "Project Manager", avatar: "SC", message: "Yes, both eBook and Paperback will be handled in the same stage. We'll upload the files once both are ready for your review.", date: "May 23, 2024", time: "11:30 AM", fromClient: false },
      { id: 4, from: "James R. Harrington", role: "Client", avatar: "JH", message: "Perfect. Also, do I need to do anything for the publishing stage?", date: "May 24, 2024", time: "9:45 AM", fromClient: true },
      { id: 5, from: "Sarah Collins", role: "Project Manager", avatar: "SC", message: "Not at all — we handle everything. You'll just need to provide your KDP account login details when we reach that stage. I'll remind you closer to the time.", date: "May 24, 2024", time: "10:20 AM", fromClient: false },
    ],
  },
  { id: "AWH-2024-0048", clientName: "Kevin Bautista", clientEmail: "kevin.bautista@email.com", clientId: "CLIENT-002", bookTitle: "Mango and the Magic Garden", genre: "Children's Book", assignedManager: "Sarah Collins", assignedProduction: ["Daniel Osei"], startDate: "May 12, 2024", estimatedCompletion: "September 30, 2024", totalValue: 3800, amountPaid: 1900, outstanding: 1900, health: "On Track",
    stages: [
      { name: "Ghostwriting", status: "Completed", assignedTo: "Priya Nair", submittedAt: "May 28, 2024", approvedAt: "May 30, 2024", notes: "Short manuscript, approved first round." },
      { name: "Illustrations", status: "In Progress", assignedTo: "Daniel Osei", submittedAt: null, approvedAt: null, notes: "24 illustrations. 8 completed so far." },
      { name: "Cover Design", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "" },
      { name: "Formatting", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "" },
      { name: "Publishing", status: "Not Started", assignedTo: null, submittedAt: null, approvedAt: null, notes: "" },
    ],
    invoices: [
      { id: "INV-001", description: "Ghostwriting + Illustrations Deposit", amount: 1900, status: "Paid", date: "May 12, 2024", method: "PayPal" },
      { id: "INV-002", description: "Illustrations Balance + Cover Design", amount: 1900, status: "Unpaid", date: "Due Jul 1, 2024", method: "" },
    ],
    ndaSigned: true, ndaSignedAt: "May 12, 2024", ndaSignedBy: "Kevin Bautista",
    contractSigned: true, contractSignedAt: "May 12, 2024", contractSignedBy: "Kevin Bautista",
    tasks: [
      { id: "TASK-004", title: "Complete illustrations 9–16", assignedTo: "Daniel Osei", status: "In Progress", dueDate: "June 15, 2024", priority: "High", projectId: "AWH-2024-0048", bookTitle: "Mango and the Magic Garden" },
      { id: "TASK-005", title: "Complete illustrations 17–24", assignedTo: "Daniel Osei", status: "Not Started", dueDate: "June 30, 2024", priority: "High", projectId: "AWH-2024-0048", bookTitle: "Mango and the Magic Garden" },
    ],
    internalNotes: [
      { author: "Sarah Collins", note: "Client has strong vision for the illustration style. Reference images shared in files.", date: "May 14, 2024" },
    ],
    messages: [],
  },
];

export const initialChats: Chat[] = [
  { id: "CHAT-001", leadId: "LEAD-001", visitorName: "Rachel Monroe", visitorEmail: "rachel.monroe@email.com", visitorPhone: "+1 (312) 555-0201", ipAddress: "104.28.44.12", location: "Chicago, Illinois, US", startedAt: "May 20, 2024 2:14 PM", status: "Closed", assignedStaff: "Marcus Webb", unread: 0,
    messages: [
      { from: "visitor", message: "Hi, I'm interested in ghostwriting services for my memoir.", time: "2:14 PM", date: "May 20, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "Hi Rachel! Thank you for reaching out. I'd love to learn more about your project.", time: "2:16 PM", date: "May 20, 2024" },
      { from: "visitor", message: "It's about my journey as a first-generation immigrant building a business in the US.", time: "2:18 PM", date: "May 20, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "That sounds like a compelling story. Can I get your email so we can schedule a free consultation?", time: "2:20 PM", date: "May 20, 2024" },
    ],
  },
  { id: "CHAT-002", leadId: "LEAD-002", visitorName: "Thomas Kline", visitorEmail: "thomas.kline@email.com", visitorPhone: "+1 (415) 555-0202", ipAddress: "172.16.0.44", location: "San Francisco, California, US", startedAt: "May 18, 2024 10:05 AM", status: "Closed", assignedStaff: "Marcus Webb", unread: 0,
    messages: [
      { from: "visitor", message: "My manuscript is already done. I need someone to design the cover and format it for Amazon KDP.", time: "10:05 AM", date: "May 18, 2024" },
      { from: "staff", staffName: "Marcus Webb", message: "Perfect! We specialize in exactly that. Can you share the genre and any style references?", time: "10:08 AM", date: "May 18, 2024" },
    ],
  },
  { id: "CHAT-003", leadId: "LEAD-003", visitorName: "Fatima Al-Hassan", visitorEmail: "fatima.alhassan@email.com", visitorPhone: "+1 (202) 555-0203", ipAddress: "198.51.100.22", location: "Washington D.C., US", startedAt: "May 25, 2024 4:45 PM", status: "Active", assignedStaff: null, unread: 1,
    messages: [
      { from: "visitor", message: "Hello, I want to publish my first book. I don't know where to start.", time: "4:45 PM", date: "May 25, 2024" },
    ],
  },
];

export const initialNotifications: Notification[] = [
  { id: 1, type: "new_lead", message: "New lead submitted: Fatima Al-Hassan (Website Form)", time: "4:45 PM", date: "May 25, 2024", read: false, targetRole: ["salesperson", "project_manager"], link: "/crm/leads/LEAD-003" },
  { id: 2, type: "new_chat", message: "New chat started: Fatima Al-Hassan — Washington D.C.", time: "4:45 PM", date: "May 25, 2024", read: false, targetRole: ["salesperson", "project_manager"], link: "/crm/chat/CHAT-003" },
  { id: 3, type: "task", message: "Task due soon: Format eBook (EPUB) — due June 1, 2024", time: "9:00 AM", date: "May 25, 2024", read: false, targetRole: ["production"], link: "/crm/tasks" },
  { id: 4, type: "stage", message: "Stage update: Formatting started on AWH-2024-0047", time: "10:30 AM", date: "May 23, 2024", read: true, targetRole: ["project_manager"], link: "/crm/projects/AWH-2024-0047" },
  { id: 5, type: "payment", message: "Invoice INV-004 issued for AWH-2024-0047 — $480 pending", time: "2:00 PM", date: "May 22, 2024", read: true, targetRole: ["project_manager", "salesperson"], link: "/crm/projects/AWH-2024-0047" },
  { id: 6, type: "visitor", message: "New visitor on website — Washington D.C., US", time: "4:43 PM", date: "May 25, 2024", read: false, targetRole: ["salesperson"] },
];

export const NDA_TEMPLATE = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{DATE}} between American Writers Hub ("Company") and {{CLIENT_NAME}} ("Client") for Project {{PROJECT_ID}} — "{{BOOK_TITLE}}" ({{GENRE}}).

1. CONFIDENTIAL INFORMATION
The Company agrees to treat all manuscript material, ideas, characters, plotlines, and any other intellectual property shared by the Client as strictly confidential.

2. NON-DISCLOSURE
The Company shall not disclose any confidential information to any third party without prior written consent from the Client, except to staff members directly working on the Project.

3. OWNERSHIP
All intellectual property rights related to the Client's manuscript and book remain the sole property of the Client. The Company claims no ownership over the creative work.

4. STAFF CONFIDENTIALITY
All Company staff working on this Project have signed individual NDAs aligned with this Agreement.

5. TERM
This Agreement remains in effect indefinitely, surviving termination of any service contract.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Texas, United States.

SIGNED ELECTRONICALLY BY: {{SIGNATURE}}
Date: {{DATE}}
Project ID: {{PROJECT_ID}}`;

export const SERVICE_AGREEMENT_TEMPLATE = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on {{DATE}} between American Writers Hub ("Company") and {{CLIENT_NAME}} ("Client") for Project {{PROJECT_ID}} — "{{BOOK_TITLE}}" ({{GENRE}}).

1. SCOPE OF SERVICES
The Company agrees to provide the following services:
- {{SERVICES_LIST}}

2. ESTIMATED COMPLETION
{{ESTIMATED_COMPLETION}}

3. CLIENT RESPONSIBILITIES
The Client agrees to provide timely feedback, approvals, and any required materials during each stage.

4. REVISIONS
Each stage includes up to 2 rounds of revisions. Additional revisions may incur extra fees.

5. PAYMENT TERMS
Payment is structured per stage. Invoices are due within 7 days of issuance. Work pauses on overdue invoices.

6. INTELLECTUAL PROPERTY
All final deliverables become the sole property of the Client upon final payment.

7. TERMINATION
Either party may terminate this Agreement with written notice. Outstanding work completed up to termination is payable.

SIGNED ELECTRONICALLY BY: {{SIGNATURE}}
Date: {{DATE}}
Project ID: {{PROJECT_ID}}`;
