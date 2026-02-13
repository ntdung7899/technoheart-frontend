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

        const [user, vouchers, userVouchers] = await Promise.all([
            prisma.user.findUnique({
                where: { id: userId },
                select: { points: true },
            }),
            prisma.voucher.findMany({
                where: { expiresAt: { gt: new Date() } },
                orderBy: { pointsCost: "asc" },
            }),
            prisma.userVoucher.findMany({
                where: { userId },
                include: { voucher: true },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            points: user?.points || 0,
            availableVouchers: vouchers,
            userVouchers,
        });
    } catch (error) {
        console.error("Get rewards error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
