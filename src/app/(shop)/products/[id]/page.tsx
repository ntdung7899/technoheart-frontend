import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";

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
            <div className="container mx-auto px-4 py-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground animate-fade-in">
                    <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href={`/products?category=${product.categoryId}`} className="hover:text-primary transition-colors">
                        {product.category.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-7 xl:col-span-7">
                        <div className="flex flex-col gap-4 animate-fade-in-up">
                            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm">
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
                                <div className="absolute left-4 top-4">
                                    <span className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur-md">
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
                    <div className="lg:col-span-5 xl:col-span-5">
                        <div className="flex flex-col lg:sticky lg:top-28 animate-slide-in-right">
                            {/* Product Header */}
                            <div className="mb-5 space-y-2">
                                <Link
                                    href={`/products?category=${product.categoryId}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-colors"
                                >
                                    {product.category.name}
                                </Link>
                                <h1 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 pt-1">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : 'text-muted-foreground/30'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground font-medium">
                                        12 đánh giá
                                    </span>
                                    <div className="h-4 w-px bg-border" />
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Còn hàng
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6 rounded-xl bg-secondary/40 p-5 border border-border/40">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold tracking-tight text-primary">
                                        ${Number(product.price).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">Đã bao gồm VAT</span>
                                </div>
                                <p className="mt-1.5 text-xs text-muted-foreground">
                                    Hoặc từ $85.42/tháng trong 24 tháng với lãi suất 0%.
                                </p>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Tổng quan</h3>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Buy Section */}
                            <div className="mb-8 space-y-3">
                                <AddToCartButton product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    images: product.images
                                }} />
                                <p className="text-center text-xs text-muted-foreground">
                                    Thanh toán an toàn với bảo mật SSL 256-bit.
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 border-t border-border/40 py-6">
                                {[
                                    { icon: Truck, label: "Giao hàng nhanh" },
                                    { icon: ShieldCheck, label: "Bảo hành 2 năm" },
                                    { icon: RefreshCw, label: "30 ngày đổi trả" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2 text-center">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Specifications */}
                            <div className="rounded-xl border border-border/50 bg-card p-5">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Thông số cơ bản</h3>
                                <div className="space-y-0">
                                    {[
                                        { label: "Danh mục", value: product.category.name },
                                        { label: "Tình trạng", value: product.stock > 0 ? "Còn hàng" : "Hết hàng", isGreen: product.stock > 0 },
                                        { label: "Vận chuyển", value: "Miễn phí (Ngày mai)", last: true },
                                    ].map((spec: any, idx: number) => (
                                        <div key={idx} className={`flex justify-between text-sm py-2.5 ${spec.last ? '' : 'border-b border-border/30'}`}>
                                            <span className="text-muted-foreground">{spec.label}</span>
                                            <span className={`font-semibold ${spec.isGreen ? 'text-green-600' : ''}`}>{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
