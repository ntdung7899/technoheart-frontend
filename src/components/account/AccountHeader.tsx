"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    ShoppingBag,
    Heart,
    UserCircle,
    MapPin,
    Gift,
    Shield,
    TrendingUp,
    Bell,
    Store,
} from "lucide-react";

const pageTitles: Record<string, { label: string; icon: typeof LayoutDashboard }> = {
    "/account": { label: "Tổng quan", icon: LayoutDashboard },
    "/account/orders": { label: "Đơn hàng", icon: ShoppingBag },
    "/account/wishlist": { label: "Yêu thích", icon: Heart },
    "/account/affiliate": { label: "Affiliate", icon: TrendingUp },
    "/account/profile": { label: "Hồ sơ", icon: UserCircle },
    "/account/addresses": { label: "Địa chỉ", icon: MapPin },
    "/account/rewards": { label: "Ưu đãi", icon: Gift },
    "/account/security": { label: "Bảo mật", icon: Shield },
};

function getPageInfo(pathname: string) {
    if (pageTitles[pathname]) return pageTitles[pathname];
    for (const key of Object.keys(pageTitles)) {
        if (key !== "/account" && pathname.startsWith(key)) return pageTitles[key];
    }
    return { label: "Tài khoản", icon: LayoutDashboard };
}

interface UserInfo {
    name: string;
    email: string;
}

export function AccountHeader() {
    const pathname = usePathname();
    const page = getPageInfo(pathname);
    const Icon = page.icon;
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => {
                if (r.status === 401) { window.location.href = "/login"; return null; }
                return r.ok ? r.json() : null;
            })
            .then((d) => { if (d?.user) setUser({ name: d.user.name, email: d.user.email }); })
            .catch(() => {});
    }, []);

    const initials = user?.name
        ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    return (
        <header className="hidden lg:flex items-center justify-between h-16 border-b border-slate-200 bg-white px-8 shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <h1 className="text-sm font-semibold text-slate-900">{page.label}</h1>
            </div>

            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <Store className="h-3.5 w-3.5" />
                    Cửa hàng
                </Link>
                <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                    <Bell className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-[11px] font-bold text-white">
                        {initials}
                    </div>
                    {user && (
                        <div className="text-right">
                            <p className="text-xs font-medium text-slate-900 leading-none">{user.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
