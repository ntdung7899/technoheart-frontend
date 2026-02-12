import prisma from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search, Filter, ShoppingBag, MoreHorizontal, Calendar } from "lucide-react";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            _count: { select: { items: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Giao dịch
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Đơn hàng</h1>
                    <p className="text-zinc-500 font-medium text-lg">Theo dõi và cập nhật trạng thái các đơn hàng từ khách hàng của bạn.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/30">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                        className="h-12 w-full rounded-2xl bg-zinc-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border-transparent"
                    />
                </div>
                <div className="flex gap-2 text-zinc-600">
                    <button className="h-12 px-6 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2 font-bold text-sm">
                        <Calendar className="h-4 w-4" /> Thời gian
                    </button>
                    <button className="h-12 px-6 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2 font-bold text-sm">
                        <Filter className="h-4 w-4" /> Trạng thái
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Mã đơn hàng</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Khách hàng</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Ngày tạo</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Sản phẩm</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Trạng thái</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Tổng thanh toán</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {(orders as any[]).map(order => (
                                <tr key={order.id} className="group hover:bg-zinc-50 transition-all">
                                    <td className="px-8 py-6">
                                        <span className="font-mono text-xs font-black text-zinc-400 group-hover:text-primary transition-colors uppercase">#{order.id.slice(0, 8)}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight text-zinc-900">{order.user.name || order.user.email}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]">{order.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-zinc-500">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-zinc-100 text-[11px] font-black text-zinc-600">
                                            {order._count.items}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' :
                                                order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 ring-blue-200' :
                                                    order.status === 'PENDING' ? 'bg-orange-50 text-orange-600 ring-orange-200' :
                                                        'bg-zinc-50 text-zinc-500 ring-zinc-200'
                                            }`}>
                                            <div className={`h-1.5 w-1.5 rounded-full ${order.status === 'PENDING' ? 'bg-orange-500 animate-pulse' : order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="font-black text-sm tabular-nums tracking-tight text-zinc-900">
                                            {Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-zinc-400">
                                            <Link href={`/admin/orders/${order.id}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-200 transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-zinc-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <ShoppingBag className="h-12 w-12 opacity-20" />
                                            <p className="font-bold tracking-tight text-lg">Chưa có đơn hàng nào được tạo.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
