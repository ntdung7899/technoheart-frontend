
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true },
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="mb-8">
                <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-white p-8">
                        {product.images.length > 0 ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="h-full w-full object-contain"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border bg-white p-2 cursor-pointer hover:border-primary">
                                <Image
                                    src={img}
                                    alt={`${product.name} ${idx + 1}`}
                                    width={100}
                                    height={100}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-3xl font-bold tracking-tight text-primary">${Number(product.price)}</p>
                            <div className="flex items-center space-x-1 text-yellow-500">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="font-medium">4.8</span>
                                <span className="text-muted-foreground text-sm ml-1">(12 reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Category: {product.category.name}</li>
                            <li>Stock: {product.stock > 0 ? "In Stock" : "Out of Stock"}</li>
                            <li>Free shipping on all orders</li>
                            <li>30-day money-back guarantee</li>
                        </ul>
                    </div>

                    <div className="pt-6">
                        <AddToCartButton product={product} />
                    </div>

                    {/* Specs (Placeholder) */}
                    <div className="pt-8 border-t">
                        <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                            <div className="border-b pb-2">
                                <span className="font-medium">Brand</span>
                                <span className="block text-muted-foreground text-sm">TechnoHeart</span>
                            </div>
                            <div className="border-b pb-2">
                                <span className="font-medium">Warranty</span>
                                <span className="block text-muted-foreground text-sm">1 Year Official</span>
                            </div>
                            {/* Add more mock specs based on category later */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
