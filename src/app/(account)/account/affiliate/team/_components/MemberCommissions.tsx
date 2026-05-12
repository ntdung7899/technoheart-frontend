"use client";

import { useEffect, useState } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
    getAffiliateCommissions,
    type AffiliateCommission,
} from "@/lib/api/affiliate";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Duyệt", color: "bg-blue-100 text-blue-700" },
    PAID: { label: "Đã TT", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Huỷ", color: "bg-red-100 text-red-700" },
};

interface Props {
    memberId: string;
}

export function MemberCommissions({ memberId }: Props) {
    const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
    const [summary, setSummary] = useState<{
        totalPending: number;
        totalApproved: number;
        totalPaid: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadMemberCommissions() {
            setLoading(true);

            try {
                const data = await getAffiliateCommissions({
                    memberId,
                });

                if (mounted) {
                    setCommissions(data.items || []);
                    setSummary({
                        totalPending: Number(data.summary?.pending || 0),
                        totalApproved: Number(data.summary?.approved || 0),
                        totalPaid: Number(data.summary?.paid || 0),
                    });
                }
            } catch (error) {
                console.error("LOAD_MEMBER_COMMISSIONS_ERROR:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadMemberCommissions();

        return () => {
            mounted = false;
        };
    }, [memberId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (commissions.length === 0) {
        return (
            <div className="text-center py-6">
                <DollarSign className="h-8 w-8 mx-auto text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground mt-2">
                    Chưa có hoa hồng từ thành viên này
                </p>
            </div>
        );
    }

    const total =
        (summary?.totalPending ?? 0) +
        (summary?.totalApproved ?? 0) +
        (summary?.totalPaid ?? 0);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-amber-50 p-2 text-center">
                    <p className="text-xs font-bold text-amber-700">
                        {formatPrice(summary?.totalPending ?? 0)}
                    </p>
                    <p className="text-[10px] text-amber-600">Chờ</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <p className="text-xs font-bold text-blue-700">
                        {formatPrice(summary?.totalApproved ?? 0)}
                    </p>
                    <p className="text-[10px] text-blue-600">Duyệt</p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-2 text-center">
                    <p className="text-xs font-bold text-emerald-700">
                        {formatPrice(summary?.totalPaid ?? 0)}
                    </p>
                    <p className="text-[10px] text-emerald-600">Đã TT</p>
                </div>
            </div>

            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-muted-foreground">
                    Tổng hoa hồng
                </span>
                <span className="text-sm font-bold text-primary">
                    {formatPrice(total)}
                </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {commissions.map((commission) => {
                    const statusInfo =
                        STATUS_LABELS[commission.status] ||
                        STATUS_LABELS.PENDING;

                    const orderTotal = Number(commission.order?.total || 0);

                    return (
                        <div
                            key={commission.id}
                            className="flex items-center gap-2.5 rounded-xl bg-secondary/30 p-2.5"
                        >
                            <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                                    Number(commission.level) === 1
                                        ? "bg-primary/10 text-primary"
                                        : "bg-purple-50 text-purple-600"
                                }`}
                            >
                                F{commission.level}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold">
                                    {formatPrice(commission.amount)}
                                    <span className="font-normal text-muted-foreground ml-1">
                                        (
                                        {(
                                            Number(commission.rate || 0) * 100
                                        ).toFixed(1)}
                                        %)
                                    </span>
                                </p>

                                <p className="text-[10px] text-muted-foreground truncate">
                                    Đơn{" "}
                                    {orderTotal > 0
                                        ? formatPrice(orderTotal)
                                        : "N/A"}{" "}
                                    ·{" "}
                                    {commission.createdAt
                                        ? new Date(
                                              commission.createdAt
                                          ).toLocaleDateString("vi-VN")
                                        : "Đang cập nhật"}
                                </p>
                            </div>

                            <span
                                className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${statusInfo.color}`}
                            >
                                {statusInfo.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}