import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-utils";

const PV_RATE = 26000;

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getSession() as any;
        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { status } = await req.json();
        const withdrawal = await prisma.withdrawalRequest.findUnique({
            where: { id }
        });
        if (!withdrawal) {
            return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
        }

        if (status === 'REJECTED' && withdrawal.status !== 'REJECTED') {
            const amountVND = Number(withdrawal.amount) * PV_RATE;
            await prisma.$transaction([
                prisma.withdrawalRequest.update({
                    where: { id },
                    data: { status }
                }),
                prisma.affiliateProfile.update({
                    where: { id: withdrawal.affiliateId },
                    data: { paidEarnings: { decrement: amountVND } }
                })
            ]);
            return NextResponse.json({ success: true, message: "Đã từ chối và hoàn tiền." });
        }
        const updated = await prisma.withdrawalRequest.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Withdrawal update failed:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}