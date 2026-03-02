import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, ChevronDown, Sparkles } from 'lucide-react';
import { SearchModal } from '@/components/ui/SearchModal';
import prisma from '@/lib/prisma';
import { getSession } from "@/lib/auth-utils";
import { CartIcon } from './CartIcon';

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
            <div
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, #1E3A5F 0%, #1a3260 50%, #1E3A5F 100%)' }}
            >
                <div className="flex items-center justify-center h-9 text-xs font-medium tracking-wide">
                    <div className="flex items-center gap-2 animate-fade-in" style={{ color: '#93C5FD' }}>
                        <Sparkles className="h-3.5 w-3.5" style={{ color: '#FACC15' }} />
                        <span>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
                        <span className="mx-2 opacity-40">|</span>
                        <Link
                            href="/products"
                            className="font-bold underline underline-offset-2 transition-opacity hover:opacity-80"
                            style={{ color: '#FACC15' }}
                        >
                            Mua ngay →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="th-header sticky top-0 z-50 w-full">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="group flex items-center transition-all duration-300 group-hover:opacity-80">
                            <Image
                                src="/logo-techno-web.png"
                                alt="TechnoHeart Logo"
                                width={160}
                                height={48}
                                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {/* Products Dropdown */}
                        <div className="group relative">
                            <Link
                                href="/products"
                                className="th-nav-link flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all"
                            >
                                Sản phẩm
                                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
                            </Link>
                            {/* Dropdown */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block pt-2 w-72 z-50">
                                <div
                                    className="rounded-2xl p-2 animate-scale-in"
                                    style={{
                                        background: 'rgba(10,22,40,0.96)',
                                        border: '1px solid rgba(59,130,246,0.2)',
                                        backdropFilter: 'blur(24px)',
                                        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <div className="px-3 py-2 mb-1">
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-widest"
                                            style={{ color: '#FACC15' }}
                                        >
                                            Danh mục
                                        </p>
                                    </div>
                                    {categories.map((cat: any) => (
                                        <Link
                                            key={cat.id}
                                            href={`/products?category=${cat.id}`}
                                            className="th-dropdown-item flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all group/item"
                                        >
                                            <span>{cat.name}</span>
                                            <span
                                                className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
                                                style={{
                                                    background: 'rgba(59,130,246,0.15)',
                                                    color: '#60A5FA',
                                                }}
                                            >
                                                {cat._count.products}
                                            </span>
                                        </Link>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="px-3 py-2.5 text-sm italic" style={{ color: '#93C5FD' }}>
                                            Chưa có danh mục
                                        </p>
                                    )}
                                    <div
                                        className="my-1"
                                        style={{ height: '1px', background: 'rgba(59,130,246,0.1)' }}
                                    />
                                    <Link
                                        href="/products"
                                        className="flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all"
                                        style={{ color: '#60A5FA' }}
                                    >
                                        Xem tất cả sản phẩm →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/news"
                            className="th-nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all"
                        >
                            Tin tức
                        </Link>
                        <Link
                            href="/contact"
                            className="th-nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all"
                        >
                            Liên hệ
                        </Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {/* Search */}
                        <SearchModal variant="compact" />
                        <SearchModal variant="icon" />

                        <CartIcon />

                        <Link
                            href={session ? "/account" : "/login"}
                            className="th-icon-btn p-2.5 rounded-xl transition-colors"
                        >
                            <User className="h-5 w-5" />
                        </Link>

                        <button className="md:hidden th-icon-btn p-2.5 rounded-xl transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
