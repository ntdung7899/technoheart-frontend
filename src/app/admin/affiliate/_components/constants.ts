export interface AffiliateProfile {
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

export interface CommissionItem {
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

export interface Overview {
    totalAffiliates: number;
    totalCommissions: number;
    totalPending: number;
    totalApproved: number;
}

export const RANK_LABELS: Record<string, { label: string; color: string }> = {
    BA: { label: "BA", color: "bg-zinc-100 text-zinc-700" },
    VIP: { label: "VIP", color: "bg-blue-100 text-blue-700" },
    VVIP: { label: "VVIP", color: "bg-purple-100 text-purple-700" },
    L1: { label: "L1", color: "bg-emerald-100 text-emerald-700" },
    L2: { label: "L2", color: "bg-amber-100 text-amber-700" },
    L3: { label: "L3", color: "bg-red-100 text-red-700" },
    L4: { label: "L4", color: "bg-pink-100 text-pink-700" },
    L5: { label: "L5", color: "bg-indigo-100 text-indigo-700" },
};

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700" },
    APPROVED: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
    PAID: { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Đã huỷ", color: "bg-red-100 text-red-700" },
};

export function formatPrice(value: number) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}
