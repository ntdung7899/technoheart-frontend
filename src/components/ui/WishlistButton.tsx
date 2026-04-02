"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
    productId: string;
    variant?: "icon" | "full";
    initialWishlisted?: boolean;
}

export function WishlistButton({ productId, variant = "icon", initialWishlisted = false }: WishlistButtonProps) {
    const router = useRouter();
    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    // Check if product is already in wishlist on mount
    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const res = await fetch("/api/account/wishlist");
                if (res.ok) {
                    const data = await res.json();
                    const isInWishlist = data.wishlist?.some(
                        (item: any) => item.productId === productId
                    );
                    setWishlisted(isInWishlist);
                }
            } catch {
                // Not logged in or error — ignore
            } finally {
                setChecked(true);
            }
        };
        checkWishlist();
    }, [productId]);

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);

        try {
            if (wishlisted) {
                const res = await fetch(`/api/account/wishlist?productId=${productId}`, {
                    method: "DELETE",
                });
                if (res.ok) setWishlisted(false);
                else if (res.status === 401) {
                    router.push("/login");
                    return;
                }
            } else {
                const res = await fetch("/api/account/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId }),
                });
                if (res.ok || res.status === 409) setWishlisted(true);
                else if (res.status === 401) {
                    router.push("/login");
                    return;
                }
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    if (variant === "full") {
        return (
            <button
                onClick={toggle}
                disabled={loading}
                className={`
                    flex items-center justify-center gap-2 rounded-lg font-semibold text-sm py-3 px-6 transition-all active:scale-[0.98] border-2 w-full
                    ${wishlisted
                        ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"
                        : "bg-white text-zinc-600 border-zinc-200 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                    }
                    disabled:opacity-60 disabled:cursor-not-allowed
                `}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Heart className={`h-4 w-4 transition-all ${wishlisted ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
                )}
                <span>{wishlisted ? "Đã yêu thích" : "Yêu thích"}</span>
            </button>
        );
    }

    // Icon variant (for ProductCard overlay)
    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={`
                flex h-9 w-9 items-center justify-center rounded-full transition-all
                ${wishlisted
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110"
                    : "bg-white/90 backdrop-blur-sm text-zinc-400 hover:text-rose-500 border border-zinc-200/60 shadow-sm hover:shadow-md"
                }
                disabled:opacity-60
            `}
            title={wishlisted ? "Bỏ yêu thích" : "Yêu thích"}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Heart className={`h-4 w-4 transition-all ${wishlisted ? "fill-white" : ""}`} />
            )}
        </button>
    );
}
