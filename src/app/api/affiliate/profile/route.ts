import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCommissionRates, getAchievementBonus, getPVForNextRank, RANK_INFO } from "@/lib/affiliate-utils";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.id as string;

        const profile = await prisma.affiliateProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { name: true, email: true, avatar: true } },
                withdrawals: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { bankName: true, accountNumber: true, accountName: true }
                }
            },
        });

        if (!profile) {
            return NextResponse.json({ registered: false });
        }

        // Get referral counts
        const [f1Count, f2Count] = await Promise.all([
            prisma.referral.count({ where: { referrerId: userId, level: 1 } }),
            prisma.referral.count({ where: { referrerId: userId, level: 2 } }),
        ]);

        // Pending commissions
        const pendingCommissions = await prisma.commission.aggregate({
            where: { affiliateId: profile.id, status: "PENDING" },
            _sum: { amount: true },
        });

        const rates = getCommissionRates(profile.rank);
        const achievement = getAchievementBonus(profile.rank);
        const progression = getPVForNextRank(profile.rank, profile.personalPV, profile.teamPV);
        const rankInfo = RANK_INFO[profile.rank];

        return NextResponse.json({
            registered: true,
            profile: {
                ...profile,
                totalEarnings: Number(profile.totalEarnings),
                paidEarnings: Number(profile.paidEarnings),
                availableBalance: Number(profile.totalEarnings) - Number(profile.paidEarnings),
                lastWithdrawal: profile.withdrawals?.[0] || null,
            },
            stats: {
                f1Count,
                f2Count,
                pendingEarnings: Number(pendingCommissions._sum.amount || 0),
                rates,
                achievement,
                progression,
                rankInfo,
            },
        });
    } catch (error) {
        console.error("Affiliate profile error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
