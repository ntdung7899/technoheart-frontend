"use client";

import { useEffect, useState } from "react";
import { WithdrawalHistory } from "../_components/WithdrawalHistory";
import { Loader2 } from "lucide-react";

export default function WithdrawalHistoryPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/affiliate/withdrawals')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            });
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lịch sử rút tiền</h1>
            <p className="text-muted-foreground text-sm mt-1">Quản lý hoạt động rút hoa hồng của bạn</p>
            <WithdrawalHistory history={data.profile.withdrawals} />
        </div>
    );
}