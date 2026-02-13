import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: { id, userId: session.id as string },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, images: true, price: true },
                        },
                    },
                },
                address: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Get order detail error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
