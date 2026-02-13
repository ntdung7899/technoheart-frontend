import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.id as string },
            include: {
                items: {
                    include: { product: { select: { name: true, images: true } } },
                },
                address: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
