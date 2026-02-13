"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export function CartIcon() {
    const items = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);
    const [isBumping, setIsBumping] = useState(false);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Trigger bump animation when itemCount changes
    useEffect(() => {
        if (itemCount === 0) return;
        setIsBumping(true);
        const timer = setTimeout(() => setIsBumping(false), 300);
        return () => clearTimeout(timer);
    }, [itemCount]);

    return (
        <Link href="/cart" className="group relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all">
            <ShoppingCart className={`h-5 w-5 transition-transform duration-300 ${isBumping ? 'scale-110' : 'scale-100'}`} />
            {mounted && itemCount > 0 && (
                <span className={`
                    absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground shadow-lg ring-2 ring-background transition-all duration-300
                    ${isBumping ? 'scale-125 -translate-y-1' : 'scale-100 translate-y-0'}
                `}>
                    {itemCount}
                </span>
            )}
        </Link>
    );
}
