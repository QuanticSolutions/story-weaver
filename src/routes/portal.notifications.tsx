import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, CreditCard, MessageSquare, Bell } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalGate";
import { sampleClient } from "@/data/sampleClient";
import { useClient, usePortalData } from "@/context/PortalDataContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/portal/notifications")({
  head: () => ({ meta: [{ title: "Notifications — AWH Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PortalGate>
      <NotificationsPage />
    </PortalGate>
  ),
});

type Notif = (typeof sampleClient.notifications)[number];

function NotificationsPage() {
  const sampleClient = useClient();
  const { markAllRead: dbMarkAll, markNotificationRead } = usePortalData();
  const items = sampleClient.notifications;

  const markAllRead = () => { void dbMarkAll(); };

  const filterBy = (type?: string, unreadOnly?: boolean) =>
    items.filter((i) => (type ? i.type === type : true) && (unreadOnly ? !i.read : true));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs defaultValue="all" className="flex-1">
          <TabsList className="bg-white">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="stage">Stage Updates</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="all"><List items={filterBy()} /></TabsContent>
          <TabsContent value="unread"><List items={filterBy(undefined, true)} /></TabsContent>
          <TabsContent value="stage"><List items={filterBy("stage")} /></TabsContent>
          <TabsContent value="billing"><List items={filterBy("billing")} /></TabsContent>
          <TabsContent value="message"><List items={filterBy("message")} /></TabsContent>
        </Tabs>

        <Button onClick={markAllRead} variant="outline" className="shrink-0">
          Mark All as Read
        </Button>
      </div>
    </div>
  );
}

function List({ items }: { items: Notif[] }) {
  if (items.length === 0) {
    return (
      <div className="card-portal mt-4 flex flex-col items-center py-12 text-center">
        <Bell className="h-10 w-10 text-navy/20" />
        <p className="mt-3 text-sm text-navy/50">No notifications here</p>
      </div>
    );
  }
  return (
    <div className="mt-4 space-y-3">
      {items.map((n, i) => {
        const Icon = n.type === "stage" ? GitBranch : n.type === "billing" ? CreditCard : MessageSquare;
        const iconColor =
          n.type === "stage" ? "bg-navy/10 text-navy" :
          n.type === "billing" ? "bg-brand-red/10 text-brand-red" :
          "bg-green-100 text-green-700";

        return (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              backgroundColor: n.read ? "rgb(255,255,255)" : "rgb(238,241,248)",
            }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
            className={`flex items-start gap-4 rounded-2xl border p-4 ${
              n.read ? "border-navy/5" : "border-l-4 border-l-navy border-navy/5"
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconColor}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-navy">{n.message}</p>
              {!n.read && (
                <span className="mt-1 inline-block rounded-full bg-navy/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy">
                  New
                </span>
              )}
            </div>
            <div className="text-xs text-navy/50">{n.date}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
