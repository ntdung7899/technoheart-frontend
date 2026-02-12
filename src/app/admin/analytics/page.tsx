import prisma from "@/lib/prisma";
import {
    BarChart3,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingBag,
    Calendar,
    Download,
    Layers,
    PieChart,
    ChevronDown
} from "lucide-react";

export default async function AdminAnalyticsPage() {
    // Basic data from DB
    const orders = await prisma.order.findMany({
        where: { status: 'DELIVERED' },
        include: { items: true }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const totalOrders = orders.length;

    // Top products by revenue (mocked grouping for demonstration)
    const topProducts = [
        { name: 'iPhone 15 Pro Max', revenue: 154000000, growth: '+12%', color: 'bg-blue-500' },
        { name: 'MacBook Pro M3', revenue: 128000000, growth: '+8%', color: 'bg-purple-500' },
        { name: 'AirPods Pro 2', revenue: 45000000, growth: '-3%', color: 'bg-orange-500' },
        { name: 'Apple Watch Ultra', revenue: 32000000, growth: '+15%', color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Phân tích dữ liệu
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Báo cáo doanh thu</h1>
                    <p className="text-zinc-500 font-medium text-lg">Phân tích chuyên sâu về hiệu suất bán hàng và dòng tiền.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-12 px-6 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-all flex items-center gap-2 font-bold text-sm text-zinc-600 shadow-sm">
                        <Calendar className="h-4 w-4" /> 30 ngày qua <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                    <button className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                        <Download className="h-4 w-4" /> Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Tổng doanh thu (NET)', value: totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }), trend: '+24.5%', up: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Giá trị trung bình đơn', value: (totalOrders > 0 ? totalRevenue / totalOrders : 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }), trend: '+5.2%', up: true, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Tỷ lệ chuyển đổi', value: '3.42%', trend: '-1.1%', up: false, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, idx) => (
                    <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/30 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tightest">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Revenue Chart Placeholder */}
                <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/30 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tight text-zinc-900">Biểu đồ tăng trưởng</h3>
                            <p className="text-zinc-500 text-sm font-medium">Doanh thu theo thời gian (Tháng 2, 2026)</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200">
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Doanh thu</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Chart Placeholder */}
                    <div className="h-72 w-full flex items-end gap-3 px-4">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
                            <div key={i} className="flex-1 space-y-2 group cursor-pointer">
                                <div className="relative h-full flex flex-col justify-end">
                                    <div
                                        style={{ height: `${height}%` }}
                                        className="w-full bg-zinc-100 group-hover:bg-primary rounded-t-xl transition-all duration-500 relative"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {height}tr VND
                                        </div>
                                    </div>
                                </div>
                                <span className="block text-center text-[8px] font-black text-zinc-300 uppercase tracking-widest">T{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="p-10 rounded-[2.5rem] bg-white border border-zinc-200 shadow-xl shadow-zinc-200/30 space-y-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight text-zinc-900">Sản phẩm top</h3>
                        <p className="text-zinc-500 text-sm font-medium">Top doanh thu theo sản phẩm.</p>
                    </div>

                    <div className="space-y-6">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="group space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors">{product.name}</span>
                                    <span className={`text-[10px] font-black ${product.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {product.growth}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${product.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${(product.revenue / 154000000) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                    <span>Doanh thu</span>
                                    <span className="text-zinc-900">{product.revenue.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full h-14 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
                        <PieChart className="h-4 w-4" /> Xem chi tiết danh mục
                    </button>
                </div>
            </div>
        </div>
    );
}
