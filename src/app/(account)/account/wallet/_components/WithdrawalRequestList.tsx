"use client";

import { useState } from "react";
import { Banknote, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { cancelWithdrawal, type AffiliateWithdrawal } from "@/lib/api/affiliate";
import { formatVND, getStatusStyle, getApiErrorMessage } from "@/lib/format-meu";

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("vi-VN");
}

export function WithdrawalRequestList({
  withdrawals,
  onChanged,
}: {
  withdrawals: AffiliateWithdrawal[];
  onChanged: () => void;
}) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function handleCancel(id: string) {
    if (!window.confirm("Bạn chắc chắn muốn huỷ yêu cầu rút tiền này?")) return;

    setCancellingId(id);

    try {
      await cancelWithdrawal(id);
      alert("Đã huỷ yêu cầu rút tiền");
      onChanged();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thể huỷ yêu cầu này"));
    } finally {
      setCancellingId(null);
    }
  }

  if (withdrawals.length === 0) {
    return (
      <EmptyState
        icon={<Banknote className="h-7 w-7" />}
        title="Chưa có yêu cầu rút tiền"
        description="Các yêu cầu rút tiền của bạn sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {withdrawals.map((w) => {
        const style = getStatusStyle(w.status);
        return (
          <li
            key={w.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">
                {formatVND(w.amount)}
              </p>
              <p className="truncate text-xs text-slate-400">
                {w.bankName} · {w.accountNumber} · {w.accountName}
              </p>
              <p className="text-xs text-slate-400">{formatDate(w.createdAt)}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
              >
                {style.label}
              </span>

              {w.status === "PENDING" && (
                <button
                  onClick={() => handleCancel(w.id)}
                  disabled={cancellingId === w.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {cancellingId === w.id && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Huỷ
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
