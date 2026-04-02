import prisma from "@/lib/prisma";
import Link from "next/link";
import {
    Package,
    ShoppingBag,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal,
    MoveRight,
    Calendar,
    Users,
    BarChart3
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản trị hệ thống | Technoheart",
    description: "Trang quản trị cửa hàng Technoheart.",
};

export default async function AdminPage() {
    const productsCount = await prisma.product.count();
    const ordersCount = await prisma.order.count();
    const usersCount = await prisma.user.count();
    const recentOrders = await prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    // Calculate real revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthOrders, lastMonthOrders, allDelivered] = await Promise.all([
        prisma.order.findMany({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.order.findMany({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
        prisma.order.findMany({ where: { status: 'DELIVERED' } }),
    ]);

    const totalRevenue = allDelivered.reduce((s, o) => s + Number(o.total), 0);
    const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + Number(o.total), 0);
    const lastMonthRevenue = lastMonthOrders.reduce((s, o) => s + Number(o.total), 0);

    const revenueTrend = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;
    const ordersTrend = lastMonthOrders.length > 0 ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100) : 0;

    const thisMonthUsers = await prisma.user.count({ where: { createdAt: { gte: startOfMonth } } });
    const lastMonthUsers = await prisma.user.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } });
    const usersTrend = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers * 100) : 0;

    const thisMonthProducts = await prisma.product.count({ where: { createdAt: { gte: startOfMonth } } });
    const lastMonthProducts = await prisma.product.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } });
    const productsTrend = lastMonthProducts > 0 ? ((thisMonthProducts - lastMonthProducts) / lastMonthProducts * 100) : 0;

    const fmt = (n: number) => n >= 0 ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`;

    const stats = [
        {
            label: 'Tổng doanh thu',
            value: totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
            trend: fmt(revenueTrend),
            up: revenueTrend >= 0,
            icon: DollarSign,
            color: 'bg-emerald-50 text-emerald-600',
            gradient: 'from-emerald-50 to-transparent'
        },
        {
            label: 'Đơn hàng mới',
            value: ordersCount.toString(),
            trend: fmt(ordersTrend),
            up: ordersTrend >= 0,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
            gradient: 'from-blue-50 to-transparent'
        },
        {
            label: 'Khách hàng',
            value: usersCount.toString(),
            trend: fmt(usersTrend),
            up: usersTrend >= 0,
            icon: Users,
            color: 'bg-purple-50 text-purple-600',
            gradient: 'from-purple-50 to-transparent'
        },
        {
            label: 'Sản phẩm',
            value: productsCount.toString(),
            trend: fmt(productsTrend),
            up: productsTrend >= 0,
            icon: Package,
            color: 'bg-orange-50 text-orange-600',
            gradient: 'from-orange-50 to-transparent'
        },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tổng quan</h1>
                    <p className="text-slate-500 text-sm mt-1">Tóm tắt hoạt động cửa hàng tháng này.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                        Xuất dữ liệu
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Đơn hàng mới nhất</h2>
                        <Link href="/admin/orders" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
                            Xem tất cả <MoveRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Mã đơn</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Khách hàng</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Trạng thái</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Tổng tiền</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(recentOrders as any[]).map(order => (
                                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs text-slate-500 group-hover:text-primary transition-colors">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                                                        {(order.user.name || order.user.email).slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{order.user.name || order.user.email}</p>
                                                        <p className="text-[11px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${order.status === 'PENDING'
                                                    ? 'bg-amber-50 text-amber-700'
                                                    : 'bg-emerald-50 text-emerald-700'
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${order.status === 'PENDING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                                    {order.status === 'PENDING' ? 'Đang chờ' : order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="text-sm font-medium tabular-nums text-slate-900">
                                                    {Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100 text-slate-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                                    <ShoppingBag className="h-8 w-8 opacity-30" />
                                                    <p className="text-sm">Chưa có đơn hàng nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Hành động nhanh</h2>

                    <div className="space-y-2">
                        {[
                            { label: 'Thêm sản phẩm mới', icon: Package, href: '/admin/products/new', desc: 'Đăng tải sản phẩm mới lên website.' },
                            { label: 'Xem báo cáo', icon: BarChart3, href: '/admin/analytics', desc: 'Phân tích doanh thu và sản phẩm.' },
                            { label: 'Quản lý khách hàng', icon: Users, href: '/admin/users', desc: 'Xem danh sách người dùng.' },
                        ].map((action, idx) => (
                            <Link key={idx} href={action.href} className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-primary/30 transition-all">
                                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-slate-500 shrink-0">
                                    <action.icon className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{action.label}</p>
                                    <p className="text-xs text-slate-400 truncate">{action.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-5 rounded-xl bg-primary text-primary-foreground relative overflow-hidden">
                        <h3 className="text-base font-semibold mb-1 text-white">Cần trợ giúp?</h3>
                        <p className="text-white/70 text-sm mb-4">Xem tài liệu hướng dẫn hoặc liên hệ kỹ thuật.</p>
                        <button className="w-full h-9 rounded-lg bg-white text-primary text-sm font-medium hover:opacity-90 transition-opacity">
                            Xem tài liệu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
