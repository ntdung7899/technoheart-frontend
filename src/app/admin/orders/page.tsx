"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminOrdersClient from "@/components/admin/OrdersClient";
import {
  getAdminOrders,
  type AdminOrderListItem,
} from "@/lib/api/admin-orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      try {
        const data = await getAdminOrders();

        if (mounted) {
          setOrders(data);
        }
      } catch (error) {
        console.error("LOAD_ADMIN_ORDERS_ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Đang tải đơn hàng...
        </div>
      </div>
    );
  }

  return <AdminOrdersClient initialOrders={orders} />;
}