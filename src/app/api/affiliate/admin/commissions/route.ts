import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: List commissions for a specific affiliate (admin view)
// PATCH: Update commission status (approve, pay, cancel)
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
        const affiliateId = searchParams.get("affiliateId") || "";
        const status = searchParams.get("status") || "";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = 20;

        const where: any = {};
        if (affiliateId) where.affiliateId = affiliateId;
        if (status && ["PENDING", "APPROVED", "PAID", "CANCELLED"].includes(status)) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { order: { user: { name: { contains: search, mode: "insensitive" } } } },
                { affiliate: { user: { name: { contains: search, mode: "insensitive" } } } }, 
            ];
        }

        const [commissions, total] = await Promise.all([
            prisma.commission.findMany({
                where,
                include: {
                    affiliate: {
                        include: {
                            user: { select: { name: true, email: true } },
                        },
                    },
                    order: {
                        select: { id: true, total: true, createdAt: true, user: { select: { name: true } } },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.commission.count({ where }),
        ]);

        return NextResponse.json({
            commissions: commissions.map((c) => ({
                id: c.id,
                affiliateId: c.affiliateId,
                affiliateName: c.affiliate.user.name || c.affiliate.user.email,
                affiliateRank: c.affiliate.rank,
                orderId: c.orderId,
                orderTotal: Number(c.order.total),
                orderBuyer: c.order.user.name || "N/A",
                amount: Number(c.amount),
                rate: Number(c.rate),
                level: c.level,
                type: c.type,
                status: c.status,
                createdAt: c.createdAt,
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Admin commissions error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PATCH: Update commission status
export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: session.id as string } });
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { commissionIds, status } = await req.json();

        if (!commissionIds?.length || !["PENDING", "APPROVED", "PAID", "CANCELLED"].includes(status)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const updated = await prisma.commission.updateMany({
            where: { id: { in: commissionIds } },
            data: { status },
        });

        if (status === "PAID") {
            const commissions = await prisma.commission.findMany({
                where: { id: { in: commissionIds } },
            });
            const payouts = new Map<string, number>();
            for (const c of commissions) {
                payouts.set(c.affiliateId, (payouts.get(c.affiliateId) || 0) + Number(c.amount));
            }
            for (const [affiliateId, amount] of payouts) {
                await prisma.affiliateProfile.update({
                    where: { id: affiliateId },
                    data: { paidEarnings: { increment: amount } },
                });
            }
        }

        if (status === "CANCELLED") {
            const commissions = await prisma.commission.findMany({
                where: { id: { in: commissionIds } },
            });
            for (const c of commissions) {
                await prisma.affiliateProfile.update({
                    where: { id: c.affiliateId },
                    data: { totalEarnings: { decrement: Number(c.amount) } },
                });
            }
        }

        return NextResponse.json({ success: true, count: updated.count });
    } catch (error) {
        console.error("Admin commission update error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
