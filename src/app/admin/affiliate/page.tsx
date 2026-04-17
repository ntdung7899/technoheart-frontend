"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, DollarSign, Search } from "lucide-react"; // Đã thêm icon Search
import { AffiliateProfile, CommissionItem, Overview } from "./_components/constants";
import OverviewCards from "./_components/OverviewCards";
import AffiliatesFilter from "./_components/AffiliatesFilter";
import AffiliatesTable from "./_components/AffiliatesTable";
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
            if (search) params.set("search", search);
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
    }, [search, page]); 

    useEffect(() => {
        if (view === "affiliates") {
            fetchAffiliates();
        } else {
            fetchCommissions();
        }
    }, [view, fetchAffiliates, fetchCommissions]);

    const viewAffiliateCommissions = () => {
        setPage(1);
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
                        onClick={() => { setView("affiliates"); setPage(1); setSearch(""); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "affiliates" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Users className="h-4 w-4 inline mr-1.5" />Đối tác
                    </button>
                    <button
                        onClick={() => { setView("commissions"); setPage(1); setSearch(""); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "commissions" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <DollarSign className="h-4 w-4 inline mr-1.5" />Hoa hồng
                    </button>
                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                       
                        <button
                            onClick={() => { setView("affiliates"); setPage(1); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === "affiliates" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <Users className="h-4 w-4 inline mr-1.5" />Đối tác
                        </button>
                        <button
                            onClick={() => { setView("commissions"); setPage(1); }}
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
                <div className="space-y-4">
                    <div className="flex justify-start mb-4">
                        <div className="relative w-full sm:w-80"> 
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm theo đối tác, tên khách..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <CommissionsTable
                        commissions={commissions}
                        loading={loading}
                    />
                </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}