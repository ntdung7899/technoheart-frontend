"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    User,
    Mail,
    MapPin,
    Calendar,
    Package,
    ShoppingBag,
    CreditCard,
    Loader2,
} from "lucide-react";
import {
    getAdminOrderById,
    type AdminOrderDetail,
} from "@/lib/api/admin-orders";

const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ xử lý", color: "bg-amber-50 text-amber-600" },
    PROCESSING: { label: "Đang xử lý", color: "bg-blue-50 text-blue-600" },
    SHIPPED: { label: "Đang giao", color: "bg-blue-50 text-blue-600" },
    DELIVERED: { label: "Hoàn tất", color: "bg-emerald-50 text-emerald-600" },
    CANCELLED: { label: "Đã huỷ", color: "bg-slate-100 text-slate-500" },
};

function formatMoney(value: number | string | undefined | null) {
    return Number(value || 0).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
}

export default function OrderDetailPage() {
    const params = useParams();
    const id = String(params.id || "");

    const [order, setOrder] = useState<AdminOrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadOrder() {
            try {
                setError("");

                if (!id) {
                    setError("Thiếu mã đơn hàng.");
                    return;
                }

                const data = await getAdminOrderById(id);

                if (mounted) {
                    setOrder(data);
                }
            } catch (error) {
                console.error("LOAD_ADMIN_ORDER_DETAIL_ERROR:", error);

                if (mounted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Không thể tải chi tiết đơn hàng"
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadOrder();

        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tải chi tiết đơn hàng...
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="space-y-6 pb-12 max-w-5xl">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/orders"
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>

                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">
                            Đơn hàng
                        </p>
                        <h1 className="text-xl font-bold text-slate-900">
                            Không tìm thấy đơn hàng
                        </h1>
                    </div>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-600">
                    {error || "Đơn hàng không tồn tại."}
                </div>
            </div>
        );
    }

    const statusInfo = statusMap[order.status] || statusMap.PENDING;
    const shippingFee = Number(order.shippingFee || 0);
    const subTotal = Number(order.total || 0);

    return (
        <div className="space-y-6 pb-12 max-w-5xl">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/orders"
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>

                <div>
                    <p className="text-xs font-medium text-slate-400 mb-0.5">
                        Đơn hàng
                    </p>
                    <h1 className="text-xl font-bold text-slate-900">
                        <span className="font-mono text-primary">
                            #{order.id.slice(0, 8)}
                        </span>
                    </h1>
                </div>

                <div className="ml-auto">
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium ${statusInfo.color}`}
                    >
                        {statusInfo.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                            <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Sản phẩm trong đơn ({order.items.length})
                            </p>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {order.items.map((item) => {
                                const productImage =
                                    item.product?.images?.[0] || "";
                                const productName =
                                    item.product?.name ||
                                    "Sản phẩm không tồn tại";

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors"
                                    >
                                        <div className="h-14 w-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                            {productImage ? (
                                                <Image
                                                    src={productImage}
                                                    alt={productName}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-slate-900 truncate">
                                                {productName}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                SL: {item.quantity} ×{" "}
                                                {Number(item.price).toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-medium text-sm tabular-nums text-slate-900">
                                                {formatMoney(
                                                    Number(item.price) *
                                                        Number(item.quantity)
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tạm tính</span>
                            <span className="font-medium text-slate-900 tabular-nums">
                                {formatMoney(subTotal)}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                Phí vận chuyển
                            </span>
                            {shippingFee > 0 ? (
                                <span className="font-medium text-slate-900">
                                    {formatMoney(shippingFee)}
                                </span>
                            ) : (
                                <span className="font-medium text-emerald-600">
                                    Miễn phí
                                </span>
                            )}
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-medium text-slate-900">
                                Tổng thanh toán
                            </span>
                            <span className="text-xl font-bold text-primary tabular-nums">
                                {formatMoney(Number(order.total || 0))}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            Khách hàng
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600">
                                {(order.user?.name || order.user?.email || "K")
                                    .slice(0, 1)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <p className="font-medium text-sm text-slate-900">
                                    {order.user?.name || "N/A"}
                                </p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {order.user?.email || "Không có email"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {order.address && (
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                            <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                Địa chỉ giao hàng
                            </p>

                            <div className="text-sm text-slate-700 space-y-1">
                                {order.address.label && (
                                    <p className="font-medium">
                                        {order.address.label}
                                    </p>
                                )}

                                {(order.address.name ||
                                    order.address.fullName) && (
                                    <p className="font-medium">
                                        {order.address.name ||
                                            order.address.fullName}
                                    </p>
                                )}

                                {order.address.phone && (
                                    <p>{order.address.phone}</p>
                                )}

                                <p>{order.address.street || "N/A"}</p>

                                <p>
                                    {[
                                        order.address.ward,
                                        order.address.city,
                                        order.address.state,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}{" "}
                                    {order.address.zip || ""}
                                </p>

                                <p>{order.address.country || ""}</p>
                            </div>
                        </div>
                    )}

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Thông tin đơn
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Mã đơn</span>
                                <span className="font-mono font-medium text-slate-900 text-xs">
                                    #{order.id.slice(0, 12)}
                                </span>
                            </div>

                            {order.transactionId && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">
                                        Mã thanh toán
                                    </span>
                                    <span className="font-mono font-medium text-slate-900 text-xs">
                                        {order.transactionId}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Ngày đặt
                                </span>
                                <span className="font-medium text-slate-900">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3 mt-3">
                                <span className="text-zinc-500 font-medium">
                                    Thanh toán
                                </span>

                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                                        {order.paymentMethod === "COD"
                                            ? "COD"
                                            : "Chuyển khoản"}
                                    </span>

                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide uppercase ${
                                            order.paymentStatus === "PAID"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {order.paymentStatus === "PAID"
                                            ? "Đã thanh toán"
                                            : "Chưa thanh toán"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}