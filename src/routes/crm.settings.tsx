import { createFileRoute } from "@tanstack/react-router";
import { CRMGate } from "@/components/crm/CRMGate";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/crm/settings")({
  head: () => ({ meta: [{ title: "Settings — AWH CRM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <CRMGate allowedRoles={["project_manager"]}>
      <SettingsPage />
    </CRMGate>
  ),
});

function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="card-portal">
        <div className="flex items-center gap-3"><SettingsIcon className="h-5 w-5 text-brand-red" /><h2 className="font-serif text-2xl font-bold text-navy">CRM Settings</h2></div>
        <p className="mt-2 text-sm text-navy/60">Configure CRM-wide preferences.</p>
      </div>
      <div className="card-portal">
        <h3 className="font-serif text-lg font-bold text-navy">Notifications</h3>
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />New chat alerts</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />New lead alerts</label>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked />Task due reminders</label>
          <label className="flex items-center gap-2"><input type="checkbox" />Daily digest email</label>
        </div>
      </div>
      <div className="card-portal">
        <h3 className="font-serif text-lg font-bold text-navy">Working Hours</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <input defaultValue="9:00 AM" className="rounded-md border border-navy/15 px-3 py-2 text-sm" />
          <input defaultValue="6:00 PM" className="rounded-md border border-navy/15 px-3 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
