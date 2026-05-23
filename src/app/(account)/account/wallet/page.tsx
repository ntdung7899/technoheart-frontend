"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getWallet, getWalletTransactions, type Wallet, type WalletTransaction } from "@/lib/api/wallet";
import { getAffiliateWithdrawals, type AffiliateWithdrawal } from "@/lib/api/affiliate";
import { WalletBalanceCard } from "./_components/WalletBalanceCard";
import { WithdrawalForm } from "./_components/WithdrawalForm";
import { WalletTransactionList } from "./_components/WalletTransactionList";
import { WithdrawalRequestList } from "./_components/WithdrawalRequestList";

type Tab = "balance" | "transactions" | "withdrawals";

const TABS: { key: Tab; label: string }[] = [
  { key: "balance", label: "Số dư" },
  { key: "transactions", label: "Lịch sử giao dịch" },
  { key: "withdrawals", label: "Yêu cầu rút tiền" },
];

export default function WalletPage() {
  const [tab, setTab] = useState<Tab>("balance");

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txLoaded, setTxLoaded] = useState(false);

  const [withdrawals, setWithdrawals] = useState<AffiliateWithdrawal[]>([]);
  const [wdLoading, setWdLoading] = useState(false);
  const [wdLoaded, setWdLoaded] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const loadWallet = useCallback(async () => {
    setWalletLoading(true);
    try {
      const data = await getWallet();
      setWallet(data);
    } catch (error) {
      console.error("LOAD_WALLET_ERROR:", error);
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const data = await getWalletTransactions({ page: 1, limit: 50 });
      setTransactions(data.rows || []);
    } catch (error) {
      console.error("LOAD_WALLET_TX_ERROR:", error);
    } finally {
      setTxLoading(false);
      setTxLoaded(true);
    }
  }, []);

  const loadWithdrawals = useCallback(async () => {
    setWdLoading(true);
    try {
      const data = await getAffiliateWithdrawals();
      setWithdrawals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD_WITHDRAWALS_ERROR:", error);
    } finally {
      setWdLoading(false);
      setWdLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  useEffect(() => {
    if (tab === "transactions" && !txLoaded) loadTransactions();
    if (tab === "withdrawals" && !wdLoaded) loadWithdrawals();
  }, [tab, txLoaded, wdLoaded, loadTransactions, loadWithdrawals]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ví điện tử</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý số dư, giao dịch và yêu cầu rút tiền của bạn
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

      {tab === "balance" && (
        <div className="space-y-6">
          {walletLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : wallet ? (
            <>
              <WalletBalanceCard
                wallet={wallet}
                onWithdrawClick={() => setShowForm((v) => !v)}
              />
              {showForm && (
                <WithdrawalForm
                  onSuccess={() => {
                    setShowForm(false);
                    loadWallet();
                    setWdLoaded(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Không tải được thông tin ví. Vui lòng thử lại.
            </p>
          )}
        </div>
      )}

      {tab === "transactions" &&
        (txLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <WalletTransactionList transactions={transactions} />
        ))}

      {tab === "withdrawals" &&
        (wdLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <WithdrawalRequestList
            withdrawals={withdrawals}
            onChanged={() => {
              loadWithdrawals();
              loadWallet();
            }}
          />
        ))}
    </div>
  );
}
