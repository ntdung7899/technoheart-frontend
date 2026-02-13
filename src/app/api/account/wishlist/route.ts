import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId: session.id as string },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        stock: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ wishlist });
    } catch (error) {
        console.error("Get wishlist error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const item = await prisma.wishlistItem.create({
            data: {
                userId: session.id as string,
                productId,
            },
        });

        return NextResponse.json({ item }, { status: 201 });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Sản phẩm đã có trong danh sách yêu thích" }, { status: 409 });
        }
        console.error("Add wishlist error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: session.id as string,
                    productId,
                },
            },
        });

        return NextResponse.json({ message: "Removed" });
    } catch (error) {
        console.error("Remove wishlist error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
