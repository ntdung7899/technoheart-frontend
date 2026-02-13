"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    UserCircle,
    MapPin,
    Gift,
    Shield,
    LogOut,
} from "lucide-react";

const navItems = [
    { label: "Tổng quan", href: "/account", icon: LayoutDashboard },
    { label: "Đơn hàng", href: "/account/orders", icon: ShoppingBag },
    { label: "Yêu thích", href: "/account/wishlist", icon: Heart },
    { label: "Hồ sơ", href: "/account/profile", icon: UserCircle },
    { label: "Địa chỉ", href: "/account/addresses", icon: MapPin },
    { label: "Ưu đãi", href: "/account/rewards", icon: Gift },
    { label: "Bảo mật", href: "/account/security", icon: Shield },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0">
                <div className="sticky top-20">
                    <nav className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-2 shadow-sm">
                        <ul className="space-y-0.5">
                            {navItems.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/account" && pathname.startsWith(item.href));
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all w-full"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl">
                <div className="flex items-center justify-around px-2 py-1">
                    {navItems.slice(0, 5).map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/account" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl text-[10px] font-medium transition-all ${isActive
                                        ? "text-primary"
                                        : "text-muted-foreground"
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
