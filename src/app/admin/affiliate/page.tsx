"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, DollarSign, Download } from "lucide-react";
import { AffiliateProfile, CommissionItem, Overview, STATUS_CONFIG, RANK_LABELS } from "./_components/constants";
import OverviewCards from "./_components/OverviewCards";
import AffiliatesFilter from "./_components/AffiliatesFilter";
import AffiliatesTable from "./_components/AffiliatesTable";
import CommissionsFilter from "./_components/CommissionsFilter";
import BulkActions from "./_components/BulkActions";
import CommissionsTable from "./_components/CommissionsTable";
import Pagination from "./_components/Pagination";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

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

    const handleEditAffiliate = (affiliateId: string) => {
        router.push(`/admin/affiliate/${affiliateId}`);
    };

    const handleDeleteAffiliate = async (affiliateId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đối tác này không?")) return;

        try {
            setLoading(true);
            const res = await fetch(`/api/affiliate/admin`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ affiliateId }),
            });

            if (res.ok) {
                setProfiles(profiles.filter(p => p.id !== affiliateId));
            } else {
                const data = await res.json();
                alert(data.error || "Xóa thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedCommissions.length === commissions.length) {
            setSelectedCommissions([]);
        } else {
            setSelectedCommissions(commissions.map((c) => c.id));
        }
    };

    const handleExportExcel = () => {
        let csvContent = "\uFEFF"; 

        if (view === "commissions") {
            csvContent += "Mã HH,Đối tác,Hạng,Mã Đơn hàng,Khách hàng,Loại,Giá trị ĐH,Tỉ lệ,Hoa hồng,Trạng thái,Ngày\n";
            
            commissions.forEach((c: any) => {
                const id = c.id || "";
                const affiliateName = c.affiliateName || "";
                const affiliateRank = RANK_LABELS[c.affiliateRank]?.label || c.affiliateRank || ""; 
                const orderId = c.orderId || "";
                const orderBuyer = c.orderBuyer || "";
                const type = c.type === "ACHIEVEMENT" ? "Thưởng" : `F${c.level}`;
                const orderTotal = c.orderTotal || 0;
                const rate = c.rate ? `${(c.rate * 100).toFixed(1)}%` : "0%";
                const amount = c.amount || 0;
                const statusInfo = STATUS_CONFIG[c.status]?.label || c.status || ""; 
                const date = c.createdAt ? new Date(c.createdAt).toLocaleDateString("vi-VN") : "";
                
                csvContent += `"${id}","${affiliateName}","${affiliateRank}","${orderId}","${orderBuyer}","${type}","${orderTotal}","${rate}","${amount}","${statusInfo}","${date}"\n`;
            });
        } else {
            csvContent += "Mã ĐT,Tên đối tác,Email,Mã giới thiệu,Hạng,PV cá nhân,PV nhóm,Tổng thu nhập,Chờ duyệt,Trạng thái\n";
            
            profiles.forEach((p: any) => {
                const id = p.id || "";
                const name = p.user?.name || "N/A";
                const email = p.user?.email || "N/A";
                const code = p.referralCode || ""; 
                const rank = RANK_LABELS[p.rank]?.label || p.rank || "";      
                const pv = p.personalPV || 0; 
                const gv = p.teamPV || 0;
                const totalEarnings = p.totalEarnings || 0;
                const pendingEarnings = p.commissionsSummary?.pending || 0;
                
                const status = p.status === "INACTIVE" ? "Bị khóa" : "Hoạt động";

                csvContent += `"${id}","${name}","${email}","${code}","${rank}","${pv}","${gv}","${totalEarnings}","${pendingEarnings}","${status}"\n`;
            });
        }

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Danh_sach_${view}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý Affiliate</h1>
                    <p className="text-slate-500 text-sm mt-1">Duyệt hoa hồng, theo dõi mạng lưới đối tác.</p>
                </div>
                <div className="flex items-center gap-3"> 
                    <button 
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
                        >
                            <Download className="h-4 w-4" />
                            Xuất Excel
                    </button>
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
            </div>

            {overview && view === "affiliates" && <OverviewCards overview={overview} />}

            {view === "affiliates" && (
                <>
                    <AffiliatesFilter
                        search={search}
                        onSearchChange={(v) => { setSearch(v); setPage(1); }}
                        rankFilter={rankFilter}
                        onRankChange={(v) => { setRankFilter(v); setPage(1); }}
                    />
                    <AffiliatesTable
                        profiles={profiles}
                        loading={loading}
                        onViewCommissions={viewAffiliateCommissions}
                        onEdit={handleEditAffiliate}
                        onDelete={handleDeleteAffiliate}
                    />
                </>
            )}

            {view === "commissions" && (
                <>
                    <CommissionsFilter
                        hasAffiliate={!!selectedAffiliateId}
                        statusFilter={statusFilter}
                        onStatusChange={(v) => { setStatusFilter(v); setPage(1); setSelectedCommissions([]); }}
                        onBack={() => { setSelectedAffiliateId(""); setPage(1); }}
                    />
                    <BulkActions
                        count={selectedCommissions.length}
                        updating={updating}
                        onApprove={() => updateCommissionStatus("APPROVED")}
                        onPay={() => updateCommissionStatus("PAID")}
                        onCancel={() => updateCommissionStatus("CANCELLED")}
                    />
                    <CommissionsTable
                        commissions={commissions}
                        loading={loading}
                        selectedIds={selectedCommissions}
                        onToggleSelect={(id, checked) =>
                            setSelectedCommissions((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id))
                        }
                        onToggleAll={toggleSelectAll}
                    />
                </>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
