import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";

// GET — admin: list all messages
export async function GET() {
    const session = await getSession() as any;
    if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
}

// POST — public: submit contact form
export async function POST(req: Request) {
    const body = await req.json();
    const { name, email, subject, body: msgBody } = body;

    if (!name || !email || !subject || !msgBody) {
        return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }

    const message = await prisma.contactMessage.create({
        data: { name, email, subject, body: msgBody },
    });
    return NextResponse.json(message, { status: 201 });
}
