import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
    getCommissionRates, getBaseRankFromPV, getFullRank,
    orderTotalToPV, getAchievementBonus, SAME_RANK_RATE
} from "@/lib/affiliate-utils";

// Called when an order's status is changed to DELIVERED
// This triggers commission calculation and PV updates
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ error: "Order ID required" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });

        if (!order || order.status !== "DELIVERED") {
            return NextResponse.json({ error: "Order not found or not delivered" }, { status: 400 });
        }

        // Check if commissions already calculated for this order
        const existingCommissions = await prisma.commission.count({
            where: { orderId },
        });
        if (existingCommissions > 0) {
            return NextResponse.json({ message: "Commissions already calculated" });
        }

        const orderTotal = Number(order.total);
        const orderPV = orderTotalToPV(orderTotal);
        const buyerUserId = order.userId;

        // Update buyer's PV if they are an affiliate
        const buyerProfile = await prisma.affiliateProfile.findUnique({
            where: { userId: buyerUserId },
        });
        if (buyerProfile) {
            const newPersonalPV = buyerProfile.personalPV + orderPV;
            const newRank = getFullRank(newPersonalPV, buyerProfile.teamPV);

            await prisma.affiliateProfile.update({
                where: { id: buyerProfile.id },
                data: {
                    personalPV: newPersonalPV,
                    rank: newRank,
                },
            });
        }

        // Find referrer chain: who referred the buyer?
        const f1Referral = await prisma.referral.findFirst({
            where: { refereeId: buyerUserId, level: 1 },
        });

        const commissionsToCreate: any[] = [];

        if (f1Referral) {
            // F1 commission
            const f1Profile = await prisma.affiliateProfile.findUnique({
                where: { userId: f1Referral.referrerId },
            });

            if (f1Profile) {
                const rates = getCommissionRates(f1Profile.rank);
                if (rates.f1Rate > 0) {
                    const f1Amount = orderTotal * rates.f1Rate;
                    commissionsToCreate.push({
                        affiliateId: f1Profile.id,
                        orderId,
                        amount: f1Amount,
                        rate: rates.f1Rate,
                        level: 1,
                        type: "REFERRAL",
                        status: "APPROVED",
                    });

                    // Update F1 earnings & team PV
                    const newTeamPV = f1Profile.teamPV + orderPV;
                    const newRank = getFullRank(f1Profile.personalPV, newTeamPV);
                    await prisma.affiliateProfile.update({
                        where: { id: f1Profile.id },
                        data: {
                            totalEarnings: { increment: f1Amount },
                            teamPV: { increment: orderPV },
                            rank: newRank,
                        },
                    });

                    // Module 2-3: Thưởng thành tích (% doanh thu nhóm)
                    const achievementBonus = getAchievementBonus(newRank);
                    if (achievementBonus) {
                        const achievementAmount = orderTotal * achievementBonus.rate;
                        commissionsToCreate.push({
                            affiliateId: f1Profile.id,
                            orderId,
                            amount: achievementAmount,
                            rate: achievementBonus.rate,
                            level: 1,
                            type: "ACHIEVEMENT",
                            status: "APPROVED",
                        });

                        await prisma.affiliateProfile.update({
                            where: { id: f1Profile.id },
                            data: {
                                totalEarnings: { increment: achievementAmount },
                            },
                        });
                    }
                }

                // F2 commission (referrer of the referrer)
                const f2Referral = await prisma.referral.findFirst({
                    where: { refereeId: f1Referral.referrerId, level: 1 },
                });

                if (f2Referral) {
                    const f2Profile = await prisma.affiliateProfile.findUnique({
                        where: { userId: f2Referral.referrerId },
                    });

                    if (f2Profile) {
                        const f2Rates = getCommissionRates(f2Profile.rank);
                        if (f2Rates.f2Rate > 0) {
                            const f2Amount = orderTotal * f2Rates.f2Rate;
                            commissionsToCreate.push({
                                affiliateId: f2Profile.id,
                                orderId,
                                amount: f2Amount,
                                rate: f2Rates.f2Rate,
                                level: 2,
                                type: "REFERRAL",
                                status: "APPROVED",
                            });

                            // Update F2 earnings & team PV
                            const newTeamPV = f2Profile.teamPV + orderPV;
                            const newRank = getFullRank(f2Profile.personalPV, newTeamPV);
                            await prisma.affiliateProfile.update({
                                where: { id: f2Profile.id },
                                data: {
                                    totalEarnings: { increment: f2Amount },
                                    teamPV: { increment: orderPV },
                                    rank: newRank,
                                },
                            });

                            // Module 2-3: Thưởng thành tích for F2
                            const f2AchievementBonus = getAchievementBonus(newRank);
                            if (f2AchievementBonus) {
                                const achievementAmount = orderTotal * f2AchievementBonus.rate;
                                commissionsToCreate.push({
                                    affiliateId: f2Profile.id,
                                    orderId,
                                    amount: achievementAmount,
                                    rate: f2AchievementBonus.rate,
                                    level: 2,
                                    type: "ACHIEVEMENT",
                                    status: "APPROVED",
                                });

                                await prisma.affiliateProfile.update({
                                    where: { id: f2Profile.id },
                                    data: {
                                        totalEarnings: { increment: achievementAmount },
                                    },
                                });
                            }

                            // Thu nhập đồng cấp: nếu F1 và F2 cùng cấp, F2 nhận 20% thu nhập F1
                            if (f1Profile && f1Profile.rank === f2Profile.rank) {
                                const f1EarningsThisOrder = commissionsToCreate
                                    .filter(c => c.affiliateId === f1Profile.id)
                                    .reduce((sum, c) => sum + c.amount, 0);
                                const sameRankAmount = f1EarningsThisOrder * SAME_RANK_RATE;
                                if (sameRankAmount > 0) {
                                    commissionsToCreate.push({
                                        affiliateId: f2Profile.id,
                                        orderId,
                                        amount: sameRankAmount,
                                        rate: SAME_RANK_RATE,
                                        level: 2,
                                        type: "REFERRAL",
                                        status: "APPROVED",
                                    });

                                    await prisma.affiliateProfile.update({
                                        where: { id: f2Profile.id },
                                        data: {
                                            totalEarnings: { increment: sameRankAmount },
                                        },
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Create all commissions
        if (commissionsToCreate.length > 0) {
            await prisma.commission.createMany({
                data: commissionsToCreate,
            });
        }

        return NextResponse.json({
            success: true,
            commissionsCreated: commissionsToCreate.length,
        });
    } catch (error) {
        console.error("Commission calculation error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
