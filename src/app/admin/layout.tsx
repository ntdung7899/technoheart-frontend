"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Package,
    ShoppingBag,
    BarChart3,
    Users,
    Settings,
    ArrowLeft,
    Heart,
    LayoutDashboard,
    Bell,
    Search,
    ChevronRight
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
        { label: 'Sản phẩm', href: '/admin/products', icon: Package },
        { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Khách hàng', href: '/admin/users', icon: Users },
        { label: 'Báo cáo', href: '/admin/analytics', icon: BarChart3 },
    ];

    return (
        <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-zinc-200 hidden lg:flex flex-col sticky top-0 h-screen z-40">
                <div className="p-8">
                    <Link href="/" className="group flex items-center space-x-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-primary text-primary-foreground group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-primary/20">
                            <Heart className="h-6 w-6 fill-current" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-zinc-900">
                            TechnoHeart
                        </span>
                    </Link>
                </div>

                <div className="px-6 py-4 flex-1 space-y-8">
                    <div>
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Hệ thống</p>
                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${isActive
                                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <item.icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`} />
                                            {item.label}
                                        </div>
                                        {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div>
                        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Cấu hình</p>
                        <nav className="space-y-2">
                            <Link
                                href="/admin/settings"
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${pathname === '/admin/settings'
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                                    }`}
                            >
                                <Settings className="h-5 w-5 transition-transform group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                                Cài đặt
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="p-6 mt-auto">
                    <Link href="/" className="flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-zinc-500 bg-zinc-50 hover:text-primary hover:bg-primary/5 transition-all group border border-zinc-200">
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        Trang chủ cửa hàng
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-zinc-200 flex items-center justify-between px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative w-full max-w-lg hidden md:block group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhanh mọi thứ..."
                                className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium focus:border-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-zinc-200 hover:scale-105 active:scale-95 transition-all relative shadow-sm text-zinc-500">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-white"></span>
                        </button>

                        <div className="h-12 flex items-center gap-3 pl-2 pr-4 py-1 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-black text-xs shadow-inner">
                                AD
                            </div>
                            <div className="flex flex-col mr-1">
                                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 leading-none mb-0.5">Admin</span>
                                <span className="text-sm font-bold leading-none text-zinc-900">Quản trị viên</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-10 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
