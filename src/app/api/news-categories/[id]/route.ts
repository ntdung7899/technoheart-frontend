import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

// PATCH /api/news-categories/[id]
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as any;
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, description, color } = body;

    const slug = name
        ? name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
        : undefined;

    try {
        const category = await prisma.newsCategory.update({
            where: { id },
            data: {
                ...(name && { name: name.trim(), slug }),
                ...(description !== undefined && { description }),
                ...(color && { color }),
            },
        });
        return NextResponse.json(category);
    } catch (e: any) {
        if (e.code === "P2002") return NextResponse.json({ error: "Tên đã tồn tại" }, { status: 409 });
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}

// DELETE /api/news-categories/[id]
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as any;
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.newsCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
