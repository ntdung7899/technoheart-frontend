"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Package,
    ShoppingBag,
    BarChart3,
    Users,
    ArrowLeft,
    Heart,
    LayoutDashboard,
    Bell,
    Search,
    LayoutGrid,
    Loader2,
    ShieldAlert,
    Newspaper,
    MessageSquare,
    TrendingUp,
    Menu,
    X,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
    ChevronDown,
    Wallet
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [authState, setAuthState] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved === 'true') setCollapsed(true);
    }, []);

    const toggleCollapsed = () => {
        setCollapsed(prev => {
            localStorage.setItem('admin-sidebar-collapsed', String(!prev));
            return !prev;
        });
    };

    useEffect(() => {
        if (pathname.startsWith('/admin/affiliate')) {
            setOpenMenus(prev => ({ ...prev, 'Affiliate': true }));
        }
    }, [pathname]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user?.role === 'ADMIN') {
                    setAuthState('authorized');
                } else {
                    setAuthState('unauthorized');
                    router.replace('/login');
                }
            })
            .catch(() => {
                setAuthState('unauthorized');
                router.replace('/login');
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/login');
    };

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (authState === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-slate-400">Đang xác thực...</p>
            </div>
        );
    }

    if (authState === 'unauthorized') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
                <ShieldAlert className="h-10 w-10 text-red-400" />
                <p className="text-sm font-medium text-slate-500">Bạn không có quyền truy cập trang này</p>
            </div>
        );
    }

    const navItems = [
        { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
        { label: 'Sản phẩm', href: '/admin/products', icon: Package },
        { label: 'Danh mục', href: '/admin/categories', icon: LayoutGrid },
        { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Tin tức', href: '/admin/news', icon: Newspaper },
        { 
            label: 'Affiliate', 
            icon: TrendingUp,
            prefix: '/admin/affiliate',
            children: [
                { label: 'Tổng quan', href: '/admin/affiliate', icon: LayoutDashboard },
                { label: 'Yêu cầu rút tiền', href: '/admin/affiliate/withdrawals', icon: Wallet },
            ]
        },
        { label: 'Khách hàng', href: '/admin/users', icon: Users },
        { label: 'Báo cáo', href: '/admin/analytics', icon: BarChart3 },
        { label: 'Liên hệ', href: '/admin/contact', icon: MessageSquare },
    ];

    const SidebarContent = ({ isCollapsed = false }: { isCollapsed?: boolean }) => (
        <>
            <div className={`${isCollapsed ? 'p-3 pb-4' : 'p-5 pb-6'}`}>
                <Link href="/" className="group flex items-center gap-2.5 justify-center lg:justify-start">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                        <Heart className="h-5 w-5 fill-current" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-lg font-bold text-white">
                            Technoheart
                        </span>
                    )}
                </Link>
            </div>

            <div className={`${isCollapsed ? 'px-2' : 'px-3'} flex-1 space-y-6 overflow-y-auto`}>
                <div>
                    {!isCollapsed && (
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Hệ thống</p>
                    )}
                    <nav className="space-y-0.5">
                        {navItems.map((item) => {
                            if (item.children) {
                                const isParentActive = pathname.startsWith(item.prefix || '');
                                const isOpen = openMenus[item.label];

                                return (
                                    <div key={item.label} className="space-y-0.5">
                                        <button
                                            onClick={() => {
                                                if (isCollapsed) toggleCollapsed();
                                                toggleMenu(item.label);
                                            }}
                                            className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                                                isParentActive
                                                    ? 'bg-white/5 text-white'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                                                <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${isParentActive ? 'text-primary' : ''}`} />
                                                {!isCollapsed && item.label}
                                            </div>
                                            {!isCollapsed && (
                                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </button>

                                        {isOpen && !isCollapsed && (
                                            <div className="pl-4 pr-3 py-1 space-y-0.5 border-l border-white/5 ml-5 mt-1">
                                                {item.children.map(child => {
                                                    const isChildActive = pathname === child.href;
                                                    return (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-medium transition-all ${
                                                                isChildActive
                                                                    ? 'bg-primary/10 text-primary'
                                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                            }`}
                                                        >
                                                            {/* HIỂN THỊ ICON CỦA MENU CON TẠI ĐÂY */}
                                                            {child.icon && <child.icon className="h-4 w-4 flex-shrink-0" />}
                                                            {child.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <item.icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                                    {!isCollapsed && item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            <div className={`${isCollapsed ? 'p-2' : 'p-3'} mt-auto border-t border-white/10 space-y-0.5`}>
                {!isCollapsed ? (
                    <>
                        <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
                            <ArrowLeft className="h-[18px] w-[18px] transition-transform group-hover:-translate-x-0.5" />
                            Trang chủ cửa hàng
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="h-[18px] w-[18px]" />
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/" title="Trang chủ cửa hàng" className="flex items-center justify-center px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                            <ArrowLeft className="h-[18px] w-[18px]" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            title="Đăng xuất"
                            className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="h-[18px] w-[18px]" />
                        </button>
                    </>
                )}
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <aside className="relative w-64 h-full bg-slate-900 flex flex-col">
                        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className={`${collapsed ? 'w-[68px]' : 'w-64'} bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen z-40 transition-all duration-300`}>
                <SidebarContent isCollapsed={collapsed} />
                <div className={`${collapsed ? 'px-2 pb-2' : 'px-3 pb-3'}`}>
                    <button
                        onClick={toggleCollapsed}
                        title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
                        className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} w-full px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-all`}
                    >
                        {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
                        {!collapsed && 'Thu gọn'}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="relative w-full max-w-md hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors relative text-slate-500">
                            <Bell className="h-[18px] w-[18px]" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>

                        <div className="h-9 flex items-center gap-2 pl-1.5 pr-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold text-[11px]">
                                AD
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}