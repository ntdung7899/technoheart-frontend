"use client";

import { History } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { formatPV } from "@/lib/format-meu";
import type { PvLedger } from "@/lib/api/bonus";

const TYPE_STYLE: Record<string, { label: string; className: string }> = {
  ORDER: { label: "Đơn hàng", className: "bg-emerald-50 text-emerald-600" },
  ADJUSTMENT: { label: "Điều chỉnh", className: "bg-amber-50 text-amber-600" },
  CORRECTION: { label: "Sửa lỗi", className: "bg-orange-50 text-orange-600" },
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function PvLedgerList({ items }: { items: PvLedger[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<History className="h-7 w-7" />}
        title="Chưa có lịch sử PV"
        description="Lịch sử tích luỹ PV theo từng đơn hàng sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const typeStyle = TYPE_STYLE[item.type] || {
          label: item.type,
          className: "bg-slate-100 text-slate-500",
        };
        return (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${typeStyle.className}`}
                >
                  {typeStyle.label}
                </span>
                <span className="text-xs text-slate-400">
                  Kỳ {item.cycleMonth}/{item.cycleYear}
                </span>
              </div>
              {item.note && (
                <p className="mt-1 text-xs text-slate-400">{item.note}</p>
              )}
              <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
            </div>

            <p
              className={`text-sm font-bold ${
                Number(item.pvAmount) >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {Number(item.pvAmount) >= 0 ? "+" : ""}
              {formatPV(item.pvAmount)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
