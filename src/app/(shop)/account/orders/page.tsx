"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/account/StatusBadge";
import { EmptyState } from "@/components/account/EmptyState";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";


interface OrderItem {
    id: string;
    quantity: number;
    price: string;
    product: { name: string; images: string[] };
}

interface Order {
    id: string;
    total: string;
    shippingFee: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

const tabs = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đang giao", value: "SHIPPED" },
    { label: "Đã giao", value: "DELIVERED" },
    { label: "Đã huỷ", value: "CANCELLED" },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetch("/api/account/orders")
            .then((r) => r.json())
            .then((data) => setOrders(data.orders || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter
        ? orders.filter((o) => o.status === filter)
        : orders;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-extrabold tracking-tight">Đơn hàng</h1>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === tab.value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Order List */}
            {filtered.length === 0 ? (
                <EmptyState
                    icon={<ShoppingBag className="h-8 w-8" />}
                    title="Chưa có đơn hàng"
                    description="Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm của chúng tôi!"
                    action={
                        <Link
                            href="/products"
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            Mua sắm ngay
                        </Link>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="block rounded-2xl border border-border/40 bg-card/50 p-5 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground font-mono">
                                        #{order.id.slice(-8).toUpperCase()}
                                    </span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        {order.items.length} sản phẩm
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <p className="text-lg font-extrabold">
                                    {formatPrice(order.total)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
