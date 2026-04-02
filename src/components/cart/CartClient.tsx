
"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";


export function CartClient() {
    const { items, removeItem, updateQuantity, total } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Đang tải giỏ hàng...</p>
        </div>
    );

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative h-24 w-24 bg-secondary/50 rounded-xl flex items-center justify-center border border-border/50">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Giỏ hàng của bạn đang trống</h2>
                <p className="text-muted-foreground mt-2 mb-10 max-w-sm mx-auto leading-relaxed">
                    Có vẻ như bạn chưa chọn được sản phẩm ưng ý nào. Hãy quay lại cửa hàng để khám phá những thiết bị công nghệ mới nhất nhé.
                </p>
                <Link
                    href="/products"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-10 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    Bắt đầu mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start pb-20">
            {/* Products List */}
            <div className="lg:col-span-8 space-y-6">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40">
                    <div className="col-span-6">Sản phẩm</div>
                    <div className="col-span-3 text-center">Số lượng</div>
                    <div className="col-span-2 text-right">Tổng cộng</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="group relative rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-4 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                {/* Product Info */}
                                <div className="md:col-span-6 flex items-center gap-6">
                                    <div className="relative h-24 w-24 min-w-[6rem] overflow-hidden rounded-xl border border-border/50 bg-white p-2">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Link href={`/products/${item.id}`} className="font-bold text-lg leading-tight hover:text-primary transition-colors line-clamp-1">
                                            {item.name}
                                        </Link>
                                        <div className="text-sm font-semibold text-primary">
                                            {formatPrice(item.price)}
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Control */}
                                <div className="md:col-span-3 flex justify-center">
                                    <div className="flex items-center bg-secondary/50 rounded-xl p-1 border border-border/50">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-background hover:text-primary transition-all disabled:opacity-30"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="h-8 w-8 flex items-center justify-center rounded-xl hover:bg-background hover:text-primary transition-all"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Item Total */}
                                <div className="md:col-span-2 text-right hidden md:block">
                                    <span className="text-lg font-bold tracking-tight">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>

                                {/* Remove Button */}
                                <div className="md:col-span-1 text-right">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                                        title="Xoá sản phẩm"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
                <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        Tổng đơn hàng
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Tạm tính</span>
                                <span className="text-foreground">{formatPrice(total())}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-muted-foreground">Phí vận chuyển</span>
                                <span className="text-green-500 font-semibold uppercase text-xs tracking-wider bg-green-500/10 px-2 py-0.5 rounded-full">Miễn phí</span>
                            </div>
                        </div>

                        <div className="h-px bg-border/40" />

                        <div className="flex justify-between items-baseline pt-2">
                            <span className="text-lg font-bold">Tổng cộng</span>
                            <div className="text-right">
                                <span className="text-3xl font-bold tracking-tighter text-primary">
                                    {formatPrice(total())}
                                </span>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Đã bao gồm thuế VAT</p>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="w-full h-14 mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group"
                        >
                            Tiến hành thanh toán
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm space-x-1">
                            <Truck className="h-5 w-5" />
                        </div>
                        <div className="text-xs">
                            <p className="font-semibold">Giao hàng miễn phí</p>
                            <p className="text-muted-foreground">Cho tất cả đơn hàng từ 1.000.000đ</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="text-xs">
                            <p className="font-semibold">Bảo hành 24 tháng</p>
                            <p className="text-muted-foreground">Sửa chữa tận nơi trong 24h</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-primary shadow-sm">
                            <RefreshCcw className="h-5 w-5" />
                        </div>
                        <div className="text-xs">
                            <p className="font-semibold">Đổi 30 ngày</p>
                            <p className="text-muted-foreground">Hoàn tiền 100% nếu không hài lòng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
