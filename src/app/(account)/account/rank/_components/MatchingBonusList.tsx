"use client";

import { Users } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { formatVND, getStatusStyle } from "@/lib/format-meu";
import type { MatchingBonus } from "@/lib/api/bonus";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN");
}

function formatRate(rate: number) {
  if (!rate) return "20%";
  // Hỗ trợ cả dạng phân số (0.2) và dạng phần trăm (20)
  return rate <= 1 ? `${(rate * 100).toFixed(0)}%` : `${rate}%`;
}

export function MatchingBonusList({ items }: { items: MatchingBonus[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7" />}
        title="Chưa có thưởng đồng cấp"
        description="Khi tuyến dưới F1 đạt đồng cấp, bạn sẽ nhận thưởng tại đây."
      />
    );
  }

  return (
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
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-600">
                  {formatRate(b.matchingRate)}
                </span>
              </div>
              <p className="mt-1.5 text-sm font-bold text-slate-900">
                {formatVND(b.bonusAmount)}
              </p>
              <p className="text-xs text-slate-400">
                F1: {b.f1AffiliateId} · {formatDate(b.createdAt)}
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
  );
}
