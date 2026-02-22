import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

// GET /api/news-categories — list all
export async function GET() {
    const categories = await prisma.newsCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { news: true } } },
    });
    return NextResponse.json(categories);
}

// POST /api/news-categories — create
export async function POST(req: Request) {
    const session = await getSession() as any;
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, color } = body;

    if (!name?.trim()) {
        return NextResponse.json({ error: "Tên danh mục là bắt buộc" }, { status: 400 });
    }

    const slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    try {
        const category = await prisma.newsCategory.create({
            data: { name: name.trim(), slug, description: description || null, color: color || "#3b82f6" },
        });
        return NextResponse.json(category, { status: 201 });
    } catch (e: any) {
        if (e.code === "P2002") {
            return NextResponse.json({ error: "Tên danh mục đã tồn tại" }, { status: 409 });
        }
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
