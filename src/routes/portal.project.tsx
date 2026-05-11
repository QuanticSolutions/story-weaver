import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hash, User, Calendar, Clock, Check, GitBranch, FolderOpen } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { useClient, usePortalData } from "@/context/PortalDataContext";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/project")({
  head: () => ({ meta: [{ title: "My Project — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <ProjectPage />
    </PortalGate>
  ),
});

const statusStyles: Record<string, string> = {
  Completed: "bg-green-100 text-green-800 border border-green-200",
  "In Progress": "bg-amber-100 text-amber-800 border border-amber-200",
  "Not Started": "bg-gray-100 text-gray-500 border border-gray-200",
  "On Hold": "bg-orange-100 text-orange-800 border border-orange-200",
};

function ProjectPage() {
  const completed = sampleClient.stages.filter((s) => s.status === "Completed").length;
  const total = sampleClient.stages.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-navy">My Project</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-serif text-xl text-navy/70">"{sampleClient.bookTitle}"</span>
          <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">
            {sampleClient.genre}
          </span>
        </div>
      </div>

      {/* Project info bar */}
      <div className="card-portal flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <InfoItem icon={<Hash className="h-4 w-4" />} label="Project ID" value={sampleClient.projectId} />
        <Divider />
        <InfoItem icon={<User className="h-4 w-4" />} label="Manager" value={sampleClient.assignedManager} />
        <Divider />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label="Started" value={sampleClient.startDate} />
        <Divider />
        <InfoItem icon={<Clock className="h-4 w-4" />} label="Est. Completion" value={sampleClient.estimatedCompletion} />
      </div>

      {/* Overall progress */}
      <div className="card-portal">
        <div className="flex items-center justify-between">
          <span className="font-accent text-xs font-semibold uppercase tracking-wider text-navy/60">
            Overall Progress — {completed} of {total} Stages Complete
          </span>
          <span className="font-serif text-2xl font-bold text-navy">{pct}%</span>
        </div>
        <Progress
          value={pct}
          className="mt-3 h-2 bg-navy/10 [&>div]:bg-brand-red"
        />
      </div>

      {/* Stage cards */}
      <div className="space-y-4">
        {sampleClient.stages.map((stage, idx) => {
          const isComplete = stage.status === "Completed";
          const isCurrent = stage.status === "In Progress";
          const prevComplete = idx > 0 && sampleClient.stages[idx - 1].status === "Completed";

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="relative"
            >
              {idx > 0 && (
                <div
                  className={`absolute -top-4 left-5 h-4 w-px ${
                    prevComplete ? "bg-brand-red" : "border-l border-dashed border-navy/20 bg-transparent"
                  }`}
                />
              )}
              <div className="card-portal flex items-start gap-4">
                {/* Stage circle */}
                <div className="shrink-0">
                  {isComplete ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-navy"
                      />
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
                        <GitBranch className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy/15 font-serif font-bold text-navy/30">
                      {stage.id}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-accent text-base font-bold text-navy">{stage.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyles[stage.status]}`}
                    >
                      {isCurrent && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600" />
                      )}
                      {stage.status}
                    </span>
                  </div>
                  {stage.notes && (
                    <p className="mt-1.5 text-sm text-navy/60">{stage.notes}</p>
                  )}
                  {stage.completedDate && (
                    <p className="mt-1 text-xs text-navy/40">Completed {stage.completedDate}</p>
                  )}
                </div>

                {isComplete && (
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    <FolderOpen className="mr-1.5 h-3.5 w-3.5" />
                    View Files
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-navy/50">{icon}</span>
      <div>
        <div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">{label}</div>
        <div className="text-sm font-semibold text-navy">{value}</div>
      </div>
    </div>
  );
}

function Divider() {
  return <span className="hidden h-8 w-px bg-navy/10 md:block" />;
}
