"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Users, DollarSign, Search,
    Loader2, Check, X, ChevronLeft, ChevronRight,
    Eye, ArrowLeft
} from "lucide-react";

interface AffiliateProfile {
    id: string;
    userId: string;
    referralCode: string;
    rank: string;
    personalPV: number;
    teamPV: number;
    totalEarnings: number;
    createdAt: string;
    user: { id: string; name: string | null; email: string; avatar: string | null; phone: string | null };
    commissionCount: number;
    commissionSummary: { pending: number; approved: number; paid: number; cancelled: number };
}

interface CommissionItem {
    id: string;
    affiliateId: string;
    affiliateName: string;
    affiliateRank: string;
    orderId: string;
    orderTotal: number;
    orderBuyer: string;
    amount: number;
    rate: number;
    level: number;
    type: string;
    status: string;
    createdAt: string;
}

interface Overview {
    totalAffiliates: number;
    totalCommissions: number;
    totalPending: number;
    totalApproved: number;
}

const RANK_LABELS: Record<string, { label: string; color: string }> = {
    BA: { label: "BA", color: "bg-zinc-100 text-zinc-700" },
    VIP: { label: "VIP", color: "bg-blue-100 text-blue-700" },
    VVIP: { label: "VVIP", color: "bg-purple-100 text-purple-700" },
    L1: { label: "L1", color: "bg-emerald-100 text-emerald-700" },
    L2: { label: "L2", color: "bg-amber-100 text-amber-700" },
    L3: { label: "L3", color: "bg-red-100 text-red-700" },
    L4: { label: "L4", color: "bg-pink-100 text-pink-700" },
    L5: { label: "L5", color: "bg-indigo-100 text-indigo-700" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
    PAID: { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Đã huỷ", color: "bg-red-100 text-red-700" },
};

function formatPrice(value: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export default function AdminAffiliatePage() {
    const [view, setView] = useState<"affiliates" | "commissions">("affiliates");
    const [profiles, setProfiles] = useState<AffiliateProfile[]>([]);
    const [commissions, setCommissions] = useState<CommissionItem[]>([]);
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [rankFilter, setRankFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedAffiliateId, setSelectedAffiliateId] = useState("");
    const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
    const [updating, setUpdating] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAffiliates = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (rankFilter) params.set("rank", rankFilter);
            params.set("page", String(page));
            const res = await fetch(`/api/affiliate/admin?${params}`);
            if (res.ok) {
                const data = await res.json();
                setProfiles(data.profiles);
                setOverview(data.overview);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, rankFilter, page]);

    const fetchCommissions = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedAffiliateId) params.set("affiliateId", selectedAffiliateId);
            if (statusFilter) params.set("status", statusFilter);
            params.set("page", String(page));
            const res = await fetch(`/api/affiliate/admin/commissions?${params}`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setCommissions(data.commissions);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedAffiliateId, statusFilter, page]);

    useEffect(() => {
        if (view === "affiliates") {
            fetchAffiliates();
        } else {
            fetchCommissions();
        }
    }, [view, fetchAffiliates, fetchCommissions]);

    const updateCommissionStatus = async (status: string) => {
        if (selectedCommissions.length === 0) return;
        setUpdating(true);
        try {
            const res = await fetch("/api/affiliate/admin/commissions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commissionIds: selectedCommissions, status }),
            });
            if (res.ok) {
                setCommissions(prev => prev.map(c =>
                    selectedCommissions.includes(c.id) ? { ...c, status } : c
                ));
                setSelectedCommissions([]);
                fetchCommissions();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const viewAffiliateCommissions = (affiliateId: string) => {
        setSelectedAffiliateId(affiliateId);
        setPage(1);
        setStatusFilter("");
        setSelectedCommissions([]);
        setView("commissions");
    };

    const toggleSelectAll = () => {
        if (selectedCommissions.length === commissions.length) {
            setSelectedCommissions([]);
        } else {
            setSelectedCommissions(commissions.map((c) => c.id));
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Affiliate</h1>
                    <p className="text-slate-500 text-sm mt-1">Duyệt hoa hồng, theo dõi mạng lưới đối tác.</p>
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => { setView("affiliates"); setPage(1); setSelectedAffiliateId(""); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "affiliates" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Users className="h-4 w-4 inline mr-1.5" />Đối tác
                    </button>
                    <button
                        onClick={() => { setView("commissions"); setPage(1); setSelectedAffiliateId(""); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "commissions" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <DollarSign className="h-4 w-4 inline mr-1.5" />Hoa hồng
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            {overview && view === "affiliates" && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
                            <Users className="h-4 w-4" /> Đối tác
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{overview.totalAffiliates}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
                            <DollarSign className="h-4 w-4" /> Tổng HH
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{formatPrice(overview.totalCommissions)}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-amber-200 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-amber-500 text-xs font-medium mb-2">
                            <Loader2 className="h-4 w-4" /> Chờ duyệt
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{formatPrice(overview.totalPending)}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-blue-200 p-5 shadow-sm">
                        <div className="flex items-center gap-2 text-blue-500 text-xs font-medium mb-2">
                            <Check className="h-4 w-4" /> Đã duyệt
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{formatPrice(overview.totalApproved)}</p>
                    </div>
                </div>
            )}

            {/* ===== AFFILIATES VIEW ===== */}
            {view === "affiliates" && (
                <>
                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm theo tên, email, SĐT..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                        <select
                            value={rankFilter}
                            onChange={(e) => { setRankFilter(e.target.value); setPage(1); }}
                            className="h-9 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả rank</option>
                            {Object.keys(RANK_LABELS).map((r) => (
                                <option key={r} value={r}>{RANK_LABELS[r].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            </div>
                        ) : profiles.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">Không tìm thấy đối tác nào</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đối tác</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Rank</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">PV cá nhân</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">PV nhóm</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Tổng thu nhập</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-amber-500">Chờ duyệt</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {profiles.map((p) => {
                                            const rankInfo = RANK_LABELS[p.rank] || RANK_LABELS.BA;
                                            return (
                                                <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-xs text-slate-600 shrink-0">
                                                                {(p.user.name || p.user.email).slice(0, 1).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-slate-900">{p.user.name || "N/A"}</p>
                                                                <p className="text-[11px] text-slate-400">{p.user.email}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono">{p.referralCode}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${rankInfo.color}`}>
                                                            {rankInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium">{p.personalPV.toLocaleString("vi-VN")}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium">{p.teamPV.toLocaleString("vi-VN")}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{formatPrice(p.totalEarnings)}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        {p.commissionSummary.pending > 0 ? (
                                                            <span className="text-sm font-medium text-amber-600">{formatPrice(p.commissionSummary.pending)}</span>
                                                        ) : (
                                                            <span className="text-slate-300 text-sm">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            onClick={() => viewAffiliateCommissions(p.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-primary hover:text-white text-slate-600 text-xs font-medium transition-colors"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" /> Chi tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ===== COMMISSIONS VIEW ===== */}
            {view === "commissions" && (
                <>
                    {/* Back + Filter */}
                    <div className="flex items-center gap-3">
                        {selectedAffiliateId && (
                            <button
                                onClick={() => { setSelectedAffiliateId(""); setPage(1); }}
                                className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-sm text-slate-600 transition-colors shrink-0"
                            >
                                <ArrowLeft className="h-4 w-4" /> Tất cả
                            </button>
                        )}
                        <div className="flex rounded-lg bg-slate-100 p-1 gap-0.5 flex-1">
                            {[
                                { value: "", label: "Tất cả" },
                                { value: "PENDING", label: "Chờ duyệt" },
                                { value: "APPROVED", label: "Đã duyệt" },
                                { value: "PAID", label: "Đã TT" },
                                { value: "CANCELLED", label: "Đã huỷ" },
                            ].map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => { setStatusFilter(f.value); setPage(1); setSelectedCommissions([]); }}
                                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f.value ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedCommissions.length > 0 && (
                        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <span className="text-sm font-medium text-primary">{selectedCommissions.length} đã chọn</span>
                            <div className="flex-1" />
                            <button
                                onClick={() => updateCommissionStatus("APPROVED")}
                                disabled={updating}
                                className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                <Check className="h-3.5 w-3.5 inline mr-1" /> Duyệt
                            </button>
                            <button
                                onClick={() => updateCommissionStatus("PAID")}
                                disabled={updating}
                                className="px-3 py-1.5 rounded-md bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                            >
                                <DollarSign className="h-3.5 w-3.5 inline mr-1" /> Thanh toán
                            </button>
                            <button
                                onClick={() => updateCommissionStatus("CANCELLED")}
                                disabled={updating}
                                className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                <X className="h-3.5 w-3.5 inline mr-1" /> Huỷ
                            </button>
                        </div>
                    )}

                    {/* Commissions Table */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            </div>
                        ) : commissions.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">Không có hoa hồng nào</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCommissions.length === commissions.length && commissions.length > 0}
                                                    onChange={toggleSelectAll}
                                                    className="h-4 w-4 rounded border-slate-300"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đối tác</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đơn hàng</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Loại</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Giá trị ĐH</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Tỉ lệ</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Hoa hồng</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Trạng thái</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {commissions.map((c) => {
                                            const statusInfo = STATUS_CONFIG[c.status] || STATUS_CONFIG.PENDING;
                                            return (
                                                <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCommissions.includes(c.id)}
                                                            onChange={(e) => {
                                                                setSelectedCommissions((prev) =>
                                                                    e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id)
                                                                );
                                                            }}
                                                            className="h-4 w-4 rounded border-slate-300"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-sm font-medium text-slate-900">{c.affiliateName}</p>
                                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${RANK_LABELS[c.affiliateRank]?.color || ""}`}>
                                                            {c.affiliateRank}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs font-mono text-slate-500 truncate max-w-[120px]">{c.orderId.slice(0, 12)}...</p>
                                                        <p className="text-[10px] text-slate-400">Khách: {c.orderBuyer}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="text-xs font-medium">
                                                            {c.type === "ACHIEVEMENT" ? "Thưởng" : `F${c.level}`}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-slate-600">{formatPrice(c.orderTotal)}</td>
                                                    <td className="px-4 py-3 text-center text-sm font-medium text-primary">{(c.rate * 100).toFixed(1)}%</td>
                                                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{formatPrice(c.amount)}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${statusInfo.color}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-400">
                                                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
