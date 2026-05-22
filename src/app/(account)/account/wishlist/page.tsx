"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2, Trash2, ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/account/EmptyState";
import { formatPrice } from "@/lib/utils";
import {
  getWishlist,
  removeFromWishlist,
  type AccountWishlistItem,
} from "@/lib/api/account";

function resolveImageUrl(image?: string | null) {
  if (!image) return "/placeholder.png";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const cleanImage = image.replace(/^\/+/, "");

  return `${process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:3000"}/${cleanImage}`;
}

export default function WishlistPage() {
  const [items, setItems] = useState<AccountWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function loadWishlist() {
    try {
      const data = await getWishlist();
      console.log("ACCOUNT_WISHLIST_DATA:", data);
      setItems(data);
    } catch (error) {
      console.error("LOAD_WISHLIST_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);

      await removeFromWishlist(productId);

      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("REMOVE_WISHLIST_ERROR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Không thể xoá sản phẩm khỏi yêu thích"
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="Chưa có sản phẩm yêu thích"
        description="Bạn chưa lưu sản phẩm nào vào danh sách yêu thích."
        action={
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Khám phá sản phẩm
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Yêu thích</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item) => {
          const product = item.product;
          const imageUrl = resolveImageUrl(product.images?.[0]);
          const isRemoving = removingId === product.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border/60 bg-card p-4 flex items-center justify-between gap-4"
            >
              <Link
                href={`/products/${product.id}`}
                className="flex items-center gap-4 min-w-0 flex-1"
              >
                <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xl font-bold text-foreground">
                    {formatPrice(product.price)}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Còn hàng
                  </p>
                </div>
              </Link>

              <div className="flex flex-col items-center gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => handleRemove(product.id || item.productId)}
                  disabled={isRemoving}
                  className="text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
                  title="Xoá khỏi yêu thích"
                >
                  {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>

                <Link
                  href={`/products/${product.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Xem sản phẩm"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}