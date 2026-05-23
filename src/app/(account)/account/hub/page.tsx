"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Inbox } from "lucide-react";
import {
  getHubOrders,
  getHubInventory,
  acceptHubOrder,
  rejectHubOrder,
  completeHubOrder,
  type HubOrder,
  type HubInventoryItem,
} from "@/lib/api/hub";
import { EmptyState } from "@/components/account/EmptyState";
import { getApiErrorMessage } from "@/lib/format-meu";
import { HubOrderCard } from "./_components/HubOrderCard";
import { HubInventoryTable } from "./_components/HubInventoryTable";
import { RejectOrderModal } from "./_components/RejectOrderModal";

type Tab = "assigned" | "accepted" | "inventory";

const TABS: { key: Tab; label: string }[] = [
  { key: "assigned", label: "Đơn chờ xử lý" },
  { key: "accepted", label: "Đang giao" },
  { key: "inventory", label: "Tồn kho" },
];

const Spinner = () => (
  <div className="flex h-40 items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
  </div>
);

export default function HubPage() {
  const [tab, setTab] = useState<Tab>("assigned");

  const [assigned, setAssigned] = useState<HubOrder[]>([]);
  const [accepted, setAccepted] = useState<HubOrder[]>([]);
  const [inventory, setInventory] = useState<HubInventoryItem[]>([]);

  const [assignedLoading, setAssignedLoading] = useState(true);
  const [acceptedLoading, setAcceptedLoading] = useState(false);
  const [acceptedLoaded, setAcceptedLoaded] = useState(false);
  const [invLoading, setInvLoading] = useState(false);
  const [invLoaded, setInvLoaded] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<HubOrder | null>(null);

  const loadAssigned = useCallback(async () => {
    setAssignedLoading(true);
    try {
      const data = await getHubOrders({ status: "ASSIGNED", page: 1, limit: 50 });
      setAssigned(data.rows || []);
    } catch (error) {
      console.error("LOAD_HUB_ASSIGNED_ERROR:", error);
    } finally {
      setAssignedLoading(false);
    }
  }, []);

  const loadAccepted = useCallback(async () => {
    setAcceptedLoading(true);
    try {
      const data = await getHubOrders({ status: "ACCEPTED", page: 1, limit: 50 });
      setAccepted(data.rows || []);
    } catch (error) {
      console.error("LOAD_HUB_ACCEPTED_ERROR:", error);
    } finally {
      setAcceptedLoading(false);
      setAcceptedLoaded(true);
    }
  }, []);

  const loadInventory = useCallback(async () => {
    setInvLoading(true);
    try {
      const data = await getHubInventory({ page: 1, limit: 100 });
      setInventory(data.rows || []);
    } catch (error) {
      console.error("LOAD_HUB_INVENTORY_ERROR:", error);
    } finally {
      setInvLoading(false);
      setInvLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadAssigned();
  }, [loadAssigned]);

  useEffect(() => {
    if (tab === "accepted" && !acceptedLoaded) loadAccepted();
    if (tab === "inventory" && !invLoaded) loadInventory();
  }, [tab, acceptedLoaded, invLoaded, loadAccepted, loadInventory]);

  async function handleAccept(id: string) {
    try {
      await acceptHubOrder(id);
      alert("Đã nhận đơn hàng");
      loadAssigned();
      setAcceptedLoaded(false);
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thể nhận đơn"));
    }
  }

  async function handleComplete(id: string) {
    try {
      await completeHubOrder(id);
      alert("Đã hoàn thành giao hàng");
      loadAccepted();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thể hoàn thành đơn"));
    }
  }

  async function handleReject(note: string) {
    if (!rejectTarget) return;
    try {
      await rejectHubOrder(rejectTarget.id, note);
      alert("Đã từ chối đơn hàng");
      setRejectTarget(null);
      loadAssigned();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thể từ chối đơn"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Quản lý Hub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Xử lý đơn hàng được điều phối và quản lý tồn kho Hub của bạn
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key
                ? "border-th-blue text-th-blue"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "assigned" &&
        (assignedLoading ? (
          <Spinner />
        ) : assigned.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-7 w-7" />}
            title="Không có đơn chờ xử lý"
            description="Các đơn hàng mới được điều phối tới Hub sẽ hiển thị tại đây."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {assigned.map((order) => (
              <HubOrderCard
                key={order.id}
                order={order}
                variant="assigned"
                onAccept={handleAccept}
                onReject={(o) => setRejectTarget(o)}
                onExpire={loadAssigned}
              />
            ))}
          </div>
        ))}

      {tab === "accepted" &&
        (acceptedLoading ? (
          <Spinner />
        ) : accepted.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-7 w-7" />}
            title="Không có đơn đang giao"
            description="Các đơn đã nhận và đang giao sẽ hiển thị tại đây."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {accepted.map((order) => (
              <HubOrderCard
                key={order.id}
                order={order}
                variant="accepted"
                onComplete={handleComplete}
              />
            ))}
          </div>
        ))}

      {tab === "inventory" &&
        (invLoading ? (
          <Spinner />
        ) : (
          <HubInventoryTable items={inventory} onUpdated={loadInventory} />
        ))}

      <RejectOrderModal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
      />
    </div>
  );
}
