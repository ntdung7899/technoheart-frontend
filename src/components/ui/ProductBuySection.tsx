"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

interface ProductBuySectionProps {
    product: {
        id: string;
        name: string;
        price: number | string;
        images: string[];
    };
}

export function ProductBuySection({ product }: ProductBuySectionProps) {
    const [quantity, setQuantity] = useState(1);

    const decrease = () => setQuantity(prev => Math.max(1, prev - 1));
    const increase = () => setQuantity(prev => Math.min(99, prev + 1));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Số lượng</span>
                <div className="flex items-center h-14 w-fit rounded-2xl border border-border/50 bg-secondary/20 p-1.5 gap-2">
                    <button
                        onClick={decrease}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-background hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-90 disabled:opacity-50"
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4 line-clamp-1" />
                    </button>

                    <div className="w-12 text-center text-sm font-black tabular-nums">
                        {quantity}
                    </div>

                    <button
                        onClick={increase}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-background hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-90 disabled:opacity-50"
                        disabled={quantity >= 99}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <AddToCartButton product={product} quantity={quantity} />
        </div>
    );
}
