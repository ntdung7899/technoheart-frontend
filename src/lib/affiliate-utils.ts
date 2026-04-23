import { AffiliateRank } from "@prisma/client";
import prisma from "@/lib/prisma";

// ========== QUY ĐỔI PV ==========
// 1 PV = 26.000 VNĐ (có thể thay đổi)
export const PV_RATE = 26000;

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
    BA: 100,       // ≥ 100 PV cá nhân
    VIP: 500,      // ≥ 500 PV cá nhân
    VVIP: 1000,    // ≥ 1.000 PV cá nhân
};

const REFERRAL_COMMISSION_RATES: Record<string, CommissionRates> = {
    BA: { f1Rate: 0.05, f2Rate: 0 },        // 5% F1
    VIP: { f1Rate: 0.08, f2Rate: 0.03 },    // 8% F1, 3% F2
    VVIP: { f1Rate: 0.10, f2Rate: 0.035 },  // 10% F1, 3.5% F2
};

// ========== MODULE 2-3: Thưởng thành tích & Cấp cao ==========

const ACHIEVEMENT_BONUSES: Record<string, AchievementBonus> = {
    L1: { rate: 0.03, label: "Đại diện kinh doanh" },
    L2: { rate: 0.05, label: "Giám đốc khu vực" },
    L3: { rate: 0.07, label: "Giám đốc vùng" },
    L4: { rate: 0.08, label: "Đại sứ thương hiệu quốc gia" },
    L5: { rate: 0.09, label: "Đại sứ thương hiệu toàn cầu" },
};

// Điều kiện thăng hạng L1-L5: cần rank cơ sở + PV nhóm tối thiểu
const RANK_REQUIREMENTS: Record<string, { 
    baseRank: "VIP" | "VVIP"; 
    minTeamPV: number;
    requiredLegRank?: AffiliateRank; 
    requiredLegCount?: number;
}> = {
    L1: { baseRank: "VIP", minTeamPV: 20000 }, 
    L2: { baseRank: "VVIP", minTeamPV: 60000, requiredLegRank: "L1", requiredLegCount: 2 },
    L3: { baseRank: "VVIP", minTeamPV: 170000, requiredLegRank: "L2", requiredLegCount: 3 },
    L4: { baseRank: "VVIP", minTeamPV: 600000, requiredLegRank: "L3", requiredLegCount: 3 },
    L5: { baseRank: "VVIP", minTeamPV: 2000000, requiredLegRank: "L4", requiredLegCount: 3 },
};

// Thu nhập đồng cấp: 20% thu nhập F1 cùng cấp
export const SAME_RANK_RATE = 0.20;

// ========== RANK INFO ==========

export const RANK_INFO: Record<string, {
    label: string;
    minPersonalPV: number;
    minTeamPV: number;
    baseRank: string | null;
    description: string;
    color: string;
}> = {
    BA: { label: "BA", minPersonalPV: 100, minTeamPV: 0, baseRank: null, description: "Brand Ambassador", color: "#64748b" },
    VIP: { label: "VIP", minPersonalPV: 500, minTeamPV: 0, baseRank: null, description: "VIP Partner", color: "#3b82f6" },
    VVIP: { label: "VVIP", minPersonalPV: 1000, minTeamPV: 0, baseRank: null, description: "VVIP Partner", color: "#8b5cf6" },
    L1: { label: "L1", minPersonalPV: 500, minTeamPV: 20000, baseRank: "VIP", description: "Đại diện kinh doanh", color: "#10b981" },
    L2: { label: "L2", minPersonalPV: 1000, minTeamPV: 60000, baseRank: "VVIP", description: "Giám đốc khu vực", color: "#f59e0b" },    L3: { label: "L3", minPersonalPV: 1000, minTeamPV: 170000, baseRank: "VVIP", description: "Giám đốc vùng", color: "#ef4444" },
    L4: { label: "L4", minPersonalPV: 1000, minTeamPV: 600000, baseRank: "VVIP", description: "Đại sứ TH quốc gia", color: "#ec4899" },
    L5: { label: "L5", minPersonalPV: 1000, minTeamPV: 2000000, baseRank: "VVIP", description: "Đại sứ TH toàn cầu", color: "#6366f1" },
};

/**
 * Determine the base rank from personal PV (Module 1 only: BA/VIP/VVIP)
 */
export function getBaseRankFromPV(personalPV: number): "BA" | "VIP" | "VVIP" {
    if (personalPV >= RANK_PV_THRESHOLDS.VVIP) return "VVIP";
    if (personalPV >= RANK_PV_THRESHOLDS.VIP) return "VIP";
    return "BA";
}

/**
 * Determine full rank including L1-L5 (Module 2-3)
 * Checks base rank requirement + team PV threshold
 */
