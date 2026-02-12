"use client";

import { useCartStore } from "@/store/cart";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

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
            className="flex w-full items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAdded ? "Added to Cart" : "Add to Cart"}
        </button>
    );
}
