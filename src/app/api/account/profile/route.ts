import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, avatar } = body;

        const user = await prisma.user.update({
            where: { id: session.id as string },
            data: {
                ...(name !== undefined && { name: name?.trim() || null }),
                ...(phone !== undefined && { phone: phone?.trim() || null }),
                ...(avatar !== undefined && { avatar }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                avatar: true,
                points: true,
                role: true,
            },
        });

        return NextResponse.json({ user, message: "Cập nhật thành công!" });
    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
