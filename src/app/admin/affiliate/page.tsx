"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, DollarSign, Search, Download } from "lucide-react";
import {
    AffiliateProfile,
    CommissionItem,
    Overview,
    RANK_LABELS,
    STATUS_CONFIG,
} from "./_components/constants";
import OverviewCards from "./_components/OverviewCards";
import AffiliatesFilter from "./_components/AffiliatesFilter";
import AffiliatesTable from "./_components/AffiliatesTable";
import CommissionsTable from "./_components/CommissionsTable";
import Pagination from "./_components/Pagination";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
    getAdminAffiliates,
    getAdminAffiliateCommissions,
    deleteAdminAffiliate,
} from "@/lib/api/admin-affiliate";

function toQueryParams(params: URLSearchParams) {
    return Object.fromEntries(params.entries());
}

function normalizeAffiliateResponse(data: any) {
    const profiles = data?.profiles || data?.items || [];

    const overview =
        data?.overview ||
        data?.summary ||
        data?.stats ||
        null;

    const totalPages =
        data?.pagination?.totalPages ||
        data?.totalPages ||
        Math.max(1, Math.ceil(Number(data?.total || profiles.length || 0) / 20));

    return {
        profiles,
        overview,
        totalPages,
    };
}

function normalizeCommissionResponse(data: any) {
    const rawItems = data?.commissions || data?.items || [];

    const commissions = rawItems.map((item: any) => {
        const affiliate = item.affiliate || {};
        const affiliateUser = affiliate.user || {};

        return {
            ...item,

            affiliateName:
                item.affiliateName ||
                affiliateUser.name ||
                affiliateUser.email ||
                "N/A",

            affiliateRank:
                item.affiliateRank ||
                affiliate.rank ||
                "BA",

            orderBuyer:
                item.orderBuyer ||
                item.order?.user?.name ||
                item.order?.user?.email ||
                "N/A",

            orderTotal:
                item.orderTotal ||
                item.order?.total ||
                0,

            amount: Number(item.amount || 0),
            rate: Number(item.rate || 0),
            level: Number(item.level || 1),
            status: item.status || "PENDING",
            type: item.type || "DIRECT",
        };
    });

    const totalPages =
        data?.pagination?.totalPages ||
        data?.totalPages ||
        Math.max(1, Math.ceil(Number(data?.total || commissions.length || 0) / 20));

    return {
        commissions,
        totalPages,
    };
}

