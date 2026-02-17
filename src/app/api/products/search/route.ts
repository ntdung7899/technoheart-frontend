import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q")?.trim();

    if (!q || q.length < 1) {
        return NextResponse.json([]);
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                ],
            },
            select: {
                id: true,
                name: true,
                price: true,
                images: true,
                category: { select: { name: true } },
            },
            take: 6,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Search failed:", error);
        return NextResponse.json(
            { error: "Search failed" },
            { status: 500 }
        );
    }
}
