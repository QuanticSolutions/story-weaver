import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  CreditCard,
  Calendar,
  Hash,
  Check,
  Upload,
  MessageSquare,
  Download,
  FileText,
  GitBranch,
} from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { useClient, usePortalData } from "@/context/PortalDataContext";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <DashboardPage />
    </PortalGate>
  ),
});

function DashboardPage() {
  const sampleClient = useClient();
  const completed = sampleClient.stages.filter((s) => s.status === "Completed").length;
  const total = sampleClient.stages.length;
  const progress = Math.round((completed / total) * 100);
  const nextStage = sampleClient.stages.find((s) => s.status === "In Progress");
  const outstanding = sampleClient.billing
    .filter((b) => b.status !== "Paid")
    .reduce((sum, b) => sum + b.amount, 0);
  const recentNotifs = sampleClient.notifications.filter((n) => !n.read).slice(0, 3);

  // Circular progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8 lg:p-10"
        style={{
          background:
            "linear-gradient(135deg, #0B1F4B 0%, #0B1F4B 50%, #8B1A2B 130%)",
        }}
      >
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-bold text-white lg:text-5xl">
              Good morning, James.
            </h2>
            <p className="mt-2 text-base text-white/70">
              Here's your publishing journey at a glance.
            </p>
          </div>
          <div className="space-y-3 lg:text-right">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-white">
              <Hash className="h-3 w-3" /> {sampleClient.projectId}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70 lg:justify-end">
              <Calendar className="h-4 w-4" />
              Est. completion: {sampleClient.estimatedCompletion}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard delay={0.05}>
          <div className="flex items-center gap-4">
            <svg width="100" height="100" viewBox="0 0 100 100" className="-my-1">
              <circle cx="50" cy="50" r={radius} stroke="rgba(11,31,75,0.1)" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#8B1A2B"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="56" textAnchor="middle" className="font-serif" fontSize="22" fontWeight="700" fill="#0B1F4B">
                {progress}%
              </text>
            </svg>
            <div>
              <div className="font-accent text-[10px] uppercase tracking-wider text-navy/50">
                Overall Progress
              </div>
              <div className="mt-1 font-serif text-xl font-bold text-navy">
                {completed} of {total} stages
              </div>
            </div>
          </div>
        </StatCard>

        <StatCard delay={0.1}>
          <StatBody
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            label="Stages Completed"
            value={`${completed} of ${total}`}
            sub="On schedule"
          />
        </StatCard>

        <StatCard delay={0.15}>
          <StatBody
            icon={<ArrowRight className="h-5 w-5 text-brand-red" />}
            label="Next Stage"
            value={nextStage?.name ?? "—"}
            sub={nextStage?.status ?? ""}
          />
        </StatCard>

        <StatCard delay={0.2}>
          <StatBody
            icon={<CreditCard className="h-5 w-5 text-amber-600" />}
            label="Outstanding Balance"
            value={`$${outstanding.toLocaleString()}`}
            sub={`${sampleClient.billing.filter((b) => b.status !== "Paid").length} invoices`}
          />
        </StatCard>
      </div>

      {/* Pipeline + Notifications */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-portal xl:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-navy">Project Pipeline</h3>
            <Link to="/portal/project" className="text-xs font-semibold text-brand-red hover:underline">
              View all stages →
            </Link>
          </div>
          <Pipeline />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-portal"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-navy">Recent Notifications</h3>
            <Link to="/portal/notifications" className="text-xs font-semibold text-brand-red hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotifs.length === 0 && (
              <div className="text-sm text-navy/50">All caught up.</div>
            )}
            {recentNotifs.map((n) => {
              const borderColor =
                n.type === "stage"
                  ? "border-l-navy"
                  : n.type === "billing"
                  ? "border-l-brand-red"
                  : "border-l-green-500";
              return (
                <div
                  key={n.id}
                  className={`rounded-md border-l-4 ${borderColor} bg-offwhite px-3 py-2.5`}
                >
                  <div className="text-sm text-navy">{n.message}</div>
                  <div className="mt-1 text-[11px] text-navy/50">{n.date}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <QuickAction icon={Upload} label="Upload File" to="/portal/files" />
        <QuickAction icon={MessageSquare} label="Message Manager" to="/portal/messages" />
        <QuickAction icon={Download} label="Download Invoice" to="/portal/billing" />
        <QuickAction icon={FileText} label="View NDA" to="/portal/files" />
      </div>
    </div>
  );
}

function StatCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="card-portal relative overflow-hidden"
    >
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-brand-red" />
      {children}
    </motion.div>
  );
}

function StatBody({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-accent text-[10px] uppercase tracking-wider text-navy/50">
          {label}
        </span>
      </div>
      <div className="mt-3 font-serif text-2xl font-bold text-navy">{value}</div>
      {sub && <div className="mt-1 text-xs text-navy/50">{sub}</div>}
    </div>
  );
}

function Pipeline() {
  return (
    <div>
      {/* Desktop horizontal */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {sampleClient.stages.map((s, i) => {
            const isComplete = s.status === "Completed";
            const isCurrent = s.status === "In Progress";
            const prev = sampleClient.stages[i - 1];
            const lineActive = prev && prev.status === "Completed";
            return (
              <div key={s.id} className="relative flex flex-1 flex-col items-center">
                {i > 0 && (
                  <div
                    className={`absolute left-[-50%] right-[50%] top-5 h-0.5 ${
                      lineActive ? "bg-brand-red" : "bg-navy/15"
                    }`}
                  />
                )}
                <div className="relative z-10">
                  {isCurrent ? (
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-navy"
                      />
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white">
                        <GitBranch className="h-4 w-4" />
                      </div>
                    </div>
                  ) : isComplete ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy/15 bg-white text-navy/30">
                      {s.id}
                    </div>
                  )}
                </div>
                <div
                  className={`mt-2 text-center text-[11px] font-semibold ${
                    isComplete || isCurrent ? "text-navy" : "text-navy/40"
                  }`}
                >
                  {s.name}
                </div>
                {s.completedDate && (
                  <div className="text-[10px] text-navy/40">{s.completedDate}</div>
                )}
                {isCurrent && (
                  <div className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
                    In Progress
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="space-y-4 md:hidden">
        {sampleClient.stages.map((s) => {
          const isComplete = s.status === "Completed";
          const isCurrent = s.status === "In Progress";
          return (
            <div key={s.id} className="flex items-start gap-3">
              <div>
                {isComplete ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white">
                    <GitBranch className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-navy/15 text-navy/30">
                    {s.id}
                  </div>
                )}
              </div>
              <div>
                <div className={`text-sm font-semibold ${isComplete || isCurrent ? "text-navy" : "text-navy/40"}`}>
                  {s.name}
                </div>
                {s.completedDate && <div className="text-xs text-navy/50">{s.completedDate}</div>}
                {isCurrent && (
                  <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-800">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
}: {
  icon: typeof Upload;
  label: string;
  to: "/portal/files" | "/portal/messages" | "/portal/billing";
}) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -3 }}
        className="card-portal group flex flex-col items-center gap-2 px-4 py-5 text-center transition-colors hover:border-brand-red/40"
      >
        <Icon className="h-6 w-6 text-brand-red" />
        <span className="font-accent text-xs font-semibold text-navy">{label}</span>
      </motion.div>
    </Link>
  );
}
