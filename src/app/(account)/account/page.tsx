"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SummaryCard } from "@/components/account/SummaryCard";
import { ShoppingBag, Clock, Star, Heart, Loader2 } from "lucide-react";
import {
  getAccountSummary,
  type AccountSummary,
} from "@/lib/api/account";
import { ApiError } from "@/lib/api/client";

export default function AccountDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      try {
        const data = await getAccountSummary();

        if (mounted) {
          setSummary(data);
        }
        } catch (error) {
        console.error("GET_ACCOUNT_SUMMARY_ERROR:", error);

        if (error instanceof ApiError && error.status === 401) {
          router.push("/login");
          return;
        }

        if (mounted) {
          setSummary(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Đang tải thông tin tài khoản...
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        Không tải được thông tin tài khoản. Vui lòng kiểm tra API account summary.
      </div>
    );
  }

  const user = summary.user;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Xin chào, {user?.name || "bạn"} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Chào mừng bạn trở lại với Technoheart
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Tổng đơn hàng"
          value={summary.totalOrders}
          subtitle="Tất cả đơn hàng của bạn"
          color="blue"
        />

        <SummaryCard
          icon={<Clock className="h-5 w-5" />}
          label="Đang chờ"
          value={summary.pendingOrders}
          subtitle="Đơn hàng chờ xử lý"
          color="amber"
        />

        <SummaryCard
          icon={<Heart className="h-5 w-5" />}
          label="Yêu thích"
          value={summary.wishlistCount}
          subtitle="Sản phẩm đã lưu"
          color="rose"
        />

        <SummaryCard
          icon={<Star className="h-5 w-5" />}
          label="Điểm thưởng"
          value={user?.points || 0}
          subtitle="Điểm tích luỹ của bạn"
          color="emerald"
        />
      </div>

      {/* Recently Viewed */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Sản phẩm đã xem gần đây
        </h2>

        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-400">
            Tính năng đang được phát triển
          </p>
        </div>
      </div>
    </div>
  );
}