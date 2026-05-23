"use client";

import { ArrowUpRight, ArrowDownRight, Receipt } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { formatVND } from "@/lib/format-meu";
import type { WalletTransaction } from "@/lib/api/wallet";

const SOURCE_LABEL: Record<string, string> = {
  MANAGEMENT_BONUS: "Thưởng quản trị",
  MATCHING_BONUS: "Thưởng đồng cấp",
  WITHDRAWAL: "Rút tiền",
  HUB_ROYALTY: "Hoa hồng Hub (royalty)",
  HUB_OPERATION: "Vận hành Hub",
  COMMISSION: "Hoa hồng",
  ADJUSTMENT: "Điều chỉnh",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("vi-VN");
}

export function WalletTransactionList({
  transactions,
}: {
  transactions: WalletTransaction[];
}) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-7 w-7" />}
        title="Chưa có giao dịch"
        description="Lịch sử giao dịch ví của bạn sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {transactions.map((tx) => {
        const isCredit = tx.type === "CREDIT";
        return (
          <li key={tx.id} className="flex items-center gap-4 p-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isCredit
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {isCredit ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : (
                <ArrowDownRight className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {tx.description || SOURCE_LABEL[tx.source] || tx.source}
              </p>
              <p className="text-xs text-slate-400">
                {SOURCE_LABEL[tx.source] || tx.source} · {formatDate(tx.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  isCredit ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {isCredit ? "+" : "-"}
                {formatVND(tx.amount)}
              </p>
              <p className="text-xs text-slate-400">
                Số dư: {formatVND(tx.balanceAfter)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
