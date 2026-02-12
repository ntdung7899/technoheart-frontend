
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, address, total, userId } = body;

        // Validate body (basic)
        if (!items || items.length === 0 || !address) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
        }

        // In a real app, verify prices from DB to avoid client-side manipulation.
        // Also, handle user authentication. If userId is provided, use it.
        // For this MVP, we might create a guest user or use a dummy user if not logged in.
        let connectedUser;

        if (userId) {
            connectedUser = { connect: { id: userId } };
        } else {
            // Find or create a guest user? Or just leave it optional if schema allows.
            // My schema has `userId String` and `user User @relation...`. So User IS required.
            // I will create a "Guest User" or require login.
            // For simplicity, I'll find the first user (seeded one) or create a guest.
            const guestUser = await prisma.user.findUnique({ where: { email: 'guest@example.com' } });
            if (guestUser) {
                connectedUser = { connect: { id: guestUser.id } };
            } else {
                // Create a guest user
                const newGuest = await prisma.user.create({
                    data: {
                        email: `guest_${Date.now()}@example.com`,
                        password: 'guest', // Insecure but MVP
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

        // Create Order
        const order = await prisma.order.create({
            data: {
                user: connectedUser,
                address: { connect: { id: newAddress.id } },
                total,
                status: 'PENDING',
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
