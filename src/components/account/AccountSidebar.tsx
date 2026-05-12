"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    UserCircle,
    MapPin,
    Gift,
    Shield,
    LogOut,
    TrendingUp,
    ChevronsLeft,
    ChevronsRight,
    Store,
    ChevronDown,
    Wallet       
} from "lucide-react";

const navItems = [
    { label: "Tổng quan", href: "/account", icon: LayoutDashboard },
    { label: "Đơn hàng", href: "/account/orders", icon: ShoppingBag },
    { label: "Yêu thích", href: "/account/wishlist", icon: Heart },
    { 
        label: "Affiliate", 
        href: "/account/affiliate", 
        icon: TrendingUp,
        children: [
            { label: "Tổng quan", href: "/account/affiliate", icon: LayoutDashboard },
            { label: "Lịch sử rút tiền", href: "/account/affiliate/withdrawals", icon: Wallet },
        ]
    },
    { label: "Hồ sơ", href: "/account/profile", icon: UserCircle },
    { label: "Địa chỉ", href: "/account/addresses", icon: MapPin },
    // { label: "Ưu đãi", href: "/account/rewards", icon: Gift },
    { label: "Bảo mật", href: "/account/security", icon: Shield },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    // State quản lý việc đóng/mở menu con
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = localStorage.getItem("account-sidebar-collapsed");
        if (saved === "true") setCollapsed(true);
    }, []);

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            localStorage.setItem("account-sidebar-collapsed", String(!prev));
            return !prev;
        });
    };

    // Tự động mở menu Affiliate nếu người dùng đang ở trong trang Affiliate
    useEffect(() => {
        if (pathname.startsWith('/account/affiliate')) {
            setOpenMenus(prev => ({ ...prev, 'Affiliate': true }));
        }
    }, [pathname]);

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const handleLogout = async () => {
        await logout();

        router.replace("/login");
        router.refresh();
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col shrink-0 border-r border-th-blue/10 bg-th-dark transition-all duration-300 ${collapsed ? "w-17" : "w-60"}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo / Brand */}
                    <div className={`flex items-center h-20 border-b border-th-blue/10 px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
                        <Link href="/" className="flex items-center gap-2.5 shrink-0">
                            <Image src="/logo-techno-web.png" alt="Technoheart" width={64} height={64} className="rounded-lg" />
                            {!collapsed && (
                                <span className="text-sm font-bold text-white tracking-tight">Technoheart</span>
                            )}
                        </Link>
                    </div>

                    {/* Back to shop */}
                    <div className={`px-3 pt-4 pb-2 ${collapsed ? "px-2" : ""}`}>
                        <Link
                            href="/"
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-th-muted hover:text-th-blue-lt hover:bg-th-blue/5 transition-all text-xs font-medium ${collapsed ? "justify-center px-0" : ""}`}
                        >
                            <Store className="h-3.5 w-3.5 shrink-0" />
                            {!collapsed && <span>Quay lại cửa hàng</span>}
                        </Link>
                    </div>

                    {/* Nav Label */}
                    {!collapsed && (
                        <p className="px-6 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-th-muted/40">
                            Tài khoản
                        </p>
                    )}

                    {/* Navigation */}
                    <nav className={`flex-1 overflow-y-auto py-1 ${collapsed ? "px-2" : "px-3"}`}>
                        <ul className="space-y-0.5">
                            {navItems.map((item) => {
                                const isParentActive = pathname.startsWith(item.href);
                                const Icon = item.icon;

                                // XỬ LÝ NẾU MENU CÓ ITEM CON (CHILDREN)
                                if (item.children) {
                                    const isOpen = openMenus[item.label];

                                    return (
                                        <li key={item.href} className="space-y-0.5">
                                            <button
                                                onClick={() => {
                                                    if (collapsed) toggleCollapsed();
                                                    toggleMenu(item.label);
                                                }}
                                                className={`flex items-center w-full justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${collapsed ? "justify-center px-0" : ""} ${
                                                    isParentActive
                                                        ? "bg-th-blue/15 text-th-blue-lt"
                                                        : "text-th-muted hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                                                    <Icon className="h-4 w-4 shrink-0" />
                                                    {!collapsed && item.label}
                                                </div>
                                                {!collapsed && (
                                                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                                                )}
                                            </button>

                                            {/* Render menu con */}
                                            {isOpen && !collapsed && (
                                                <ul className="pl-4 pr-3 py-1 space-y-0.5 border-l border-white/5 ml-5 mt-1">
                                                    {item.children.map(child => {
                                                        const isChildActive = pathname === child.href;
                                                        const ChildIcon = child.icon;
                                                        return (
                                                            <li key={child.href}>
                                                                <Link
                                                                    href={child.href}
                                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                                                        isChildActive
                                                                            ? "bg-th-blue/10 text-th-blue-lt"
                                                                            : "text-th-muted hover:text-white hover:bg-white/5"
                                                                    }`}
                                                                >
                                                                    {ChildIcon && <ChildIcon className="h-3.5 w-3.5 shrink-0" />}
                                                                    {child.label}
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                }

                                // XỬ LÝ NẾU LÀ MENU BÌNH THƯỜNG
                                const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
                                
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${collapsed ? "justify-center px-0" : ""} ${isActive
                                                ? "bg-th-blue/15 text-th-blue-lt"
                                                : "text-th-muted hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4 shrink-0" />
                                            {!collapsed && item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer: Logout + Collapse */}
                    <div className={`border-t border-th-blue/10 p-3 space-y-1 ${collapsed ? "px-2" : ""}`}>
                        <button
                            onClick={handleLogout}
                            title={collapsed ? "Đăng xuất" : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-th-muted hover:text-red-400 hover:bg-red-500/10 transition-all w-full ${collapsed ? "justify-center px-0" : ""}`}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {!collapsed && "Đăng xuất"}
                        </button>
                        <button
                            onClick={toggleCollapsed}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-th-muted/50 hover:text-th-muted hover:bg-white/5 transition-all w-full ${collapsed ? "justify-center px-0" : ""}`}
                        >
                            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
                            {!collapsed && "Thu gọn"}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-th-blue/15 bg-th-dark/95 backdrop-blur-xl pb-safe">
                <div className="flex items-center justify-around px-2 py-1.5">
                    {navItems.slice(0, 5).map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${isActive
                                    ? "text-th-blue-lt"
                                    : "text-th-muted/60"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}