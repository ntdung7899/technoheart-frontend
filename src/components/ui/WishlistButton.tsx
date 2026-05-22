"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
} from "@/lib/api/account";

interface WishlistButtonProps {
    productId: string;
    variant?: "icon" | "full";
    initialWishlisted?: boolean;
}

export function WishlistButton({
    productId,
    variant = "icon",
    initialWishlisted = false,
}: WishlistButtonProps) {
    const router = useRouter();
    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function checkWishlist() {
            const token = localStorage.getItem("technoheart_token");

            if (!token) {
                if (mounted) setChecked(true);
                return;
            }

            try {
                const wishlist = await getWishlist();

                const isInWishlist = wishlist.some(
                    (item) => item.productId === productId
                );

                if (mounted) {
                    setWishlisted(isInWishlist);
                }
            } catch (error) {
                console.error("CHECK_WISHLIST_ERROR:", error);
            } finally {
                if (mounted) {
                    setChecked(true);
                }
            }
        }

        checkWishlist();

        return () => {
            mounted = false;
        };
    }, [productId]);

    const toggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem("technoheart_token");

        if (!token) {
            router.push("/login");
            return;
        }

        setLoading(true);

        try {
            if (wishlisted) {
                await removeFromWishlist(productId);
                setWishlisted(false);
            } else {
                await addToWishlist(productId);
                setWishlisted(true);
            }

            window.dispatchEvent(new Event("wishlist-changed"));
        } catch (error) {
            console.error("TOGGLE_WISHLIST_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật yêu thích"
            );
        } finally {
            setLoading(false);
        }
    };

    if (variant === "full") {
        return (
            <button
                type="button"
                onClick={toggle}
                disabled={loading || !checked}
                className={`
                    flex items-center justify-center gap-2 rounded-lg font-semibold text-sm py-3 px-6 transition-all active:scale-[0.98] border-2 w-full
                    ${
                        wishlisted
                            ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"
                            : "bg-white text-zinc-600 border-zinc-200 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                    }
                    disabled:opacity-60 disabled:cursor-not-allowed
                `}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Heart
                        className={`h-4 w-4 transition-all ${
                            wishlisted
                                ? "fill-rose-500 text-rose-500 scale-110"
                                : ""
                        }`}
                    />
                )}

                <span>{wishlisted ? "Đã yêu thích" : "Yêu thích"}</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={loading || !checked}
            className={`
                flex h-9 w-9 items-center justify-center rounded-full transition-all
                ${
                    wishlisted
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
                <Heart
                    className={`h-4 w-4 transition-all ${
                        wishlisted ? "fill-white" : ""
                    }`}
                />
            )}
        </button>
    );
}