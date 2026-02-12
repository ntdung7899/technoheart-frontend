import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from "lucide-react";

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
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 lg:px-8">
                {/* Navigation */}
                <div className="mb-8 items-center flex justify-between">
                    <Link
                        href="/products"
                        className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-border/50 group-hover:border-primary/50 group-hover:bg-primary/5">
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        </div>
                        Back to Collection
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-foreground font-semibold">{product.category.name}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="flex flex-col gap-6">
                            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/50 bg-white shadow-sm overflow-hidden">
                                {product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                        No Image Available
                                    </div>
                                )}
                                <div className="absolute left-6 top-6">
                                    <span className="rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                                        Featured
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 sm:gap-6">
                                {product.images.map((img, idx) => (
                                    <button key={idx} className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-white p-3 transition-all hover:border-primary/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
                                        <Image
                                            src={img}
                                            alt={`${product.name} ${idx + 1}`}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="flex flex-col">
                            {/* Product Header */}
                            <div className="mb-6 space-y-2">
                                <div className="flex items-center gap-2 font-medium text-primary text-sm uppercase tracking-wider">
                                    {product.category.name}
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'text-muted'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium underline-offset-4 hover:underline cursor-pointer">
                                        12 reviews
                                    </span>
                                    <div className="h-4 w-px bg-border/60"></div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        IN STOCK
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-8 rounded-2xl bg-secondary/30 p-6 border border-border/30">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                                        ${Number(product.price).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">Inc. VAT</span>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Or from $85.42/mo. for 24 mos. with 0% interest.
                                </p>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70 mb-3">Overview</h3>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Buy Section */}
                            <div className="mb-10 space-y-4">
                                <AddToCartButton product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    images: product.images
                                }} />
                                <p className="text-center text-xs text-muted-foreground">
                                    Secure checkout with encrypted payment protection.
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 border-t border-border/40 py-8">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-primary">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Express Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center border-x border-border/40">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-primary">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">2 Year Warranty</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-primary">
                                        <RefreshCw className="h-5 w-5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">30-Day Returns</span>
                                </div>
                            </div>

                            {/* Specifications Preview */}
                            <div className="rounded-2xl border border-border/50 bg-card p-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70 mb-4">Core Specifications</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="font-semibold">{product.category.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b border-border/30">
                                        <span className="text-muted-foreground">Availability</span>
                                        <span className="font-semibold text-green-600">{product.stock > 0 ? "In Stock" : "Limited"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="font-semibold">Free (Next Day)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
