import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        const mySePaySecret = `Apikey ${process.env.SEPAY_WEBHOOK_SECRET}`;

        if (authHeader !== mySePaySecret) {
            console.error("Lỗi xác thực Webhook SePay!");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { transferAmount, content } = body; 

        if (content && transferAmount) {
            const match = content.match(/TH\d{4}/); 
            
            if (match) {
                const orderCode = match[0]; 

                const order = await prisma.order.findFirst({
                    where: { transactionId: orderCode }
                });

                if (order && order.paymentStatus === "UNPAID" && transferAmount >= Number(order.total)) {
                    
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { 
                            paymentStatus: "PAID", // Đã thanh toán
                            status: "PROCESSING"   // Tự động chuyển đơn sang đang xử lý
                        }
                    });

                    console.log(`Đã xác nhận thanh toán đơn hàng ${orderCode} qua SePay!`);
                } else if (order && transferAmount < Number(order.total)) {
                    console.log(`Đơn ${orderCode} chuyển thiếu tiền: Yêu cầu ${order.total}, Thực nhận ${transferAmount}`);
                }
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("SePay Webhook Error:", error);
        return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
    }
}