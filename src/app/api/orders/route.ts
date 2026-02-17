
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, address, total, referralCode } = body;

        // Validate body (basic)
        if (!items || items.length === 0 || !address) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        // Get logged-in user from session
        const session = await getSession();
        let connectedUser;

        if (session?.id) {
            connectedUser = { connect: { id: session.id as string } };
        } else {
            // Guest fallback
            const guestUser = await prisma.user.findUnique({ where: { email: 'guest@example.com' } });
            if (guestUser) {
                connectedUser = { connect: { id: guestUser.id } };
            } else {
                const newGuest = await prisma.user.create({
                    data: {
                        email: `guest_${Date.now()}@example.com`,
                        password: 'guest',
                        name: 'Guest User',
                        role: 'USER'
                    }
                });
                connectedUser = { connect: { id: newGuest.id } };
            }
        }

        // Create Address record
        const newAddress = await prisma.address.create({
            data: {
                ...address,
                user: connectedUser
            }
        });

        // Validate that all products exist before creating order
        const productIds = items.map((item: any) => item.id);
        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true }
        });
        const existingIds = new Set(existingProducts.map(p => p.id));
        const missingItems = items.filter((item: any) => !existingIds.has(item.id));

        if (missingItems.length > 0) {
            // Clean up the address we just created
            await prisma.address.delete({ where: { id: newAddress.id } });
            return NextResponse.json({
                error: "Một số sản phẩm không còn tồn tại. Vui lòng xóa giỏ hàng và thêm lại sản phẩm.",
                invalidItems: missingItems.map((item: any) => item.name)
            }, { status: 400 });
        }

        // Create Order
        const order = await prisma.order.create({
            data: {
                user: connectedUser,
                address: { connect: { id: newAddress.id } },
                total,
                status: 'PENDING',
                referralCode: referralCode || null,
                items: {
                    create: items.map((item: any) => ({
                        product: { connect: { id: item.id } },
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error) {
        console.error("Order creation failed:", error);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }
}
