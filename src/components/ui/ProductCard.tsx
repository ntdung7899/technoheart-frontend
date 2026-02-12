
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Product, Category } from '@prisma/client';

interface ProductWithCategory extends Product {
    category: Category;
}

interface ProductCardProps {
    product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md h-full flex flex-col">
                <div className="p-6 flex-1 flex flex-col items-center">
                    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white p-4 mb-4">
                        {product.images.length > 0 ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="object-contain w-full h-full transition-transform group-hover:scale-105 duration-300"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="w-full text-left space-y-1">
                        <p className="text-sm text-muted-foreground">{product.category.name}</p>
                        <h3 className="font-semibold text-lg leading-tight group-hover:underline decoration-primary/50 underline-offset-4">
                            {product.name}
                        </h3>
                    </div>
                </div>
                <div className="p-6 pt-0 flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold">${Number(product.price)}</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
