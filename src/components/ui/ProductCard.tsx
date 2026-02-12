import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Product, Category } from '@prisma/client';

interface ProductWithCategory extends Product {
    category: Category;
}

interface ProductCardProps {
    product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-110">
                        {product.images.length > 0 ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-contain p-6"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                <ShoppingBag className="h-10 w-10 opacity-20" />
                            </div>
                        )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute left-3 top-3 z-20">
                        <span className="inline-flex items-center rounded-full bg-background/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm border border-border/50">
                            {product.category.name === 'Phones' ? 'Điện thoại' :
                                product.category.name === 'Laptops' ? 'Laptop' :
                                    product.category.name === 'Accessories' ? 'Phụ kiện' : product.category.name}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                    <div className="flex-1 space-y-1.5">
                        <h3 className="font-semibold text-lg leading-tight transition-colors group-hover:text-primary">
                            {product.name}
                        </h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Giá</span>
                            <span className="text-lg font-bold tracking-tight">
                                ${Number(product.price).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
