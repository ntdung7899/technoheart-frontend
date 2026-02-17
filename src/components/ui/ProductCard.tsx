import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product, Category } from '@prisma/client';
import { formatPrice } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';


interface ProductWithCategory extends Product {
    category: Category;
}

interface ProductCardProps {
    product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 card-hover">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20">
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105">
                        {product.images.length > 0 ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-contain p-6"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                                <ShoppingBag className="h-12 w-12" />
                            </div>
                        )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute left-3 top-3 z-20">
                        <span className="inline-flex items-center rounded-lg bg-background/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border border-border/50 text-muted-foreground">
                            {product.category.name}
                        </span>
                    </div>

                    {/* Wishlist Button */}
                    <div className="absolute right-3 top-3 z-30">
                        <WishlistButton productId={product.id} variant="icon" />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-xs font-bold shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Xem chi tiết
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                    <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-base leading-tight transition-colors group-hover:text-primary line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/40">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Giá</span>
                            <span className="text-lg font-bold tracking-tight text-primary">
                                {formatPrice(Number(product.price))}
                            </span>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
