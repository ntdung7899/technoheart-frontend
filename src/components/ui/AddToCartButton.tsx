"use client";

import { useCartStore } from "@/store/cart";
import { useState } from "react";
import { ShoppingCart, Check, Sparkles } from "lucide-react";

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        price: number | string;
        images: string[];
    };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image: product.images[0],
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={isAdded}
            className={`
                relative flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-base font-bold transition-all duration-300
                ${isAdded
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                    : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                }
                disabled:cursor-not-allowed
            `}
        >
            <div className="flex items-center justify-center gap-2">
                {isAdded ? (
                    <>
                        <Check className="h-5 w-5 animate-scale-in" />
                        <span>Đã thêm vào giỏ</span>
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-float" />
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Thêm vào giỏ hàng</span>
                    </>
                )}
            </div>
        </button>
    );
}
