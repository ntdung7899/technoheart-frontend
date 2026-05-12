"use client";

import { useEffect, useState } from "react";
import { WithdrawalHistory } from "../_components/WithdrawalHistory";
import { Loader2 } from "lucide-react";
import {
    getAffiliateWithdrawals,
    type AffiliateWithdrawal,
} from "@/lib/api/affiliate";

export default function WithdrawalHistoryPage() {
    const [withdrawals, setWithdrawals] = useState<AffiliateWithdrawal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadWithdrawals() {
            try {
                const data = await getAffiliateWithdrawals();

                if (mounted) {
                    setWithdrawals(data);
                }
            } catch (error) {
                console.error("LOAD_AFFILIATE_WITHDRAWALS_ERROR:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadWithdrawals();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="h-40 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Lịch sử rút tiền
                </h1>

                <p className="text-muted-foreground text-sm mt-1">
                    Quản lý hoạt động rút hoa hồng của bạn
                </p>
            </div>

            <WithdrawalHistory
                history={withdrawals.map((w) => ({
                    id: w.id,
                    amount: w.amount,
                    status: w.status,
                    createdAt: w.createdAt || new Date().toISOString(),
                    bankName: w.bankName,
                    accountNumber: w.accountNumber,
                    accountName: w.accountName,
                }))}
            />
        </div>
    );
}