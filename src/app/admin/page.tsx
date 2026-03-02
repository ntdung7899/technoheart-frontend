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
        <div className="space-y-12 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Bảng điều khiển
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Tổng quan dữ liệu</h1>
                    <p className="text-zinc-500 font-medium text-lg">Chào buổi sáng, Quản trị viên. Đây là tóm tắt hoạt động của cửa hàng.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50">
                    <div className="px-5 py-3 flex items-center gap-3 border-r border-zinc-200">
                        <Calendar className="h-5 w-5 text-zinc-400" />
                        <span className="text-sm font-black text-zinc-900">12 Tháng 2, 2026</span>
                    </div>
                    <button className="h-11 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                        Xuất dữ liệu
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="relative group p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/30 overflow-hidden transition-all hover:border-primary/30 hover:-translate-y-1">
                        <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity blur-3xl -mr-16 -mt-16`}></div>

                        <div className="relative space-y-6">
                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${stat.color} shadow-sm border border-current opacity-20`}>
                                <stat.icon className="h-8 w-8 opacity-100" />
                            </div>
                            {/* Adjustment for icon box since color includes bg which we want soft but icon sharp */}
                            <div className={`absolute left-8 top-8 h-16 w-16 rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`h-8 w-8 ${stat.color.split(' ')[1]}`} />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</h3>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-black tracking-tightest leading-none text-zinc-900">{stat.value}</span>
                                    <div className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {stat.trend}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tight text-zinc-900">Đơn hàng mới nhất</h2>
                            <p className="text-zinc-500 text-sm font-medium">Theo dõi và quản lý các giao dịch gần đây của khách hàng.</p>
                        </div>
                        <Link href="/admin/orders" className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-100 hover:bg-primary hover:text-primary-foreground transition-all text-sm font-black uppercase tracking-widest text-zinc-900">
                            Tất cả <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-200">
                                        <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Mã đơn</th>
                                        <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Khách hàng</th>
                                        <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Trạng thái</th>
                                        <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Tổng tiền</th>
                                        <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {(recentOrders as any[]).map(order => (
                                        <tr key={order.id} className="group hover:bg-zinc-50 transition-all">
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-xs font-black text-zinc-400 group-hover:text-primary transition-colors">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-black text-xs text-zinc-600">
                                                        {(order.user.name || order.user.email).slice(0, 1).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-tight text-zinc-900">{order.user.name || order.user.email}</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${order.status === 'PENDING'
                                                    ? 'bg-orange-50 text-orange-600 ring-orange-200'
                                                    : 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${order.status === 'PENDING' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                                    {order.status === 'PENDING' ? 'Đang chờ' : order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="font-black text-sm tabular-nums tracking-tight text-zinc-900">
                                                    {Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="h-10 w-10 flex items-center justify-center rounded-2xl hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100 text-zinc-400">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 text-zinc-400">
                                                    <ShoppingBag className="h-10 w-10 opacity-20" />
                                                    <p className="font-bold tracking-tight">Chưa có dữ liệu đơn hàng</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-zinc-900">Hành động nhanh</h2>
                        <p className="text-zinc-500 text-sm font-medium">Các tác vụ thường xuyên sử dụng.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: 'Thêm sản phẩm mới', icon: Package, href: '/admin/products/new', desc: 'Đăng tải sản phẩm mới lên website.' },
                            { label: 'Xem báo cáo chi tiết', icon: BarChart3, href: '/admin/analytics', desc: 'Phân tích doanh thu và sản phẩm.' },
                            { label: 'Quản lý khách hàng', icon: Users, href: '/admin/users', desc: 'Xem danh sách và hỗ trợ người dùng.' },
                        ].map((action, idx) => (
                            <Link key={idx} href={action.href} className="group p-6 rounded-[2rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-100 hover:border-primary/40 transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all text-zinc-600">
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-black tracking-tight group-hover:text-primary transition-colors text-sm uppercase text-zinc-900">{action.label}</h4>
                                        <p className="text-xs text-zinc-400 font-medium leading-relaxed">{action.desc}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/20 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-2xl font-black tracking-tight mb-2 relative z-10 text-white">Cần sự giúp đỡ?</h3>
                        <p className="text-white/80 text-sm font-medium mb-6 relative z-10 text-white">Xem tài liệu hướng dẫn hoặc liên hệ đội ngũ kỹ thuật.</p>
                        <button className="w-full h-12 rounded-2xl bg-white text-primary font-black text-xs uppercase tracking-widest relative z-10 transition-transform hover:scale-[1.02] active:scale-95">
                            Xem tài liệu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
