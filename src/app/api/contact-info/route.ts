import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

// GET — public: get contact info (or create default if none)
export async function GET() {
    let info = await prisma.contactInfo.findFirst();
    if (!info) {
        info = await prisma.contactInfo.create({ data: {} });
    }
    return NextResponse.json(info);
}

// PATCH — admin only: update contact info
export async function PATCH(req: Request) {
    const session = await getSession() as any;
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let info = await prisma.contactInfo.findFirst();
    const body = await req.json();

    if (!info) {
        info = await prisma.contactInfo.create({ data: body });
    } else {
        info = await prisma.contactInfo.update({ where: { id: info.id }, data: body });
    }
    return NextResponse.json(info);
}
