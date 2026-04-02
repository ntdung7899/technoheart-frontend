"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/account/StatusBadge";
import { ArrowLeft, Loader2, Package, MapPin, Truck, CheckCircle2, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";


interface OrderDetail {
    id: string;
    total: string;
    shippingFee: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    items: {
        id: string;
        quantity: number;
        price: string;
        product: { name: string; images: string[]; price: string };
    }[];
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

const trackingSteps = [
    { status: "PENDING", label: "Đặt hàng", icon: Package },
    { status: "PROCESSING", label: "Xử lý", icon: Package },
    { status: "SHIPPED", label: "Giao hàng", icon: Truck },
    { status: "DELIVERED", label: "Nhận hàng", icon: CheckCircle2 },
];

function getStepIndex(status: string) {
    if (status === "CANCELLED") return -1;
    return trackingSteps.findIndex((s) => s.status === status);
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/account/orders/${id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) setError(data.error);
                else setOrder(data.order);
            })
            .catch(() => setError("Không thể tải đơn hàng"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400">{error || "Không tìm thấy đơn hàng"}</p>
                <Link href="/account/orders" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline">
                    ← Quay lại
                </Link>
            </div>
        );
    }

    const currentStep = getStepIndex(order.status);
    const subtotal = Number(order.total) - Number(order.shippingFee);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/account/orders"
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">
                        Đơn hàng #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <div className="ml-auto">
                    <StatusBadge status={order.status} />
                </div>
            </div>

            {/* Status Tracking */}
            {order.status !== "CANCELLED" ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        {trackingSteps.map((step, i) => {
                            const Icon = step.icon;
                            const isCompleted = i <= currentStep;
                            const isActive = i === currentStep;
                            return (
                                <div key={step.status} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isActive
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                : isCompleted
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-slate-100 text-slate-400"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span
                                            className={`text-xs font-semibold ${isCompleted ? "text-slate-700" : "text-slate-400"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < trackingSteps.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 rounded-full ${i < currentStep ? "bg-blue-300" : "bg-slate-200"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <p className="text-sm font-medium text-red-600">Đơn hàng đã bị huỷ</p>
                </div>
            )}

            {/* Products */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-700">Sản phẩm</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                {item.product.images?.[0] ? (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        width={56}
                                        height={56}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <Package className="h-5 w-5 text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">{item.product.name}</p>
                                <p className="text-xs text-slate-400">
                                    x{item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
                                {formatPrice(item.price)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <h2 className="text-sm font-semibold text-slate-700">Địa chỉ giao hàng</h2>
                </div>
                <p className="text-sm text-slate-700">{order.address.street}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                    {order.address.city}, {order.address.state} {order.address.zip}
                </p>
            </div>

            {/* Price Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tạm tính</span>
                    <span className="text-slate-700">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Phí vận chuyển</span>
                    <span className="text-slate-700">{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-bold text-slate-800">Tổng cộng</span>
                    <span className="text-lg font-bold text-slate-800">
                        {formatPrice(order.total)}
                    </span>
                </div>
            </div>
        </div>
    );
}
