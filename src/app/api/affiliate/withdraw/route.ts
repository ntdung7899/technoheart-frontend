import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const PV_RATE = 26000;

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { amount, bankName, accountNumber, accountName } = body; 

        const profile = await prisma.affiliateProfile.findUnique({
            where: { userId: session.id as string }
        });

        if (!profile) return NextResponse.json({ error: "Không tìm thấy hồ sơ đối tác" }, { status: 404 });

        const availableBalanceVND = Number(profile.totalEarnings) - Number(profile.paidEarnings);
        
        const amountVND = Number(amount) * PV_RATE;

        if (availableBalanceVND < amountVND) {
            return NextResponse.json({ error: "Số dư khả dụng không đủ để thực hiện" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            await tx.affiliateProfile.update({
                where: { id: profile.id },
                data: {
                    paidEarnings: {
                        increment: amountVND 
                    }
                }
            });

            const withdrawal = await tx.withdrawalRequest.create({
                data: {
                    affiliateId: profile.id,
                    amount: Number(amount),
                    bankName: String(bankName),
                    accountNumber: String(accountNumber),
                    accountName: String(accountName),
                    status: "APPROVED",
                }
            });

            return withdrawal;
        });

        return NextResponse.json({ 
            success: true, 
            message: "Rút tiền thành công!", 
            data: result 
        });

    } catch (error) {
        console.error("Auto-Withdraw Error:", error);
        return NextResponse.json({ error: "Lỗi hệ thống khi xử lý giao dịch" }, { status: 500 });
    }
}