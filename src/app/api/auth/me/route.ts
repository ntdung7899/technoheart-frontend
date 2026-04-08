import { getSession, logout } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.id as string },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                points: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            // Session is stale — clear it and tell the client to re-authenticate
            await logout();
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
