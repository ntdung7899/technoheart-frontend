import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay, parseISO, isValid } from "date-fns";

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
        const memberId = searchParams.get("memberId");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 20;


        const baseWhere: any = { affiliateId: profile.id };
        
        if (memberId) {
            baseWhere.order = { userId: memberId };
        }

        if (startDate || endDate) {
            const dateFilter: any = {}; 
            if (startDate) {
                const parsedStart = parseISO(startDate);
                if (isValid(parsedStart)) { 
                    dateFilter.gte = startOfDay(parsedStart);
                }
            }
            if (endDate) {
                const parsedEnd = parseISO(endDate);
                if (isValid(parsedEnd)) {
                    dateFilter.lte = endOfDay(parsedEnd);
                }
            }
            if (Object.keys(dateFilter).length > 0) {
                baseWhere.createdAt = dateFilter;
            }
        }

        const listWhere = { ...baseWhere };
        if (status && ["PENDING", "APPROVED", "PAID", "CANCELLED"].includes(status)) {
            listWhere.status = status;
        }

        const [commissions, total, summaryGroup] = await Promise.all([
  
            prisma.commission.findMany({
                where: listWhere,
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

            prisma.commission.count({ where: listWhere }),

            prisma.commission.groupBy({
                by: ['status'],
                where: baseWhere,
                _sum: { amount: true },
            })
        ]);

        const summary = {
            totalApproved: 0,
            totalPending: 0,
            totalPaid: 0,
            totalCancelled: 0,
        };

        summaryGroup.forEach((group) => {
            const amount = Number(group._sum.amount || 0);
            if (group.status === "APPROVED") summary.totalApproved = amount;
            if (group.status === "PENDING") summary.totalPending = amount;
            if (group.status === "PAID") summary.totalPaid = amount;
            if (group.status === "CANCELLED") summary.totalCancelled = amount;
        });

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
            summary,
        });
    } catch (error) {
        console.error("Affiliate commissions error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}