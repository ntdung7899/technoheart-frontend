"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function PayPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const amount = searchParams.get("amount");

    const [isPaid, setIsPaid] = useState(false);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (!code || isPaid) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/check-status?code=${code}`);
                const data = await res.json();

                if (data.paymentStatus === "PAID") {
                    setIsPaid(true); 
                    setOrderId(data.orderId); 
                    clearInterval(interval); 
                }
            } catch (error) {
                console.error("Lỗi kiểm tra trạng thái:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [code, isPaid]);

    if (!code || !amount) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Tự động tạo mã QR chuẩn của ngân hàng (Số TK của bạn: STK - NGÂN HÀNG)
    const qrUrl = `https://img.vietqr.io/image/MB-0328858159-compact2.png?amount=${amount}&addInfo=${code}&accountName=LE THANH CHIEN`;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 transition-all duration-500">

                {!isPaid ? (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán đơn hàng</h1>
                            <p className="text-gray-500 text-sm">Vui lòng quét mã QR bằng ứng dụng ngân hàng. Trang sẽ tự động chuyển khi thanh toán thành công.</p>
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-2xl border-2 border-dashed border-blue-200 mb-6 flex justify-center relative">
                            <img src={qrUrl} alt="Mã QR Thanh Toán" className="w-64 h-64 object-contain mix-blend-multiply" />
                        </div>

                        <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tài khoản:</span>
                                <span className="font-semibold text-blue-600">0328858159 (MBBank)</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tiền:</span>
                                <span className="font-bold text-red-500">{Number(amount).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-gray-500">Nội dung CK:</span>
                                <span className="font-bold text-gray-900 bg-yellow-100 px-2 rounded">{code}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-sm text-blue-600 mb-2 font-medium">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Hệ thống đang chờ nhận tiền...</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
                        <p className="text-gray-500 mb-8">Hệ thống đã xác nhận thanh toán. Cảm ơn bạn đã mua sắm.</p>

                        <Link 
                            href={orderId ? `/account/orders/${orderId}` : "/account/orders"}
                            className="w-full flex items-center justify-center bg-gray-900 text-white h-14 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                        >
                            Xem chi tiết đơn hàng
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}