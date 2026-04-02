"use client";

import { useEffect, useState } from "react";
import { DollarSign, Loader2, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Commission {
    id: string;
    amount: number;
    rate: number;
    level: number;
    type: string;
    status: string;
    createdAt: string;
    order: {
        id: string;
        total: number;
        createdAt: string;
        user: { name: string | null };
    };
}

interface CommissionData {
    commissions: Commission[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    summary: { totalApproved: number; totalPending: number; totalPaid: number; totalCancelled: number };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Đang chờ", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
    PAID: { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Đã huỷ", color: "bg-red-100 text-red-700" },
};

export default function CommissionsPage() {
    const [data, setData] = useState<CommissionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchCommissions = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (statusFilter) params.set("status", statusFilter);
                params.set("page", String(page));
                const res = await fetch(`/api/affiliate/commissions?${params}`);
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommissions();
    }, [statusFilter, page]);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/account/affiliate"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/40 text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Lịch sử hoa hồng</h1>
                    <p className="text-muted-foreground text-sm mt-1">Chi tiết các khoản hoa hồng</p>
                </div>
            </div>

            {/* Summary */}
            {data && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                        <p className="text-lg font-bold text-amber-600">{formatPrice(data.summary.totalPending)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Đang chờ</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                        <p className="text-lg font-bold text-blue-600">{formatPrice(data.summary.totalApproved)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Đã duyệt</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                        <p className="text-lg font-bold text-emerald-600">{formatPrice(data.summary.totalPaid)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Đã thanh toán</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                        <p className="text-lg font-bold text-red-500">{formatPrice(data.summary.totalCancelled)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Bị từ chối</p>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex rounded-lg bg-secondary/30 p-0.5 gap-0.5">
                    {[
                        { value: "", label: "Tất cả" },
                        { value: "PENDING", label: "Đang chờ" },
                        { value: "APPROVED", label: "Đã duyệt" },
                        { value: "PAID", label: "Đã TT" },
                    ].map((f) => (
                        <button
                            key={f.value}
                            onClick={() => { setStatusFilter(f.value); setPage(1); }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f.value
                                    ? "bg-white dark:bg-card shadow-sm text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Commission List */}
            {data && data.commissions.length === 0 ? (
                <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground mt-4">Chưa có hoa hồng nào</p>
                </div>
            ) : data && (
                <div className="space-y-3">
                    {data.commissions.map((c) => {
                        const statusInfo = STATUS_LABELS[c.status] || STATUS_LABELS.PENDING;
                        return (
                            <div
                                key={c.id}
                                className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4"
                            >
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.level === 1 ? "bg-primary/10 text-primary" : "bg-purple-50 text-purple-600"
                                    }`}>
                                    <span className="text-xs font-bold">F{c.level}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold">
                                        {formatPrice(c.amount)}
                                        <span className="font-normal text-muted-foreground ml-1">
                                            ({(c.rate * 100).toFixed(1)}%)
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Đơn hàng {formatPrice(c.order.total)} từ {c.order.user.name || "Khách hàng"}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </span>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${p === page
                                    ? "bg-primary text-white"
                                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
