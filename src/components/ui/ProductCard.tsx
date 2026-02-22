import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, TrendingUp } from 'lucide-react';
import { Product, Category } from '@prisma/client';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';

interface ProductWithCategory extends Product {
    category: Category;
}

interface ProductCardProps {
    product: ProductWithCategory;
    featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
    // Fake rating for demo, seeded by product id hash
    const rating = 4.2 + (product.id.charCodeAt(0) % 10) / 14;
    const reviews = 100 + (product.id.charCodeAt(1) % 900);

    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="product-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-card border border-border/40">

                {/* Image Area */}
                <div className="product-card-image relative overflow-hidden bg-gradient-to-br from-secondary/40 to-secondary/10"
                    style={{ aspectRatio: '1 / 1' }}>

                    {/* Subtle background glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: 'radial-gradient(circle at center, rgba(37,99,235,0.06) 0%, transparent 70%)' }} />

                    {product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground/20">
                            <ShoppingCart className="h-14 w-14" strokeWidth={1} />
                        </div>
                    )}

                    {/* Top-left: Category badge */}
                    <div className="absolute left-3 top-3 z-20">
                        <span className="inline-flex items-center rounded-lg bg-background/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-border/30 text-muted-foreground shadow-sm">
                            {product.category.name}
                        </span>
                    </div>

                    {/* Top-right: Wishlist */}
                    <div className="absolute right-3 top-3 z-30">
                        <WishlistButton productId={product.id} variant="icon" />
                    </div>

                    {/* Hot badge */}
                    {(product.id.charCodeAt(0) % 3 === 0) && (
                        <div className="absolute left-3 bottom-3 z-20">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
                                <TrendingUp className="h-3 w-3" />
                                HOT
                            </span>
                        </div>
                    )}

                    {/* Hover CTA overlay */}
                    <div className="product-card-overlay absolute inset-0 z-20 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 pointer-events-none">
                        <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold shadow-xl shadow-primary/30 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Xem chi tiết
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 gap-3">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-3 w-3"
                                    fill={i < Math.round(rating) ? '#f59e0b' : 'transparent'}
                                    stroke={i < Math.round(rating) ? '#f59e0b' : '#d1d5db'}
                                    strokeWidth={1.5}
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium">{rating.toFixed(1)}</span>
                        <span className="text-[11px] text-muted-foreground/60">({reviews})</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 flex-1">
                        {product.name}
                    </h3>

                    {/* Price row */}
                    <div className="flex items-center justify-between pt-2.5 mt-auto border-t border-border/30">
                        <div>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Giá bán</p>
                            <p className="text-base font-extrabold text-primary tracking-tight">
                                {formatPrice(Number(product.price))}
                            </p>
                        </div>

                        <button
                            className="product-card-btn flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25"
                            aria-label="Thêm vào giỏ hàng"
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
