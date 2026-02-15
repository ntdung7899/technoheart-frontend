"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
                <p className="text-muted-foreground">{error || "Không tìm thấy đơn hàng"}</p>
                <Link href="/account/orders" className="text-primary text-sm font-bold mt-2 inline-block hover:underline">
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
                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight">
                        Đơn hàng #{order.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-xs text-muted-foreground">
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
                <div className="rounded-2xl border border-border/40 bg-card/50 p-6">
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
                                                ? "bg-primary text-primary-foreground shadow-lg"
                                                : isCompleted
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-secondary text-muted-foreground"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span
                                            className={`text-[10px] font-bold ${isCompleted ? "text-foreground" : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < trackingSteps.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 rounded-full ${i < currentStep ? "bg-primary/30" : "bg-border"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <p className="text-sm font-medium text-red-600">Đơn hàng đã bị huỷ</p>
                </div>
            )}

            {/* Products */}
            <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
                <div className="px-5 py-3 border-b border-border/40">
                    <h2 className="text-sm font-bold">Sản phẩm</h2>
                </div>
                <div className="divide-y divide-border/40">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="h-14 w-14 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0 overflow-hidden">
                                {item.product.images?.[0] ? (
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    x{item.quantity}
                                </p>
                            </div>
                            <p className="text-sm font-bold whitespace-nowrap">
                                {formatPrice(item.price)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-bold">Địa chỉ giao hàng</h2>
                </div>
                <p className="text-sm">{order.address.street}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {order.address.city}, {order.address.state} {order.address.zip}
                </p>
            </div>

            {/* Price Summary */}
            <div className="rounded-2xl border border-border/40 bg-card/50 p-5 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <div className="border-t border-border/40 pt-3 flex justify-between">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="text-lg font-extrabold">
                        {formatPrice(order.total)}
                    </span>
                </div>
            </div>
        </div>
    );
}
