import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from "lucide-react";
import { ProductBuySection } from "@/components/ui/ProductBuySection";

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
        <div className="min-h-screen bg-background text-foreground">
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
                        Quay lại bộ sưu tập
                    </Link>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-foreground font-semibold">
                            {product.category.name}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="flex flex-col gap-6">
                            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-border/50 bg-white shadow-sm">
                                {product.images.length > 0 ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-10 transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-secondary/20 text-muted-foreground/40">
                                        Không có ảnh
                                    </div>
                                )}
                                <div className="absolute left-8 top-8">
                                    <span className="rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                                        Nổi bật
                                    </span>
                                </div>
                            </div>

                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((img: string, idx: number) => (
                                        <button key={idx} className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-white p-2 transition-all hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                                            <Image
                                                src={img}
                                                alt={`${product.name} ${idx + 1}`}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="flex flex-col lg:sticky lg:top-28">
                            {/* Product Header */}
                            <div className="mb-8 space-y-3">
                                <div className="flex items-center gap-2 font-black text-primary text-[10px] uppercase tracking-[0.2em]">
                                    <div className="h-1 w-4 bg-primary rounded-full"></div>
                                    {product.category.name}
                                </div>
                                <h1 className="text-4xl font-black tracking-tightest text-foreground lg:text-5xl leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'fill-current' : 'text-muted'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground font-bold underline underline-offset-4 decoration-border hover:text-primary transition-colors cursor-pointer">
                                        12 đánh giá
                                    </span>
                                    <div className="h-4 w-px bg-border/60"></div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Còn hàng
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-10 rounded-[2.5rem] bg-secondary/20 p-8 border border-border/30 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                    <div className="h-20 w-20 rounded-full border-8 border-primary"></div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tightest text-foreground">
                                        {Number(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                                    Giá niêm yết (Đã bao gồm VAT)
                                </p>
                            </div>

                            {/* Description */}
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">Tổng quan</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                    {product.description}
                                </p>
                            </div>

                            {/* Buy Section */}
                            <div className="mb-12">
                                <ProductBuySection product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    images: product.images
                                }} />
                                <p className="mt-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                    Đảm bảo chính hãng & Bảo mật thanh toán
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 border-t border-border/40 py-10">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 text-primary shadow-sm">
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Giao hàng<br />siêu tốc</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center border-x border-border/40">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 text-primary shadow-sm">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Bảo hành<br />24 tháng</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 text-primary shadow-sm">
                                        <RefreshCw className="h-6 w-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">30 Ngày<br />đổi trả</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
