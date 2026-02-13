import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, Heart, ChevronDown, X, Sparkles } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getSession } from "@/lib/auth-utils";

export async function Header() {
    const session = await getSession();
    const categories = await prisma.category.findMany({
        take: 6,
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } }
    });

    return (
        <>
            {/* Announcement Bar */}
            <div className="relative bg-primary text-primary-foreground overflow-hidden">
                <div className="flex items-center justify-center h-9 text-xs font-medium tracking-wide">
                    <div className="flex items-center gap-2 animate-fade-in">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
                        <span className="mx-2 opacity-40">|</span>
                        <Link href="/products" className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity">
                            Mua ngay →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="group flex items-center space-x-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-110 transition-all duration-300 shadow-md">
                                <Heart className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-foreground">
                                Techno<span className="text-primary">Heart</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {/* Products Dropdown */}
                        <div className="group relative">
                            <Link
                                href="/products"
                                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/60"
                            >
                                Sản phẩm
                                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
                            </Link>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block pt-2 w-72 z-50">
                                <div className="rounded-2xl border border-border/60 bg-background/98 backdrop-blur-2xl p-2 shadow-2xl animate-scale-in">
                                    <div className="px-3 py-2 mb-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Danh mục</p>
                                    </div>
                                    {categories.map((cat: any) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.id}`}
                                            className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/5 rounded-xl group/item"
                                        >
                                            <span>{cat.name}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-full group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                                                {cat._count.products}
                                            </span>
                                        </Link>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="px-3 py-2.5 text-sm text-muted-foreground italic">Chưa có danh mục</p>
                                    )}
                                    <div className="section-divider my-1" />
                                    <Link
                                        href="/products"
                                        className="flex items-center px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-all"
                                    >
                                        Xem tất cả sản phẩm →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/news"
                            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/60"
                        >
                            Tin tức
                        </Link>
                        <Link
                            href="/contact"
                            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/60"
                        >
                            Liên hệ
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {/* Search */}
                        <div className="hidden lg:flex items-center relative group">
                            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="h-10 w-52 rounded-xl border border-border/60 bg-secondary/40 pl-10 pr-4 text-sm focus:w-72 transition-all duration-300 placeholder:text-muted-foreground/60"
                            />
                        </div>

                        <button className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-colors">
                            <Search className="h-5 w-5" />
                        </button>

                        <Link href="/cart" className="group relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-all">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground ring-2 ring-background shadow-sm">
                                0
                            </span>
                        </Link>

                        <Link
                            href={session ? "/account" : "/login"}
                            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-colors"
                        >
                            <User className="h-5 w-5" />
                        </Link>

                        <button className="md:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
