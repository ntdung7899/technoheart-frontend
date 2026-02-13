import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const addresses = await prisma.address.findMany({
            where: { userId: session.id as string },
            orderBy: { isDefault: "desc" },
        });

        return NextResponse.json({ addresses });
    } catch (error) {
        console.error("Get addresses error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { label, street, city, state, zip, country, latitude, longitude, isDefault } = body;

        if (!street || !city || !state || !zip || !country) {
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.id as string, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                label: label || null,
                street,
                city,
                state,
                zip,
                country,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                isDefault: isDefault || false,
                userId: session.id as string,
            },
        });

        return NextResponse.json({ address }, { status: 201 });
    } catch (error) {
        console.error("Create address error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, label, street, city, state, zip, country, latitude, longitude, isDefault } = body;

        if (!id) {
            return NextResponse.json({ error: "Address ID required" }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.address.findFirst({
            where: { id, userId: session.id as string },
        });
        if (!existing) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.id as string, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: {
                ...(label !== undefined && { label }),
                ...(street && { street }),
                ...(city && { city }),
                ...(state && { state }),
                ...(zip && { zip }),
                ...(country && { country }),
                ...(latitude !== undefined && { latitude: latitude ? parseFloat(latitude) : null }),
                ...(longitude !== undefined && { longitude: longitude ? parseFloat(longitude) : null }),
                ...(isDefault !== undefined && { isDefault }),
            },
        });

        return NextResponse.json({ address });
    } catch (error) {
        console.error("Update address error:", error);
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
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Address ID required" }, { status: 400 });
        }

        // Verify ownership
        const existing = await prisma.address.findFirst({
            where: { id, userId: session.id as string },
        });
        if (!existing) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        await prisma.address.delete({ where: { id } });

        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        console.error("Delete address error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
