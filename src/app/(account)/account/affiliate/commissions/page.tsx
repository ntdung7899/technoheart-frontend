"use client";

import { useEffect, useMemo, useState } from "react";
import { DollarSign, Loader2, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
    getAffiliateCommissions,
    type AffiliateCommission,
} from "@/lib/api/affiliate";

type Commission = AffiliateCommission;

type CommissionData = {
    commissions: Commission[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary: {
        totalApproved: number;
        totalPending: number;
        totalPaid: number;
        totalCancelled: number;
    };
};

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Đang chờ", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
    PAID: { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Đã huỷ", color: "bg-red-100 text-red-700" },
};

function isDateInRange(dateValue?: string, startDate?: string, endDate?: string) {
    if (!dateValue) return false;

    const createdAt = new Date(dateValue);

    if (Number.isNaN(createdAt.getTime())) return false;

    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (createdAt < start) return false;
    }

    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (createdAt > end) return false;
    }

    return true;
}

function buildCommissionData(
    items: Commission[],
    page: number,
    startDate: string,
    endDate: string
): CommissionData {
    const filteredByDate =
        startDate || endDate
            ? items.filter((item) => isDateInRange(item.createdAt, startDate, endDate))
            : items;

    const total = filteredByDate.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);

    const pagedItems = filteredByDate.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    return {
        commissions: pagedItems,
        pagination: {
            page: safePage,
            limit: PAGE_SIZE,
            total,
            totalPages,
        },
        summary: {
            totalApproved: filteredByDate
                .filter((item) => item.status === "APPROVED")
                .reduce((sum, item) => sum + Number(item.amount || 0), 0),
            totalPending: filteredByDate
                .filter((item) => item.status === "PENDING")
                .reduce((sum, item) => sum + Number(item.amount || 0), 0),
            totalPaid: filteredByDate
                .filter((item) => item.status === "PAID")
                .reduce((sum, item) => sum + Number(item.amount || 0), 0),
            totalCancelled: filteredByDate
                .filter((item) => item.status === "CANCELLED")
                .reduce((sum, item) => sum + Number(item.amount || 0), 0),
        },
    };
}

export default function CommissionsPage() {
    const [items, setItems] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        let mounted = true;

        async function fetchCommissions() {
            setLoading(true);

            try {
                const response = await getAffiliateCommissions(
                    statusFilter || undefined
                );

                if (mounted) {
                    setItems(response.items || []);
                }
            } catch (error) {
                console.error("LOAD_AFFILIATE_COMMISSIONS_ERROR:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchCommissions();

        return () => {
            mounted = false;
        };
    }, [statusFilter]);

    const data = useMemo(() => {
        return buildCommissionData(items, page, startDate, endDate);
    }, [items, page, startDate, endDate]);

    useEffect(() => {
        if (page > data.pagination.totalPages) {
            setPage(data.pagination.totalPages);
        }
    }, [page, data.pagination.totalPages]);

    if (loading && items.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const displayTotalApproved = data.summary.totalApproved;

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
                    <h1 className="text-2xl font-bold tracking-tight">
                        Lịch sử hoa hồng
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Chi tiết các khoản hoa hồng
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                    <p className="text-lg font-bold text-amber-600">
                        {formatPrice(data.summary.totalPending)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Đang chờ
                    </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                    <p className="text-lg font-bold text-blue-600">
                        {formatPrice(displayTotalApproved)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Đã duyệt
                    </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                    <p className="text-lg font-bold text-emerald-600">
                        {formatPrice(data.summary.totalPaid)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Đã thanh toán
                    </p>
                </div>

                <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                    <p className="text-lg font-bold text-red-500">
                        {formatPrice(data.summary.totalCancelled)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Bị từ chối
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />

                <div className="flex rounded-lg bg-secondary/30 p-0.5 gap-0.5">
                    {[
                        { value: "", label: "Tất cả" },
                        { value: "PENDING", label: "Đang chờ" },
                        { value: "APPROVED", label: "Đã duyệt" },
                        { value: "PAID", label: "Đã TT" },
                    ].map((filter) => (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => {
                                setStatusFilter(filter.value);
                                setPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                statusFilter === filter.value
                                    ? "bg-white dark:bg-card shadow-sm text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <input
                    type="date"
                    value={startDate}
                    onChange={(event) => {
                        setStartDate(event.target.value);
                        setPage(1);
                    }}
                    className="text-xs border border-border/40 bg-card/50 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                />

                <span className="text-muted-foreground text-xs">-</span>

                <input
                    type="date"
                    value={endDate}
                    onChange={(event) => {
                        setEndDate(event.target.value);
                        setPage(1);
                    }}
                    className="text-xs border border-border/40 bg-card/50 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                />

                {(startDate || endDate) && (
                    <button
                        type="button"
                        onClick={() => {
                            setStartDate("");
                            setEndDate("");
                            setPage(1);
                        }}
                        className="text-xs text-red-500 hover:underline ml-1"
                    >
                        Xoá
                    </button>
                )}
            </div>

            {loading && items.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật dữ liệu...
                </div>
            )}

            {data.commissions.length === 0 ? (
                <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground mt-4">
                        Chưa có hoa hồng nào
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.commissions.map((commission) => {
                        const statusInfo =
                            STATUS_LABELS[commission.status] ||
                            STATUS_LABELS.PENDING;

                        const orderTotal = Number(commission.order?.total || 0);
                        const orderCode = commission.order?.id
                            ? commission.order.id.slice(-8).toUpperCase()
                            : "N/A";

                        return (
                            <div
                                key={commission.id}
                                className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4"
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                        Number(commission.level) === 1
                                            ? "bg-primary/10 text-primary"
                                            : "bg-purple-50 text-purple-600"
                                    }`}
                                >
                                    <span className="text-xs font-bold">
                                        F{commission.level}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold">
                                        {formatPrice(commission.amount)}
                                        <span className="font-normal text-muted-foreground ml-1">
                                            ({(Number(commission.rate || 0) * 100).toFixed(1)}%)
                                        </span>
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        Đơn hàng #{orderCode}
                                        {orderTotal > 0
                                            ? ` - ${formatPrice(orderTotal)}`
                                            : ""}
                                    </p>
                                </div>

                                <div className="text-right shrink-0">
                                    <span
                                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${statusInfo.color}`}
                                    >
                                        {statusInfo.label}
                                    </span>

                                    <p className="text-xs text-muted-foreground mt-1">
                                        {commission.createdAt
                                            ? new Date(
                                                  commission.createdAt
                                              ).toLocaleDateString("vi-VN")
                                            : "Đang cập nhật"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    {Array.from(
                        { length: data.pagination.totalPages },
                        (_, index) => index + 1
                    ).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            type="button"
                            onClick={() => setPage(pageNumber)}
                            className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${
                                pageNumber === data.pagination.page
                                    ? "bg-primary text-white"
                                    : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                            }`}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}