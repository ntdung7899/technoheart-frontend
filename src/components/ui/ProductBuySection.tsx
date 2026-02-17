"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Check, Sparkles, ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface ProductBuySectionProps {
    product: {
        id: string;
        name: string;
        price: number | string;
        images: string[];
    };
}

export function ProductBuySection({ product }: ProductBuySectionProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [buyingNow, setBuyingNow] = useState(false);
    const isAdded = status === 'success';

    const decrease = () => setQuantity(prev => Math.max(1, prev - 1));
    const increase = () => setQuantity(prev => Math.min(99, prev + 1));

    const handleAdd = () => {
        setStatus('loading');
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: quantity,
                image: product.images[0],
            });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        }, 600);
    };

    const handleBuyNow = () => {
        setBuyingNow(true);
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: quantity,
            image: product.images[0],
        });
        router.push("/checkout");
    };

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Số lượng</span>
                <div className="flex items-center h-10 rounded-lg border border-zinc-200 bg-white overflow-hidden">
                    <button
                        onClick={decrease}
                        className="flex h-full w-10 items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors active:scale-95 disabled:opacity-40"
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-10 text-center text-sm font-bold tabular-nums border-x border-zinc-200 h-full flex items-center justify-center">
                        {quantity}
                    </div>
                    <button
                        onClick={increase}
                        className="flex h-full w-10 items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors active:scale-95 disabled:opacity-40"
                        disabled={quantity >= 99}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                {/* Mua ngay */}
                <button
                    onClick={handleBuyNow}
                    disabled={buyingNow}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold text-sm py-3.5 px-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {buyingNow ? (
                        <>
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                            <span>Đang chuyển...</span>
                        </>
                    ) : (
                        <>
                            <ArrowRight className="h-4.5 w-4.5" />
                            <span>Mua ngay</span>
                        </>
                    )}
                </button>

                {/* Thêm vào giỏ hàng */}
                <button
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`
                        flex items-center justify-center gap-2 rounded-xl font-bold text-sm py-3.5 px-6 transition-all active:scale-[0.98] border-2
                        ${isAdded
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-white text-primary border-primary hover:bg-primary/5"
                        }
                        disabled:cursor-not-allowed
                    `}
                >
                    {isAdded ? (
                        <>
                            <Check className="h-4.5 w-4.5" />
                            <span>Đã thêm</span>
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4.5 w-4.5" />
                            <span>Thêm vào giỏ hàng</span>
                        </>
                    )}
                </button>
            </div>

            {/* Trả góp */}
            <button className="flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-300 bg-white text-zinc-700 font-semibold text-sm py-3 px-6 hover:bg-zinc-50 hover:border-zinc-400 transition-all">
                <CreditCard className="h-4 w-4 text-zinc-500" />
                <span>Trả góp <span className="font-bold text-zinc-900">0%</span></span>
            </button>
        </div>
    );
}

