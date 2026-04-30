export const sampleClient = {
  name: "James R. Harrington",
  email: "james.harrington@email.com",
  phone: "+1 (214) 555-0192",
  projectId: "AWH-2024-0047",
  bookTitle: "The Forgotten Meridian",
  genre: "Thriller / Mystery",
  assignedManager: "Sarah Collins",
  startDate: "March 3, 2024",
  estimatedCompletion: "August 15, 2024",
  avatar: "JH",

  stages: [
    { id: 1, name: "Ghostwriting",          status: "Completed",   completedDate: "April 10, 2024", notes: "Manuscript approved by client after 2 revision rounds." },
    { id: 2, name: "Editing & Proofreading", status: "Completed",  completedDate: "May 2, 2024",    notes: "Developmental and line editing complete." },
    { id: 3, name: "Cover Design",           status: "Completed",   completedDate: "May 20, 2024",  notes: "Final cover approved. 3 concepts were presented." },
    { id: 4, name: "Formatting",             status: "In Progress", completedDate: null,             notes: "eBook and Paperback formatting underway." },
    { id: 5, name: "Publishing",             status: "Not Started", completedDate: null,             notes: "" },
    { id: 6, name: "Author Website",         status: "Not Started", completedDate: null,             notes: "" },
    { id: 7, name: "Marketing",              status: "Not Started", completedDate: null,             notes: "" },
    { id: 8, name: "Illustrations",          status: "Not Started", completedDate: null,             notes: "Optional — not selected by client." },
  ],

  billing: [
    { id: "INV-001", description: "Ghostwriting Service",        amount: 2800, status: "Paid",    date: "March 5, 2024",   method: "Wise Transfer" },
    { id: "INV-002", description: "Editing & Proofreading",      amount: 950,  status: "Paid",    date: "April 12, 2024",  method: "PayPal" },
    { id: "INV-003", description: "Cover Design Package",        amount: 650,  status: "Paid",    date: "April 28, 2024",  method: "Wise Transfer" },
    { id: "INV-004", description: "Formatting — All Formats",    amount: 480,  status: "Pending", date: "May 22, 2024",    method: "Pending" },
    { id: "INV-005", description: "Publishing — 200+ Platforms", amount: 599,  status: "Unpaid",  date: "Due Jun 1, 2024", method: "" },
  ],

  files: [
    { id: 1, name: "The_Forgotten_Meridian_Draft_v3.docx", type: "Manuscript", uploadedBy: "Client",          date: "March 28, 2024", size: "842 KB" },
    { id: 2, name: "Cover_Design_Final_Approved.pdf",      type: "Cover",      uploadedBy: "AWH Design Team", date: "May 20, 2024",   size: "4.2 MB" },
    { id: 3, name: "NDA_Signed_AWH_Harrington.pdf",        type: "Contract",   uploadedBy: "AWH Legal",       date: "March 3, 2024",  size: "218 KB" },
    { id: 4, name: "Service_Agreement_AWH_0047.pdf",       type: "Contract",   uploadedBy: "AWH Legal",       date: "March 3, 2024",  size: "334 KB" },
    { id: 5, name: "Formatting_Brief_Instructions.pdf",    type: "Brief",      uploadedBy: "Sarah Collins",   date: "May 23, 2024",   size: "156 KB" },
  ],

  notifications: [
    { id: 1, message: "Formatting stage has been started by the production team.",      date: "May 23, 2024", read: false, type: "stage" },
    { id: 2, message: "Invoice INV-004 has been issued. Please review in Billing.",     date: "May 22, 2024", read: false, type: "billing" },
    { id: 3, message: "Cover Design stage marked as Completed. Final file uploaded.",   date: "May 20, 2024", read: true,  type: "stage" },
    { id: 4, message: "Your project manager Sarah Collins has sent you a message.",     date: "May 18, 2024", read: true,  type: "message" },
    { id: 5, message: "Editing & Proofreading completed. Manuscript ready for review.", date: "May 2, 2024",  read: true,  type: "stage" },
    { id: 6, message: "Invoice INV-003 payment confirmed. Thank you.",                  date: "April 29, 2024", read: true, type: "billing" },
  ],

  messages: [
    { id: 1, from: "Sarah Collins",         role: "Project Manager", avatar: "SC", message: "Hi James, formatting has now started. We're working on the eBook version first. Expected completion within 10 days.", date: "May 23, 2024", time: "10:14 AM", fromClient: false },
    { id: 2, from: "James R. Harrington",   role: "Client",          avatar: "JH", message: "That's great to hear! Will the paperback formatting be done at the same time?", date: "May 23, 2024", time: "11:02 AM", fromClient: true },
    { id: 3, from: "Sarah Collins",         role: "Project Manager", avatar: "SC", message: "Yes, both eBook and Paperback will be handled in the same stage. We'll upload the files once both are ready for your review.", date: "May 23, 2024", time: "11:30 AM", fromClient: false },
    { id: 4, from: "James R. Harrington",   role: "Client",          avatar: "JH", message: "Perfect. Also, do I need to do anything for the publishing stage?", date: "May 24, 2024", time: "9:45 AM", fromClient: true },
    { id: 5, from: "Sarah Collins",         role: "Project Manager", avatar: "SC", message: "Not at all — we handle everything. You'll just need to provide your KDP account login details when we reach that stage. I'll remind you closer to the time.", date: "May 24, 2024", time: "10:20 AM", fromClient: false },
  ],
};

export type SampleClient = typeof sampleClient;
