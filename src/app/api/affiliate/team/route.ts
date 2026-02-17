import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.id as string;

        // Get F1 (direct referrals)
        const f1Referrals = await prisma.referral.findMany({
            where: { referrerId: userId, level: 1 },
            include: {
                referee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        createdAt: true,
                        affiliate: {
                            select: {
                                rank: true,
                                personalPV: true,
                                teamPV: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Get F2 (indirect referrals)
        const f2Referrals = await prisma.referral.findMany({
            where: { referrerId: userId, level: 2 },
            include: {
                referee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        createdAt: true,
                        affiliate: {
                            select: {
                                rank: true,
                                personalPV: true,
                                teamPV: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            f1: f1Referrals.map((r) => ({
                id: r.id,
                user: r.referee,
                joinedAt: r.createdAt,
            })),
            f2: f2Referrals.map((r) => ({
                id: r.id,
                user: r.referee,
                joinedAt: r.createdAt,
            })),
        });
    } catch (error) {
        console.error("Affiliate team error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
