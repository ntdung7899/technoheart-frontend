import { AffiliateRank } from "@prisma/client";

// PV = VNĐ (1 PV = 1 VNĐ)

// ========== MODULE 1: Hoa hồng giới thiệu ==========

interface CommissionRates {
    f1Rate: number;
    f2Rate: number;
}

interface AchievementBonus {
    rate: number;
    label: string;
}

const RANK_PV_THRESHOLDS: Record<string, number> = {
    BA: 100,       // 100 PV = 100.000 VNĐ
    VIP: 500,      // 500 PV = 500.000 VNĐ
    VVIP: 1000,    // 1000 PV = 1.000.000 VNĐ
};

const REFERRAL_COMMISSION_RATES: Record<string, CommissionRates> = {
    BA: { f1Rate: 0.05, f2Rate: 0 },      // 5% F1
    VIP: { f1Rate: 0.08, f2Rate: 0.03 },    // 8% F1, 3% F2
    VVIP: { f1Rate: 0.10, f2Rate: 0.035 },   // 10% F1, 3.5% F2
    L1: { f1Rate: 0.10, f2Rate: 0.035 },
    L2: { f1Rate: 0.10, f2Rate: 0.035 },
    L3: { f1Rate: 0.10, f2Rate: 0.035 },
    L4: { f1Rate: 0.10, f2Rate: 0.035 },
    L5: { f1Rate: 0.10, f2Rate: 0.035 },
};

// ========== MODULE 2: Thưởng thành tích ==========

const ACHIEVEMENT_BONUSES: Record<string, AchievementBonus> = {
    L1: { rate: 0.03, label: "Đại diện kinh doanh" },
    L2: { rate: 0.05, label: "Giám đốc khu vực" },
    L3: { rate: 0.07, label: "Giám đốc vùng" },
    L4: { rate: 0.08, label: "Đại sứ thương hiệu quốc gia" },
    L5: { rate: 0.09, label: "Đại sứ thương hiệu toàn cầu" },
};

// ========== RANK INFO ==========

export const RANK_INFO: Record<string, {
    label: string;
    minPersonalPV: number;
    description: string;
    color: string;
}> = {
    BA: { label: "BA", minPersonalPV: 100, description: "Brand Ambassador", color: "#64748b" },
    VIP: { label: "VIP", minPersonalPV: 500, description: "VIP Partner", color: "#3b82f6" },
    VVIP: { label: "VVIP", minPersonalPV: 1000, description: "VVIP Partner", color: "#8b5cf6" },
    L1: { label: "L1", minPersonalPV: 500, description: "Đại diện kinh doanh", color: "#10b981" },
    L2: { label: "L2", minPersonalPV: 500, description: "Giám đốc khu vực", color: "#f59e0b" },
    L3: { label: "L3", minPersonalPV: 1000, description: "Giám đốc vùng", color: "#ef4444" },
    L4: { label: "L4", minPersonalPV: 1000, description: "Đại sứ TH quốc gia", color: "#ec4899" },
    L5: { label: "L5", minPersonalPV: 1000, description: "Đại sứ TH toàn cầu", color: "#6366f1" },
};

/**
 * Determine the base rank from personal PV (Module 1 only)
 */
export function getBaseRankFromPV(personalPV: number): "BA" | "VIP" | "VVIP" {
    if (personalPV >= RANK_PV_THRESHOLDS.VVIP) return "VVIP";
    if (personalPV >= RANK_PV_THRESHOLDS.VIP) return "VIP";
    return "BA";
}

/**
 * Get commission rates for referral commissions based on rank
 */
export function getCommissionRates(rank: string): CommissionRates {
    return REFERRAL_COMMISSION_RATES[rank] || REFERRAL_COMMISSION_RATES.BA;
}

/**
 * Get achievement bonus rate
 */
export function getAchievementBonus(rank: string): AchievementBonus | null {
    return ACHIEVEMENT_BONUSES[rank] || null;
}

/**
 * Generate a unique referral code
 */
export function generateReferralCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "TH-";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Convert order total (VNĐ) to PV
 * PV = VNĐ (1:1 ratio, but stored as integer)
 */
export function orderTotalToPV(totalVND: number): number {
    return Math.floor(totalVND);
}

/**
 * Get the next rank for progression display
 */
export function getNextRank(currentRank: AffiliateRank): AffiliateRank | null {
    const progression: AffiliateRank[] = ["BA", "VIP", "VVIP", "L1", "L2", "L3", "L4", "L5"];
    const idx = progression.indexOf(currentRank);
    if (idx === -1 || idx === progression.length - 1) return null;
    return progression[idx + 1];
}

/**
 * Calculate the PV needed for next rank
 */
export function getPVForNextRank(currentRank: AffiliateRank, personalPV: number): {
    nextRank: AffiliateRank | null;
    pvNeeded: number;
    progress: number;
} {
    const next = getNextRank(currentRank);
    if (!next) return { nextRank: null, pvNeeded: 0, progress: 100 };

    const info = RANK_INFO[next];
    if (!info) return { nextRank: next, pvNeeded: 0, progress: 0 };

    const pvNeeded = Math.max(0, info.minPersonalPV - personalPV);
    const progress = Math.min(100, Math.floor((personalPV / info.minPersonalPV) * 100));

    return { nextRank: next, pvNeeded, progress };
}

/**
 * Format PV for display
 */
export function formatPV(pv: number): string {
    return pv.toLocaleString("vi-VN");
}
