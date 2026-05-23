"use client";

import { Wallet as WalletIcon, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SummaryCard } from "@/components/account/SummaryCard";
import { formatVND } from "@/lib/format-meu";
import type { Wallet } from "@/lib/api/wallet";

export function WalletBalanceCard({
  wallet,
  onWithdrawClick,
}: {
  wallet: Wallet;
  onWithdrawClick: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-th-dark to-slate-800 p-6 text-white">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <WalletIcon className="h-4 w-4" />
          Số dư khả dụng
        </div>
        <p className="mt-2 text-4xl font-bold tracking-tight">
          {formatVND(wallet.balance)}
        </p>
        {wallet.lockedBalance > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
            <Lock className="h-3.5 w-3.5" />
            Đang khoá: {formatVND(wallet.lockedBalance)}
          </p>
        )}
        <button
          onClick={onWithdrawClick}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-th-dark transition hover:bg-white/90"
        >
          <ArrowUpRight className="h-4 w-4" />
          Rút tiền
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SummaryCard
          icon={<ArrowUpRight className="h-5 w-5" />}
          label="Tổng đã nhận"
          value={formatVND(wallet.totalCredited)}
          color="emerald"
        />
        <SummaryCard
          icon={<ArrowDownRight className="h-5 w-5" />}
          label="Tổng đã chi"
          value={formatVND(wallet.totalDebited)}
          color="rose"
        />
      </div>
    </div>
  );
}
