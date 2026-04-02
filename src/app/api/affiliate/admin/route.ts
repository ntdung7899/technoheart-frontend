import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: List all affiliate profiles with user info and commission summary
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.id as string } });
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const rank = searchParams.get("rank") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 20;

        const where: any = {};
        if (search) {
            where.user = {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                ],
            };
        }
        if (rank) {
            where.rank = rank;
        }

        const [profiles, total] = await Promise.all([
            prisma.affiliateProfile.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
                    _count: { select: { commissions: true } },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.affiliateProfile.count({ where }),
        ]);

        // Get commission summaries for each profile
        const profileIds = profiles.map((p) => p.id);
        const commissionSummaries = await prisma.commission.groupBy({
            by: ["affiliateId", "status"],
            where: { affiliateId: { in: profileIds } },
            _sum: { amount: true },
        });

        const summaryMap: Record<string, Record<string, number>> = {};
        for (const row of commissionSummaries) {
            if (!summaryMap[row.affiliateId]) {
                summaryMap[row.affiliateId] = {};
            }
            summaryMap[row.affiliateId][row.status] = Number(row._sum.amount || 0);
        }

        const data = profiles.map((p) => ({
            id: p.id,
            userId: p.userId,
            referralCode: p.referralCode,
            rank: p.rank,
            personalPV: p.personalPV,
            teamPV: p.teamPV,
            totalEarnings: Number(p.totalEarnings),
            createdAt: p.createdAt,
            user: p.user,
            commissionCount: p._count.commissions,
            commissionSummary: {
                pending: summaryMap[p.id]?.PENDING || 0,
                approved: summaryMap[p.id]?.APPROVED || 0,
                paid: summaryMap[p.id]?.PAID || 0,
                cancelled: summaryMap[p.id]?.CANCELLED || 0,
            },
        }));

        // Overall stats
        const [totalAffiliates, totalCommissions, totalPending, totalApproved] = await Promise.all([
            prisma.affiliateProfile.count(),
            prisma.commission.aggregate({ _sum: { amount: true } }),
            prisma.commission.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
            prisma.commission.aggregate({ where: { status: "APPROVED" }, _sum: { amount: true } }),
        ]);

        return NextResponse.json({
            profiles: data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            overview: {
                totalAffiliates,
                totalCommissions: Number(totalCommissions._sum.amount || 0),
                totalPending: Number(totalPending._sum.amount || 0),
                totalApproved: Number(totalApproved._sum.amount || 0),
            },
        });
    } catch (error) {
        console.error("Admin affiliate error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
