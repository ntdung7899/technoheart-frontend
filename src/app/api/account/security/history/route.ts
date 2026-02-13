import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const history = await prisma.loginHistory.findMany({
            where: { userId: session.id as string },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        return NextResponse.json({ history });
    } catch (error) {
        console.error("Get security history error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
