
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";
import { calculateCommissions } from "@/lib/affiliate-utils";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession() as any;

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        // Trigger commission calculation when order is delivered
        if (status === "DELIVERED") {
            try {
                await calculateCommissions(id);
            } catch (err) {
                console.error("Commission calculation failed for order", id, err);
            }
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order update failed:", error);
        return NextResponse.json({ error: "Order update failed" }, { status: 500 });
    }
}
