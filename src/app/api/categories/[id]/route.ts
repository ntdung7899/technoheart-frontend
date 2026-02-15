import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, image } = body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                image
            }
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error("[CATEGORY_PATCH]", error);
        return NextResponse.json({
            error: "Failed to update category",
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error: any) {
        console.error("[CATEGORY_DELETE]", error);
        return NextResponse.json({
            error: "Failed to delete category",
            details: error.message
        }, { status: 500 });
    }
}
