"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye, Search, Filter, ShoppingBag, MoreHorizontal, Calendar,
    Check, ChevronDown, Loader2, X, RefreshCw, Truck, Package, Ban
} from "lucide-react";

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'orange', icon: Package },
    { value: 'PROCESSING', label: 'Đang xử lý', color: 'blue', icon: RefreshCw },
    { value: 'SHIPPED', label: 'Đang giao', color: 'blue', icon: Truck },
    { value: 'DELIVERED', label: 'Hoàn tất', color: 'emerald', icon: Check },
    { value: 'CANCELLED', label: 'Đã huỷ', color: 'zinc', icon: Ban },
];

const statusStyle = (color: string) =>
    color === 'emerald' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' :
        color === 'blue' ? 'bg-blue-50 text-blue-600 ring-blue-200' :
            color === 'orange' ? 'bg-orange-50 text-orange-600 ring-orange-200' :
                'bg-zinc-50 text-zinc-500 ring-zinc-200';

interface Order {
    id: string;
    total: string | number;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string };
    _count: { items: number };
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [statusMenuFor, setStatusMenuFor] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(null);
                setStatusMenuFor(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setLoading(orderId);
        setMenuOpen(null);
        setStatusMenuFor(null);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(null);
        }
    };

    const filtered = orders.filter(o => {
        const query = searchQuery.toLowerCase();
        const matchSearch = !query ||
            o.id.toLowerCase().includes(query) ||
            o.user.name?.toLowerCase().includes(query) ||
            o.user.email.toLowerCase().includes(query);
        const matchStatus = !statusFilter || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full" />
                        Giao dịch
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Đơn hàng</h1>
                    <p className="text-zinc-500 font-medium text-lg">Theo dõi và cập nhật trạng thái các đơn hàng từ khách hàng của bạn.</p>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/30">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="h-12 w-full rounded-2xl bg-zinc-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border-transparent"
                    />
                </div>
                <div className="flex gap-2 text-zinc-600">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="h-12 px-4 pr-8 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all font-bold text-sm bg-white appearance-none cursor-pointer"
                    >
                        <option value="">Tất cả trạng thái</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className={`rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/30 overflow-visible ${menuOpen ? 'pb-48' : ''}`}>
                <div className="overflow-visible">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Mã đơn hàng</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Khách hàng</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Ngày tạo</th>
                                <th className="px-8 py-6 text-center text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Sản phẩm</th>
                                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Trạng thái</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Tổng thanh toán</th>
                                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filtered.map(order => {
                                const currentOpt = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0];
                                return (
                                    <tr key={order.id} className="group hover:bg-zinc-50/80 transition-all">
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
                                            {loading === order.id ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-50 text-zinc-400 ring-1 ring-inset ring-zinc-200">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Đang cập nhật
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${statusStyle(currentOpt.color)}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${currentOpt.color === 'emerald' ? 'bg-emerald-500' : currentOpt.color === 'blue' ? 'bg-blue-500' : currentOpt.color === 'orange' ? 'bg-orange-500 animate-pulse' : 'bg-zinc-400'}`} />
                                                    {currentOpt.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="font-black text-sm tabular-nums tracking-tight text-zinc-900">
                                                {Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="relative" ref={menuOpen === order.id ? menuRef : undefined}>
                                                <button
                                                    onClick={() => { setMenuOpen(menuOpen === order.id ? null : order.id); setStatusMenuFor(null); }}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-200 transition-all shadow-sm"
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                                </button>

                                                {menuOpen === order.id && (
                                                    <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-2 z-50">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4 text-zinc-400" />
                                                            Xem chi tiết
                                                        </Link>
                                                        <div className="h-px bg-zinc-100 my-1" />
                                                        <button
                                                            onClick={() => setStatusMenuFor(statusMenuFor === order.id ? null : order.id)}
                                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <RefreshCw className="h-4 w-4 text-zinc-400" />
                                                                Đổi trạng thái
                                                            </span>
                                                            <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${statusMenuFor === order.id ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {statusMenuFor === order.id && (
                                                            <div className="mt-1 space-y-0.5 pl-2">
                                                                {STATUS_OPTIONS.map(opt => (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => handleStatusChange(order.id, opt.value)}
                                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${order.status === opt.value ? 'bg-zinc-50 text-zinc-900 ring-1 ring-zinc-100' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`h-1.5 w-1.5 rounded-full ${opt.color === 'emerald' ? 'bg-emerald-500' : opt.color === 'blue' ? 'bg-blue-500' : opt.color === 'orange' ? 'bg-orange-500' : 'bg-zinc-400'}`} />
                                                                            {opt.label}
                                                                        </div>
                                                                        {order.status === opt.value && <Check className="h-3 w-3 text-emerald-500" />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-zinc-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <ShoppingBag className="h-12 w-12 opacity-20" />
                                            <p className="font-bold tracking-tight text-lg">
                                                {orders.length === 0 ? "Chưa có đơn hàng nào được tạo." : "Không tìm thấy đơn hàng phù hợp."}
                                            </p>
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
