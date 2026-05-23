"use client";

import { Gift } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { formatVND, formatPV, getStatusStyle } from "@/lib/format-meu";
import type { ManagementBonus } from "@/lib/api/bonus";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function ManagementBonusList({ items }: { items: ManagementBonus[] }) {
  const totalPaid = items
    .filter((b) => b.status === "PAID")
    .reduce((sum, b) => sum + Number(b.bonusAmount || 0), 0);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Gift className="h-7 w-7" />}
        title="Chưa có thưởng quản trị"
        description="Các khoản thưởng quản trị của bạn sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Tổng đã nhận
        </p>
        <p className="mt-1 text-2xl font-bold text-emerald-700">
          {formatVND(totalPaid)}
        </p>
      </div>

      <ul className="space-y-3">
        {items.map((b) => {
          const style = getStatusStyle(b.status);
          return (
            <li
              key={b.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-th-blue/10 px-2 py-0.5 text-xs font-bold text-th-blue">
                    {b.rankCode}
                  </span>
                  {b.isRetroactive && (
                    <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                      Truy lĩnh
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-bold text-slate-900">
                  {formatVND(b.bonusAmount)}
                </p>
                <p className="text-xs text-slate-400">
                  Base PV: {formatPV(b.basePV)} · Tỷ lệ:{" "}
                  {(Number(b.bonusRate) * 100).toFixed(1)}% · {formatDate(b.createdAt)}
                </p>
              </div>

              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
              >
                {style.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