export async function getFullRank(
    userId: string, 
    personalPV: number, 
    teamPV: number
): Promise<AffiliateRank> {
    const baseRank = getBaseRankFromPV(personalPV);
    const baseRankOrder = { BA: 0, VIP: 1, VVIP: 2 };

    const levels: AffiliateRank[] = ["L5", "L4", "L3", "L2", "L1"];

    for (const level of levels) {
        const req = RANK_REQUIREMENTS[level];
        
        // 1. Kiểm tra PV Cá nhân và PV Nhóm
        const meetsPVRequirements = 
            baseRankOrder[baseRank] >= baseRankOrder[req.baseRank] &&
            teamPV >= req.minTeamPV;

        if (meetsPVRequirements) {
            // 2. Nếu cấp này có yêu cầu nhánh, tiến hành đếm F1
            if (req.requiredLegRank && req.requiredLegCount) {
                const f1Referrals = await prisma.referral.findMany({
                    where: {
                        referrerId: userId,
                        level: 1, 
                    },
                    select: {
                        refereeId: true,
                    },
                });

                // Trích xuất mảng các refereeId (ID của F1)
                const f1UserIds = f1Referrals.map(r => r.refereeId);

                // Bước 2: Đếm xem trong số các F1 đó, có bao nhiêu người đạt cấp bậc yêu cầu
                let qualifiedLegsCount = 0;
                
                if (f1UserIds.length > 0) {
                    qualifiedLegsCount = await prisma.affiliateProfile.count({
                        where: {
                            userId: { in: f1UserIds },
                            rank: {
                                in: getHigherOrEqualRanks(req.requiredLegRank) 
                            }
                        }
                    });
                }
                if (qualifiedLegsCount >= req.requiredLegCount) {
                    return level; // Đủ PV + Đủ nhánh -> Thăng cấp
                }
                // Nếu đủ PV nhưng KHÔNG đủ nhánh, vòng lặp sẽ tiếp tục xét cấp thấp hơn (L thấp hơn)
            } else {
                return level; // Nếu cấp này (như L1) không yêu cầu nhánh -> Thăng cấp luôn
            }
        }
    }

    return baseRank; // Nếu rớt hết các cấp L, trả về cấp cơ sở (BA/VIP/VVIP)
}
function getHigherOrEqualRanks(minRank: AffiliateRank): AffiliateRank[] {
    const hierarchy = ["BA", "VIP", "VVIP", "L1", "L2", "L3", "L4", "L5"];
    const startIndex = hierarchy.indexOf(minRank);
    if (startIndex === -1) return [];
    return hierarchy.slice(startIndex) as AffiliateRank[];
}

/**
 * Get commission rates for referral commissions based on rank
 */
export function getCommissionRates(personalPV: number): CommissionRates {
    const baseRank = getBaseRankFromPV(personalPV); // Tự quét xem PV này là BA, VIP hay VVIP
    return REFERRAL_COMMISSION_RATES[baseRank] || REFERRAL_COMMISSION_RATES.BA;
}

/**
 * Get achievement bonus rate (Module 2-3: % doanh thu nhóm)
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
 * 1 PV = PV_RATE VNĐ (mặc định 26.000)
 */
export function orderTotalToPV(totalVND: number, pvRate: number = PV_RATE): number {
    return Math.floor(totalVND / pvRate);
}

/**
 * Convert PV to VNĐ
 */
