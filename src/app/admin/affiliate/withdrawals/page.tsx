"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import WithdrawalsClient from "../_components/WithdrawalsClient";
import {
    getAdminWithdrawals,
    type AdminWithdrawalRequest,
} from "@/lib/api/admin-affiliate";

type WithdrawalRow = {
    id: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
        referralCode: string;
    };
};

function mapWithdrawal(item: AdminWithdrawalRequest): WithdrawalRow {
    return {
        id: item.id,
        amount: Number(item.amount || 0),
        bankName: item.bankName || "",
        accountNumber: item.accountNumber || "",
        accountName: item.accountName || "",
        status: item.status || "PENDING",
        createdAt: item.createdAt || new Date().toISOString(),
        user: {
            name: item.affiliate?.user?.name || null,
            email: item.affiliate?.user?.email || "",
            referralCode: item.affiliate?.referralCode || "",
        },
    };
}

export default function AdminWithdrawalsPage() {
    const [requests, setRequests] = useState<WithdrawalRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadWithdrawals() {
            try {
                const data = await getAdminWithdrawals();

                if (mounted) {
                    setRequests(data.map(mapWithdrawal));
                }
            } catch (error) {
                console.error("LOAD_ADMIN_WITHDRAWALS_ERROR:", error);

                if (mounted) {
                    setRequests([]);
                }
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
            <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tải yêu cầu rút tiền...
                </div>
            </div>
        );
    }

    return <WithdrawalsClient initialData={requests} />;
}