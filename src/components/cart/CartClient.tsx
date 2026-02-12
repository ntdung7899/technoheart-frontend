"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function CartClient() {
    const { items, removeItem, updateQuantity, total } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="py-20 text-center">Đang tải giỏ hàng...</div>;

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Giỏ hàng của bạn đang trống</h2>
                <p className="text-muted-foreground mt-4 mb-8">
                    Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
                </p>
                <Link
                    href="/products"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Bắt đầu mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8">
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50 hidden md:table-header-group">
                            <tr className="text-left text-sm text-muted-foreground border-b">
                                <th className="p-4 font-medium">Sản phẩm</th>
                                <th className="p-4 font-medium">Số lượng</th>
                                <th className="p-4 font-medium">Tổng cộng</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {items.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 min-w-16 overflow-hidden rounded border bg-white p-1">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <Link href={`/products/${item.id}`} className="font-medium hover:underline block md:hidden mb-1">
                                                    {item.name}
                                                </Link>
                                                <Link href={`/products/${item.id}`} className="font-medium hover:underline hidden md:block">
                                                    {item.name}
                                                </Link>
                                                <div className="text-sm text-muted-foreground md:hidden">
                                                    ${item.price} x {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center border rounded-md w-fit">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-muted disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-muted"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium hidden md:table-cell">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="border rounded-lg p-6 bg-muted/20">
                    <h3 className="text-lg font-semibold mb-4">Tổng đơn hàng</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tạm tính</span>
                            <span>${total().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Giao hàng</span>
                            <span>Tính khi thanh toán</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                            <span>Tổng cộng</span>
                            <span>${total().toFixed(2)}</span>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="w-full mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                    >
                        Tiến hành thanh toán
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