export default function AdminAffiliatePage() {
    const [view, setView] = useState<"affiliates" | "commissions">("affiliates");
    const [profiles, setProfiles] = useState<AffiliateProfile[]>([]);
    const [commissions, setCommissions] = useState<CommissionItem[]>([]);
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedAffiliateId, setSelectedAffiliateId] = useState("");
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

            const data = await getAdminAffiliates(toQueryParams(params));
            const normalized = normalizeAffiliateResponse(data);

            setProfiles(normalized.profiles as AffiliateProfile[]);
            setOverview(normalized.overview as Overview | null);
            setTotalPages(normalized.totalPages);
        } catch (error) {
            console.error("LOAD_ADMIN_AFFILIATES_ERROR:", error);
            setProfiles([]);
            setOverview(null);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [search, rankFilter, page]);

    const fetchCommissions = useCallback(async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams();

            if (search) {
                params.set("search", search);
            }

            if (selectedAffiliateId) {
                params.set("affiliateId", selectedAffiliateId);
            }

            params.set("page", String(page));

            const data = await getAdminAffiliateCommissions(
                Object.fromEntries(params.entries())
            );

            const rawCommissions =
                (data as any).commissions ||
                (data as any).items ||
                [];

            const totalPagesValue =
                (data as any).pagination?.totalPages ||
                (data as any).totalPages ||
                Math.max(1, Math.ceil(rawCommissions.length / 20));

            setCommissions(rawCommissions);
            setTotalPages(totalPagesValue);
        } catch (error) {
            console.error("LOAD_ADMIN_AFFILIATE_COMMISSIONS_ERROR:", error);
            setCommissions([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [search, selectedAffiliateId, page]);

    useEffect(() => {
        if (view === "affiliates") {
            fetchAffiliates();
        } else {
            fetchCommissions();
        }
    }, [view, fetchAffiliates, fetchCommissions]);

    const handleEditAffiliate = (affiliateId: string) => {
        router.push(`/admin/affiliate/${affiliateId}`);
    };

    const handleDeleteAffiliate = async (affiliateId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đối tác này không?")) {
            return;
        }

        try {
            setLoading(true);

            await deleteAdminAffiliate(affiliateId);

            setProfiles((prev) => prev.filter((item) => item.id !== affiliateId));
        } catch (error) {
            console.error("DELETE_ADMIN_AFFILIATE_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Đã xảy ra lỗi khi thực hiện lệnh xóa."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        let dataToExport: any[] = [];
        let fileName = "";

        if (view === "commissions") {
            dataToExport = commissions.map((c: any) => ({
                "Mã HH": c.id,
                "Đối tác": c.affiliateName,
                "Hạng": RANK_LABELS[c.affiliateRank]?.label || c.affiliateRank || "",
                "Mã Đơn hàng": c.orderId,
                "Khách hàng": c.orderBuyer,
                "Loại": c.type === "ACHIEVEMENT" ? "Thưởng" : `F${c.level}`,
                "Giá trị ĐH": c.orderTotal,
                "Tỉ lệ": `${(Number(c.rate || 0) * 100).toFixed(1)}%`,
                "Hoa hồng": c.amount,
                "Trạng thái": STATUS_CONFIG[c.status]?.label || c.status || "",
                "Ngày": c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString("vi-VN")
                    : "",
            }));

            fileName = `Bao_cao_Hoa_hong_${new Date()
                .toLocaleDateString("vi-VN")
                .replace(/\//g, "-")}.xlsx`;
        } else {
            dataToExport = profiles.map((p: any) => ({
                "Mã ĐT": p.id,
                "Tên đối tác": p.user?.name || "N/A",
                "Email": p.user?.email || "N/A",
                "Mã giới thiệu": p.referralCode || "",
                "Hạng": RANK_LABELS[p.rank]?.label || p.rank || "",
                "PV cá nhân": p.personalPV || 0,
                "PV nhóm": p.teamPV || 0,
                "Tổng thu nhập": p.totalEarnings || 0,
                "Chờ duyệt":
                    p.commissionsSummary?.pending ||
                    p.stats?.pendingCommissions ||
                    p.stats?.pendingWithdrawals ||
                    0,
                "Trạng thái": p.status === "INACTIVE" ? "Bị khóa" : "Hoạt động",
            }));

            fileName = rankFilter
                ? `Danh_sach_Doi_tac_${rankFilter}_${new Date()
                      .toLocaleDateString("vi-VN")
                      .replace(/\//g, "-")}.xlsx`
                : `Danh_sach_Doi_tac_${new Date()
                      .toLocaleDateString("vi-VN")
                      .replace(/\//g, "-")}.xlsx`;
        }

        if (dataToExport.length === 0) {
            alert("Không có dữ liệu để xuất.");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        const colWidths = Object.keys(dataToExport[0] || {}).map(() => ({
            wch: 18,
        }));

        worksheet["!cols"] = colWidths;

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Dữ liệu");
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Quản lý Affiliate
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Duyệt hoa hồng, theo dõi mạng lưới đối tác.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Download className="h-4 w-4" />
                        Xuất dữ liệu
                    </button>

                    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setView("affiliates");
                                setPage(1);
                                setSearch("");
                                setRankFilter("");
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "affiliates"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Users className="h-4 w-4 inline mr-1.5" />
                            Đối tác
                        </button>

                        <button
                            onClick={() => {
                                setView("commissions");
                                setPage(1);
                                setSearch("");
                                setSelectedAffiliateId("");
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                view === "commissions"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <DollarSign className="h-4 w-4 inline mr-1.5" />
                            Hoa hồng
                        </button>
                    </div>
                </div>
            </div>

            {overview && view === "affiliates" && (
                <OverviewCards overview={overview} />
            )}

            {view === "affiliates" && (
                <>
                    <AffiliatesFilter
                        search={search}
                        onSearchChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        rankFilter={rankFilter}
                        onRankChange={(value) => {
                            setRankFilter(value);
                            setPage(1);
                        }}
                    />

                    <AffiliatesTable
                        profiles={profiles}
                        loading={loading}
                        onViewCommissions={(id) => {
                            setView("commissions");
                            setPage(1);
                            setSearch("");
                            setSelectedAffiliateId(id);
                        }}
                        onEdit={handleEditAffiliate}
                        onDelete={handleDeleteAffiliate}
                    />
                </>
            )}

            {view === "commissions" && (
                <div className="space-y-4">
                    {selectedAffiliateId && (
                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700">
                            Đang xem hoa hồng của đối tác:{" "}
                            <span className="font-semibold">{selectedAffiliateId}</span>
                        </div>
                    )}
                    <div className="flex justify-start mb-4">
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>

                            <input
                                type="text"
                                placeholder="Tìm theo đối tác, tên khách..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedAffiliateId("");
                                    setPage(1);
                                }}
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

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}