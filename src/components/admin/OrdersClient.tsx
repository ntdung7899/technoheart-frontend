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
    color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
        color === 'blue' ? 'bg-blue-50 text-blue-600' :
            color === 'orange' ? 'bg-amber-50 text-amber-600' :
                'bg-slate-100 text-slate-500';

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
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>
                <p className="text-slate-500 text-sm mt-1">Theo dõi và cập nhật trạng thái các đơn hàng.</p>
            </div>

            {/* Filter & Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn hoặc tên khách..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="h-9 px-3 pr-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm bg-white appearance-none cursor-pointer"
                >
                    <option value="">Tất cả trạng thái</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className={`rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible ${menuOpen ? 'pb-48' : ''}`}>
                <div className="overflow-visible">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Mã đơn</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Khách hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Ngày tạo</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">SP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Trạng thái</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Tổng tiền</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(order => {
                                const currentOpt = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0];
                                return (
                                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs text-slate-500 group-hover:text-primary transition-colors">#{order.id.slice(0, 8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{order.user.name || order.user.email}</p>
                                                <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{order.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-slate-500">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-sm font-medium text-slate-600">{order._count.items}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {loading === order.id ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Đang cập nhật
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${statusStyle(currentOpt.color)}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${currentOpt.color === 'emerald' ? 'bg-emerald-500' : currentOpt.color === 'blue' ? 'bg-blue-500' : currentOpt.color === 'orange' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                                                    {currentOpt.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-medium tabular-nums text-slate-900">
                                                {Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative" ref={menuOpen === order.id ? menuRef : undefined}>
                                                <button
                                                    onClick={() => { setMenuOpen(menuOpen === order.id ? null : order.id); setStatusMenuFor(null); }}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-400"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>

                                                {menuOpen === order.id && (
                                                    <div className="absolute top-full mt-1 right-0 w-48 bg-white rounded-lg border border-slate-200 shadow-lg p-1 z-50">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4 text-slate-400" />
                                                            Xem chi tiết
                                                        </Link>
                                                        <div className="h-px bg-slate-100 my-0.5" />
                                                        <button
                                                            onClick={() => setStatusMenuFor(statusMenuFor === order.id ? null : order.id)}
                                                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <RefreshCw className="h-4 w-4 text-slate-400" />
                                                                Đổi trạng thái
                                                            </span>
                                                            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${statusMenuFor === order.id ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {statusMenuFor === order.id && (
                                                            <div className="mt-0.5 space-y-0.5 pl-2">
                                                                {STATUS_OPTIONS.map(opt => (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => handleStatusChange(order.id, opt.value)}
                                                                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${order.status === opt.value ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={`h-1.5 w-1.5 rounded-full ${opt.color === 'emerald' ? 'bg-emerald-500' : opt.color === 'blue' ? 'bg-blue-500' : opt.color === 'orange' ? 'bg-amber-500' : 'bg-slate-400'}`} />
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
                                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingBag className="h-10 w-10 opacity-20" />
                                            <p className="font-medium text-sm">
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
