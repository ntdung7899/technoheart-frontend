import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.id as string;

        const profile = await prisma.affiliateProfile.findUnique({
            where: { userId },
        });

        if (!profile) {
            return NextResponse.json({ error: "Not an affiliate" }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 20;

        const where: any = { affiliateId: profile.id };
        if (status && ["PENDING", "APPROVED", "PAID", "CANCELLED"].includes(status)) {
            where.status = status;
        }

        const [commissions, total] = await Promise.all([
            prisma.commission.findMany({
                where,
                include: {
                    order: {
                        select: {
                            id: true,
                            total: true,
                            createdAt: true,
                            user: { select: { name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.commission.count({ where }),
        ]);

        // Aggregate stats
        const [totalApproved, totalPending, totalPaid, totalCancelled] = await Promise.all([
            prisma.commission.aggregate({
                where: { affiliateId: profile.id, status: "APPROVED" },
                _sum: { amount: true },
            }),
            prisma.commission.aggregate({
                where: { affiliateId: profile.id, status: "PENDING" },
                _sum: { amount: true },
            }),
            prisma.commission.aggregate({
                where: { affiliateId: profile.id, status: "PAID" },
                _sum: { amount: true },
            }),
            prisma.commission.aggregate({
                where: { affiliateId: profile.id, status: "CANCELLED" },
                _sum: { amount: true },
            }),
        ]);

        return NextResponse.json({
            commissions: commissions.map((c) => ({
                ...c,
                amount: Number(c.amount),
                rate: Number(c.rate),
                order: {
                    ...c.order,
                    total: Number(c.order.total),
                },
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            summary: {
                totalApproved: Number(totalApproved._sum.amount || 0),
                totalPending: Number(totalPending._sum.amount || 0),
                totalPaid: Number(totalPaid._sum.amount || 0),
                totalCancelled: Number(totalCancelled._sum.amount || 0),
            },
        });
    } catch (error) {
        console.error("Affiliate commissions error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
