import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { AlertTriangle, Upload } from "lucide-react";
import { CRMGate } from "@/components/crm/CRMGate";
import { useCRM } from "@/context/CRMContext";
import { useCRMAuth } from "@/context/CRMAuthContext";
import type { Task } from "@/data/crmData";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/tasks")({
  head: () => ({ meta: [{ title: "Tasks — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager", "production"]}>
      <TasksPage />
    </CRMGate>
  ),
});

const COLS: { key: Task["status"]; color: string }[] = [
  { key: "Not Started", color: "bg-navy/40" },
  { key: "In Progress", color: "bg-amber-600" },
  { key: "On Hold", color: "bg-blue-600" },
  { key: "Submitted", color: "bg-purple-600" },
  { key: "Completed", color: "bg-green-600" },
];

function TasksPage() {
  const { projects, updateTaskStatus, submitTask, approveTask } = useCRM();
  const { crmUser } = useCRMAuth();
  const [submitOpen, setSubmitOpen] = useState<Task | null>(null);
  const [reviewOpen, setReviewOpen] = useState<Task | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const allTasks = useMemo(() => {
    return projects.flatMap((p) => p.tasks.map((t) => ({ ...t, projectId: p.id, bookTitle: p.bookTitle })));
  }, [projects]);

  const visible = useMemo(() => {
    if (!crmUser) return [];
    if (crmUser.role === "production") return allTasks.filter((t) => t.assignedTo === crmUser.name);
    return allTasks;
  }, [allTasks, crmUser]);

  const onDragEnd = (e: DragEndEvent) => {
    const id = e.active.id as string;
    const target = e.over?.id as Task["status"] | undefined;
    if (target) { updateTaskStatus(id, target); toast.success("Task moved"); }
  };

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLS.map((col) => {
            const cards = visible.filter((t) => t.status === col.key);
            return (
              <Column key={col.key} col={col} count={cards.length}>
                {cards.map((t) => (
                  <TaskCard key={t.id} task={t} role={crmUser?.role} onSubmit={() => setSubmitOpen(t)} onReview={() => setReviewOpen(t)} />
                ))}
              </Column>
            );
          })}
        </div>
      </DndContext>

      {submitOpen && <SubmitModal task={submitOpen} onClose={() => setSubmitOpen(null)} onSubmit={(notes) => { submitTask(submitOpen.id, notes); toast.success("Submitted for review"); setSubmitOpen(null); }} />}
      {reviewOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setReviewOpen(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="font-serif text-2xl font-bold text-navy">Review Submission</h3>
            <p className="mt-2 text-sm text-navy/70">{reviewOpen.title}</p>
            {reviewOpen.submittedNotes && <div className="mt-2 rounded-md bg-offwhite p-3 text-xs">{reviewOpen.submittedNotes}</div>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => { approveTask(reviewOpen.id); toast.success("Approved"); setReviewOpen(null); }} className="flex-1 rounded-md bg-green-600 py-2 text-xs font-bold text-white">Approve & Send to Client</button>
              <button onClick={() => { updateTaskStatus(reviewOpen.id, "In Progress"); toast.message("Revision requested"); setReviewOpen(null); }} className="flex-1 rounded-md bg-amber-600 py-2 text-xs font-bold text-white">Request Revision</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Column({ col, children, count }: { col: typeof COLS[number]; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div ref={setNodeRef} className={`flex w-72 shrink-0 flex-col rounded-lg ${isOver ? "ring-2 ring-brand-red" : ""}`}>
      <div className={`flex items-center justify-between rounded-t-lg ${col.color} px-3 py-2 text-white`}>
        <span className="text-xs font-bold uppercase tracking-wider">{col.key}</span>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">{count}</span>
      </div>
      <div className="flex-1 space-y-2 rounded-b-lg bg-navy/5 p-2 min-h-[400px]">{children}</div>
    </div>
  );
}

function TaskCard({ task, role, onSubmit, onReview }: { task: Task; role?: string; onSubmit: () => void; onReview: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Completed";

  return (
    <motion.div ref={setNodeRef} style={style} {...listeners} {...attributes} animate={{ scale: isDragging ? 1.05 : 1 }} className="cursor-grab rounded-md border border-navy/10 bg-white p-3 shadow-sm">
      <div className="font-accent text-sm font-bold text-navy">{task.title}</div>
      <span className="mt-1 inline-block rounded-full bg-brand-red/10 px-1.5 py-0.5 text-[9px] font-bold text-brand-red">{task.projectId}</span>
      <div className="mt-1 text-[10px] text-navy/50">{task.bookTitle}</div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="text-navy/60">{task.assignedTo}</span>
        <span className={isOverdue ? "flex items-center gap-0.5 font-bold text-brand-red" : "text-navy/60"}>
          {isOverdue && <AlertTriangle className="h-2.5 w-2.5" />}
          {task.dueDate}
        </span>
      </div>
      <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${task.priority === "High" ? "bg-brand-red/15 text-brand-red" : task.priority === "Medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-700"}`}>{task.priority}</span>
      {role === "production" && task.status === "In Progress" && (
        <button onPointerDown={(e) => e.stopPropagation()} onClick={onSubmit} className="mt-2 w-full rounded bg-brand-red py-1 text-[10px] font-bold uppercase text-white">Submit Work</button>
      )}
      {role === "project_manager" && task.status === "Submitted" && (
        <button onPointerDown={(e) => e.stopPropagation()} onClick={onReview} className="mt-2 w-full rounded bg-purple-600 py-1 text-[10px] font-bold uppercase text-white">Review & Approve</button>
      )}
    </motion.div>
  );
}

function SubmitModal({ task, onClose, onSubmit }: { task: Task; onClose: () => void; onSubmit: (notes: string) => void }) {
  const [notes, setNotes] = useState("");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="font-serif text-2xl font-bold text-navy">Submit Work</h3>
        <p className="mt-1 text-sm text-navy/60">{task.title}</p>
        <div className="mt-4 rounded-md border-2 border-dashed border-navy/20 p-6 text-center text-xs text-navy/50">
          <Upload className="mx-auto mb-2 h-5 w-5" />Click to upload completed file (simulated)
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes for the project manager..." rows={3} className="mt-3 w-full rounded-md border border-navy/15 p-2 text-sm" />
        <button onClick={() => onSubmit(notes)} className="btn-uppercase mt-3 w-full rounded-md bg-brand-red py-2.5 text-xs text-white">Mark as Submitted</button>
      </motion.div>
    </motion.div>
  );
}
