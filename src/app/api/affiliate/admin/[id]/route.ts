import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Lấy thông tin 1 đối tác
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.id as string } });
        if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: affiliateId } = await params;

        const profile = await prisma.affiliateProfile.findUnique({
            where: { id: affiliateId },
            include: {
                user: { select: { name: true, email: true } }
            }
        });

        if (!profile) {
            return NextResponse.json({ error: "Không tìm thấy đối tác" }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Admin get affiliate detail error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PATCH: Sửa thông tin đối tác
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.id as string } });
        if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id: affiliateId } = await params;
        const body = await req.json();
        const { name, email } = body;

        const profile = await prisma.affiliateProfile.findUnique({
            where: { id: affiliateId },
            select: { userId: true }
        });

        if (!profile) {
            return NextResponse.json({ error: "Không tìm thấy hồ sơ đối tác" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: profile.userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
        });

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Admin update affiliate error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}