"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EmptyState } from "@/components/account/EmptyState";
import { Heart, Loader2, Trash2, ShoppingCart, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface WishlistItem {
    id: string;
    productId: string;
    product: {
        id: string;
        name: string;
        price: string;
        images: string[];
        stock: number;
    };
}

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
    const router = useRouter(); 

    useEffect(() => {
        fetch("/api/account/wishlist")
            .then((r) => r.json())
            .then((data) => setItems(data.wishlist || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (productId: string) => {
        setRemoving(productId);
        try {
            await fetch(`/api/account/wishlist?productId=${productId}`, {
                method: "DELETE",
            });
            setItems((prev) => prev.filter((i) => i.product.id !== productId));
        } catch (error) {
            console.error(error);
        } finally {
            setRemoving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Yêu thích</h1>

            {items.length === 0 ? (
                <EmptyState
                    icon={<Heart className="h-8 w-8" />}
                    title="Chưa có sản phẩm yêu thích"
                    description="Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi"
                    action={
                        <Link
                            href="/products"
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            Khám phá sản phẩm
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-border/40 bg-card/50 p-4 flex gap-4 hover:shadow-sm transition-shadow"
                        >
                            <Link
                                href={`/products/${item.product.id}`}
                                className="h-20 w-20 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0 overflow-hidden"
                            >
                                {item.product.images?.[0] ? (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        width={80}
                                        height={80}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                )}
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.product.id}`}>
                                    <p className="text-sm font-medium truncate hover:text-primary transition-colors">
                                        {item.product.name}
                                    </p>
                                </Link>
                                <p className="text-lg font-bold mt-1">
                                    {Number(item.product.price).toLocaleString("vi-VN")}₫
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {item.product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                                <button
                                    onClick={() => handleRemove(item.product.id)}
                                    disabled={removing === item.product.id}
                                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
                                    title="Xoá"
                                >
                                    {removing === item.product.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </button>
                               <button
                                    onClick={() => router.push('/cart')} 
                                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                                    title="Đến giỏ hàng"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
