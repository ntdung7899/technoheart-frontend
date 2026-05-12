"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Loader2, Trash2 } from "lucide-react";
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
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">
        Sản phẩm yêu thích
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => {
          const product = item.product;
          const imageUrl = resolveImageUrl(product.images?.[0]);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-all"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-44 bg-slate-50">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-lg font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>

              <div className="px-4 pb-4 flex items-center justify-between gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Xem chi tiết
                </Link>

                <button
                  type="button"
                  onClick={() => handleRemove(product.id)}
                  disabled={removingId === product.id}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  {removingId === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}