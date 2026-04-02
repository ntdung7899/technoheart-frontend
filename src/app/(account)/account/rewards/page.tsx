"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/account/EmptyState";
import { Gift, Star, Loader2, Ticket, Clock } from "lucide-react";

interface Voucher {
    id: string;
    code: string;
    description: string;
    discount: string;
    minSpend: string;
    expiresAt: string;
    pointsCost: number;
}

interface UserVoucher {
    id: string;
    usedAt: string | null;
    createdAt: string;
    voucher: Voucher;
}

export default function RewardsPage() {
    const [points, setPoints] = useState(0);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [history, setHistory] = useState<UserVoucher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/account/rewards")
            .then((r) => r.json())
            .then((data) => {
                setPoints(data.points || 0);
                setVouchers(data.availableVouchers || []);
                setHistory(data.userVouchers || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold tracking-tight">Ưu đãi</h1>

            {/* Points Card */}
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Star className="h-7 w-7 text-primary" />
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Điểm thưởng
                    </p>
                    <p className="text-3xl font-bold tracking-tight">{points}</p>
                </div>
            </div>

            {/* Available Vouchers */}
            <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Voucher có sẵn
                </h2>
                {vouchers.length === 0 ? (
                    <EmptyState
                        icon={<Gift className="h-8 w-8" />}
                        title="Chưa có voucher"
                        description="Hiện tại chưa có voucher nào. Hãy quay lại sau nhé!"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vouchers.map((v) => (
                            <div
                                key={v.id}
                                className="rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                                        {v.code}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {v.pointsCost} điểm
                                    </span>
                                </div>
                                <p className="text-sm font-medium mb-1">{v.description}</p>
                                <p className="text-lg font-bold text-primary">
                                    -{Number(v.discount).toLocaleString("vi-VN")}₫
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-xs text-muted-foreground">
                                        Đơn tối thiểu: {Number(v.minSpend).toLocaleString("vi-VN")}₫
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        HSD: {new Date(v.expiresAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Voucher History */}
            <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Lịch sử voucher
                </h2>
                {history.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                        Bạn chưa sử dụng voucher nào.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {history.map((h) => (
                            <div
                                key={h.id}
                                className="rounded-xl border border-border/40 bg-card/50 px-4 py-3 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-sm font-medium">{h.voucher.description}</p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {h.voucher.code}
                                    </p>
                                </div>
                                <span
                                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${h.usedAt
                                            ? "bg-green-500/10 text-green-600"
                                            : "bg-yellow-500/10 text-yellow-600"
                                        }`}
                                >
                                    {h.usedAt ? "Đã dùng" : "Chưa dùng"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
