import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, CheckCircle2, ChevronRight, Heart, Apple, Search } from "lucide-react";
import { ProductBuySection } from "@/components/ui/ProductBuySection";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { formatPrice } from "@/lib/utils";

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
        <div className="min-h-screen bg-white text-foreground">
            <div className="container mx-auto px-4 py-4 lg:px-8 max-w-[1200px]">
                {/* Navigation */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/products"
                        className="group inline-flex items-center text-sm font-medium text-zinc-700 transition-colors hover:text-primary gap-2"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Quay lại {product.category.name.toLowerCase()}
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <Link href="/products" className="hover:text-primary transition-colors">{product.category.name}</Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="text-zinc-800 font-medium">
                            {product.name}
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 mb-8">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-5">
                        <div className="flex flex-col gap-4">
                            {/* Main Image */}
                            <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                                {product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-zinc-400">
                                        Không có ảnh
                                    </div>
                                )}
                                {/* Zoom icon */}
                                <button className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 text-zinc-500 hover:text-primary hover:border-primary/50 transition-colors shadow-sm">
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Thumbnail Gallery */}
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2.5">
                                    {product.images.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white p-1.5 transition-all hover:border-primary/60 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${idx === 0 ? 'border-primary shadow-sm' : 'border-zinc-200'}`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                className="object-contain p-1.5"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-col">
                            {/* Category Badge */}
                            <div className="mb-3">
                                <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                                    <span className="font-bold text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded-md text-xs">{product.category.name}</span>
                                    <span className="text-zinc-400">/</span>
                                    <span className="text-zinc-500">Sample Product</span>
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 className="text-2xl font-bold text-zinc-900 lg:text-3xl leading-tight mb-3">
                                {product.name}{' '}
                                <span className="text-zinc-400 font-normal text-xl lg:text-2xl">256GB</span>
                            </h1>

                            {/* Rating & Stock */}
                            <div className="flex items-center gap-3 flex-wrap mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-300'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-zinc-500">(4.8 / 5)</span>
                                <span className="text-sm text-zinc-500">
                                    👍 <span className="font-semibold">97%</span> khách hàng hài lòng
                                </span>
                                <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Còn hàng
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="pb-6 mb-6 border-b border-zinc-200">
                                <span className="text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
                                    {formatPrice(Number(product.price))}
                                </span>
                            </div>

                            {/* Product Info Cards */}
                            <div className="space-y-3.5 mb-8">
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>{product.warranty}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <Truck className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>{product.shippingInfo}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <RefreshCw className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span>{product.returnPolicy}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-600">
                                    <Apple className="h-5 w-5 text-zinc-700 flex-shrink-0" />
                                    <span>Xuất xứ: <span className="font-semibold text-zinc-800">{product.origin}</span></span>
                                </div>
                            </div>

                            {/* Buy Section */}
                            <div className="mb-4">
                                <ProductBuySection product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    images: product.images
                                }} />
                            </div>

                            {/* Wishlist Button */}
                            <div className="mb-4">
                                <WishlistButton productId={product.id} variant="full" />
                            </div>

                            {/* Bottom text */}
                            <div className="pt-4 border-t border-zinc-100">
                                <p className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Đảm bảo chính hãng & Bảo mật thanh toán
                                    <Heart className="h-3.5 w-3.5 text-zinc-300" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Width Description Section */}
                <div className="mt-12 pt-10 border-t border-zinc-200">
                    <div className="max-w-4xl">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                    <div className="h-1 w-6 bg-primary rounded-full"></div>
                                    Chi tiết
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900">Mô tả sản phẩm</h2>
                            </div>

                            <div className="prose prose-zinc max-w-none">
                                <p className="text-base text-zinc-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