export function pvToVND(pv: number, pvRate: number = PV_RATE): number {
    return pv * pvRate;
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
 * Calculate and create commissions for a delivered order.
 * Called automatically when order status changes to DELIVERED.
 */
export async function calculateCommissions(orderId: string): Promise<number> {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
    });

    if (!order || order.status !== "DELIVERED") return 0;

    // Skip if already calculated
    const existing = await prisma.commission.count({ where: { orderId } });
    if (existing > 0) return 0;

    const orderTotal = Number(order.total);
    const orderPV = orderTotalToPV(orderTotal);
    const buyerUserId = order.userId;

    // Update buyer's PV if they are an affiliate
    const buyerProfile = await prisma.affiliateProfile.findUnique({
        where: { userId: buyerUserId },
    });
    if (buyerProfile) {
        const newPersonalPV = buyerProfile.personalPV + orderPV;
        const newRank = await getFullRank(buyerProfile.userId, newPersonalPV, buyerProfile.teamPV); // ĐÃ SỬA
        await prisma.affiliateProfile.update({
            where: { id: buyerProfile.id },
            data: { personalPV: newPersonalPV, rank: newRank },
        });
    }

    // Find referrer chain
    const f1Referral = await prisma.referral.findFirst({
        where: { refereeId: buyerUserId, level: 1 },
    });

    const commissionsToCreate: any[] = [];

    if (f1Referral) {
        const f1Profile = await prisma.affiliateProfile.findUnique({
            where: { userId: f1Referral.referrerId },
        });

        if (f1Profile) {
            const rates = getCommissionRates(f1Profile.personalPV);
            if (rates.f1Rate > 0) {
                const f1Amount = orderTotal * rates.f1Rate;
                commissionsToCreate.push({
                    affiliateId: f1Profile.id, orderId, amount: f1Amount,
                    rate: rates.f1Rate, level: 1, type: "REFERRAL", status: "APPROVED",
                });

                const newTeamPV = f1Profile.teamPV + orderPV;
                const newRank = await getFullRank(f1Profile.userId, f1Profile.personalPV, newTeamPV);
                await prisma.affiliateProfile.update({
                    where: { id: f1Profile.id },
                    data: {
                        totalEarnings: { increment: f1Amount },
                        teamPV: { increment: orderPV },
                        rank: newRank,
                    },
                });

                const achievementBonus = getAchievementBonus(newRank);
                if (achievementBonus) {
                    const achievementAmount = orderTotal * achievementBonus.rate;
                    commissionsToCreate.push({
                        affiliateId: f1Profile.id, orderId, amount: achievementAmount,
                        rate: achievementBonus.rate, level: 1, type: "ACHIEVEMENT", status: "APPROVED",
                    });
                    await prisma.affiliateProfile.update({
                        where: { id: f1Profile.id },
                        data: { totalEarnings: { increment: achievementAmount } },
                    });
                }
            }

            // F2 commission
            const f2Referral = await prisma.referral.findFirst({
                where: { refereeId: f1Referral.referrerId, level: 1 },
            });

            if (f2Referral) {
                const f2Profile = await prisma.affiliateProfile.findUnique({
                    where: { userId: f2Referral.referrerId },
                });

                if (f2Profile) {
                    const f2Rates = getCommissionRates(f2Profile.personalPV);
                    if (f2Rates.f2Rate > 0) {
                        const f2Amount = orderTotal * f2Rates.f2Rate;
                        commissionsToCreate.push({
                            affiliateId: f2Profile.id, orderId, amount: f2Amount,
                            rate: f2Rates.f2Rate, level: 2, type: "REFERRAL", status: "APPROVED",
                        });

                        const newTeamPV = f2Profile.teamPV + orderPV;
                        const newRank = await getFullRank(f2Profile.userId, f2Profile.personalPV, newTeamPV); // ĐÃ SỬA
                        await prisma.affiliateProfile.update({
                            where: { id: f2Profile.id },
                            data: {
                                totalEarnings: { increment: f2Amount },
                                teamPV: { increment: orderPV },
                                rank: newRank,
                            },
                        });

                        const f2AchievementBonus = getAchievementBonus(newRank);
                        if (f2AchievementBonus) {
                            const achievementAmount = orderTotal * f2AchievementBonus.rate;
                            commissionsToCreate.push({
                                affiliateId: f2Profile.id, orderId, amount: achievementAmount,
                                rate: f2AchievementBonus.rate, level: 2, type: "ACHIEVEMENT", status: "APPROVED",
                            });
                            await prisma.affiliateProfile.update({
                                where: { id: f2Profile.id },
                                data: { totalEarnings: { increment: achievementAmount } },
                            });
                        }

                        // Thu nhập đồng cấp
                        if (f1Profile && f1Profile.rank === f2Profile.rank) {
                            const f1EarningsThisOrder = commissionsToCreate
                                .filter(c => c.affiliateId === f1Profile.id)
                                .reduce((sum: number, c: any) => sum + c.amount, 0);
                            const sameRankAmount = f1EarningsThisOrder * SAME_RANK_RATE;
                            if (sameRankAmount > 0) {
                                commissionsToCreate.push({
                                    affiliateId: f2Profile.id, orderId, amount: sameRankAmount,
                                    rate: SAME_RANK_RATE, level: 2, type: "REFERRAL", status: "APPROVED",
                                });
                                await prisma.affiliateProfile.update({
                                    where: { id: f2Profile.id },
                                    data: { totalEarnings: { increment: sameRankAmount } },
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    if (commissionsToCreate.length > 0) {
        await prisma.commission.createMany({ data: commissionsToCreate });
    }

    return commissionsToCreate.length;
}

/**
 * Calculate progression to next rank
 * BA→VIP→VVIP: based on personal PV
 * VVIP→L1→...→L5: based on team PV
 */
export function getPVForNextRank(currentRank: AffiliateRank, personalPV: number, teamPV: number = 0): {
    nextRank: AffiliateRank | null;
    pvNeeded: number;
    progress: number;
    pvType: "personal" | "team";
} {
    const next = getNextRank(currentRank);
    if (!next) return { nextRank: null, pvNeeded: 0, progress: 100, pvType: "personal" };

    const info = RANK_INFO[next];
    if (!info) return { nextRank: next, pvNeeded: 0, progress: 0, pvType: "personal" };

    // For L1-L5, progression is based on team PV
    if (info.minTeamPV > 0) {
        const pvNeeded = Math.max(0, info.minTeamPV - teamPV);
        const progress = info.minTeamPV > 0
            ? Math.min(100, Math.floor((teamPV / info.minTeamPV) * 100))
            : 0;
        return { nextRank: next, pvNeeded, progress, pvType: "team" };
    }

    // For BA→VIP→VVIP, progression is based on personal PV
    const pvNeeded = Math.max(0, info.minPersonalPV - personalPV);
    const progress = Math.min(100, Math.floor((personalPV / info.minPersonalPV) * 100));
    return { nextRank: next, pvNeeded, progress, pvType: "personal" };
}

/**
 * Format PV for display
 */
export function formatPV(pv: number): string {
    return pv.toLocaleString("vi-VN");
}
