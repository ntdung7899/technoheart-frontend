import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Missing order code" }, { status: 400 });
    }

    try {
        const order = await prisma.order.findFirst({
            where: { transactionId: code },
            select: { paymentStatus: true, id: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            paymentStatus: order.paymentStatus,
            orderId: order.id 
        });

    } catch (error) {
        console.error("Check status error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}