
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export function CartIcon() {
    const [mounted, setMounted] = useState(false);
    const items = useCartStore((state) => state.items);

    // Calculate total quantity across all items
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Link href="/cart" className="group relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground ring-2 ring-background shadow-sm">
                    0
                </span>
            </Link>
        );
    }

    return (
        <Link href="/cart" className="group relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground ring-2 ring-background shadow-sm animate-scale-in">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
            {itemCount === 0 && (
                <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground ring-2 ring-background shadow-sm">
                    0
                </span>
            )}
        </Link>
    );
}
