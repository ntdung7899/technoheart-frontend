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
                            <div className="group relative aspect-square w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
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
                                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                                    <div className="h-1 w-6 bg-primary rounded-full"></div>
                                    Chi tiết
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900">Mô tả sản phẩm</h2>
                            </div>

                            <div
                                className="product-description text-base text-zinc-600 leading-relaxed overflow-hidden break-words"
                                style={{ overflowWrap: "anywhere" }}
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                            <style>{`
                                .product-description { word-break: break-word; }
                                .product-description h1 { font-size: 1.5em; font-weight: 700; color: rgb(24 24 27); margin: 1em 0 0.5em; }
                                .product-description h2 { font-size: 1.25em; font-weight: 700; color: rgb(24 24 27); margin: 0.8em 0 0.4em; }
                                .product-description h3 { font-size: 1.1em; font-weight: 600; color: rgb(39 39 42); margin: 0.6em 0 0.3em; }
                                .product-description p { margin-bottom: 0.6em; line-height: 1.75; }
                                .product-description strong, .product-description b { font-weight: 700; color: rgb(39 39 42); }
                                .product-description em, .product-description i { font-style: italic; }
                                .product-description u { text-decoration: underline; }
                                .product-description s { text-decoration: line-through; }
                                .product-description ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
                                .product-description ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
                                .product-description li { margin-bottom: 0.25em; }
                                .product-description blockquote {
                                    border-left: 3px solid hsl(var(--primary));
                                    padding: 0.5em 1em;
                                    margin: 0.8em 0;
                                    color: rgb(113 113 122);
                                    background: rgb(250 250 250);
                                    border-radius: 0 0.5rem 0.5rem 0;
                                }
                                .product-description a { color: hsl(var(--primary)); text-decoration: underline; }
                                .product-description a:hover { opacity: 0.8; }
                                .product-description img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1em 0; }
                                .product-description .ql-align-center { text-align: center; }
                                .product-description .ql-align-right { text-align: right; }
                                .product-description .ql-align-justify { text-align: justify; }
                                .product-description .ql-indent-1 { padding-left: 3em; }
                                .product-description .ql-indent-2 { padding-left: 6em; }
                                .product-description .ql-indent-3 { padding-left: 9em; }
                            `}</style>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
