import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Hash, Calendar, Edit, MessageSquare, Shield, Download, Eye } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/portal/profile")({
  head: () => ({ meta: [{ title: "Profile — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <ProfilePage />
    </PortalGate>
  ),
});

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [name, setName] = useState(sampleClient.name);
  const [email, setEmail] = useState(sampleClient.email);
  const [phone, setPhone] = useState(sampleClient.phone);

  const contracts = sampleClient.files.filter((f) => f.type === "Contract");

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="card-portal flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy font-serif text-3xl font-bold text-white">
          {sampleClient.avatar}
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-3xl font-bold text-navy">{sampleClient.name}</h2>
          <div className="mt-1 text-sm text-navy/60">{sampleClient.email} · {sampleClient.phone}</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-red/40 px-3 py-1 text-[11px] font-bold tracking-wider text-brand-red">
              <Hash className="h-3 w-3" /> {sampleClient.projectId}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-navy/60">
              <Calendar className="h-3.5 w-3.5" /> Member since March 2024
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <div className="card-portal">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-navy">Personal Information</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (editing) toast.success("Profile updated");
                setEditing((v) => !v);
              }}
            >
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              {editing ? "Save" : "Edit"}
            </Button>
          </div>
          <div className="space-y-4">
            <Field label="Full Name" value={name} onChange={setName} editing={editing} />
            <Field label="Email" value={email} onChange={setEmail} editing={editing} />
            <Field label="Phone" value={phone} onChange={setPhone} editing={editing} />
          </div>
        </div>

        {/* Project Manager */}
        <div className="card-portal">
          <h3 className="mb-4 font-serif text-xl font-bold text-navy">Project Manager</h3>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy font-serif text-lg font-bold text-white">
              SC
            </div>
            <div className="flex-1">
              <div className="font-accent font-bold text-navy">Sarah Collins</div>
              <div className="text-xs text-navy/50">Project Manager</div>
              <div className="mt-1 text-sm text-navy/70">sarah.collins@awh.com</div>
              <Button asChild size="sm" className="mt-3 bg-brand-red text-white hover:bg-brand-red-dark">
                <Link to="/portal/messages">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Message
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Book Information */}
        <div className="card-portal">
          <h3 className="mb-4 font-serif text-xl font-bold text-navy">Book Information</h3>
          <div className="space-y-3 text-sm">
            <Row label="Title" value={sampleClient.bookTitle} />
            <Row label="Genre" value={sampleClient.genre} />
            <Row label="Start Date" value={sampleClient.startDate} />
            <Row label="Est. Completion" value={sampleClient.estimatedCompletion} />
          </div>
        </div>

        {/* Security */}
        <div className="card-portal">
          <h3 className="mb-4 font-serif text-xl font-bold text-navy">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="font-accent text-[10px] uppercase tracking-wider text-navy/50">Password</label>
              <div className="mt-1 rounded-md border border-navy/10 bg-navy/[0.02] px-3 py-2 text-sm text-navy/60">
                ••••••••••••
              </div>
            </div>
            <Button variant="outline" onClick={() => setPwdOpen(true)}>
              Change Password
            </Button>
          </div>
        </div>

        {/* NDA & Agreements */}
        <div className="card-portal lg:col-span-2">
          <h3 className="mb-4 font-serif text-xl font-bold text-navy">NDA & Agreements</h3>
          <div className="space-y-3">
            {contracts.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-navy/5 bg-offwhite px-4 py-3">
                <Shield className="h-4 w-4 text-brand-red" />
                <span className="flex-1 truncate text-sm font-semibold text-navy">{c.name}</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-800">
                  Signed {c.date}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success("Downloaded", { description: c.name })}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.info("Preview unavailable in demo")}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
    </div>
  );
}

function Field({
  label, value, onChange, editing,
}: { label: string; value: string; onChange: (v: string) => void; editing: boolean }) {
  return (
    <div>
      <label className="font-accent text-[10px] uppercase tracking-wider text-navy/50">{label}</label>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border-[1.5px] border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:border-brand-red focus:outline-none"
        />
      ) : (
        <div className="mt-1 rounded-md border border-navy/10 bg-navy/[0.02] px-3 py-2 text-sm text-navy">{value}</div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-navy/5 pb-2 last:border-0">
      <span className="font-accent text-[11px] uppercase tracking-wider text-navy/50">{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const submit = () => {
    if (!current || !next || next !== confirm) {
      toast.error("Please complete all fields and ensure passwords match");
      return;
    }
    toast.success("Password updated");
    setCurrent(""); setNext(""); setConfirm("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-navy">Change Password</DialogTitle>
          <DialogDescription>Choose a strong new password.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <input type="password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)}
            className="w-full rounded-md border-[1.5px] border-navy/15 bg-white px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
          <input type="password" placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)}
            className="w-full rounded-md border-[1.5px] border-navy/15 bg-white px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
          <input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-md border-[1.5px] border-navy/15 bg-white px-3 py-2 text-sm focus:border-brand-red focus:outline-none" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} className="bg-brand-red text-white hover:bg-brand-red-dark">Update Password</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
