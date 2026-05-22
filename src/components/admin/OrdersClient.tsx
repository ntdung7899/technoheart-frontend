"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Eye, Search, ShoppingBag, MoreHorizontal,
    Check, ChevronDown, Loader2, RefreshCw, Truck, Package, Ban, DollarSign
} from "lucide-react";
// import { updateOrderStatus } from "@/lib/api/orders";
import { updateAdminOrder } from "@/lib/api/admin-orders";

const DELIVERY_OPTIONS = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'orange', icon: Package },
    { value: 'PROCESSING', label: 'Đang đóng gói', color: 'blue', icon: RefreshCw },
    { value: 'SHIPPED', label: 'Đang giao', color: 'blue', icon: Truck },
    { value: 'DELIVERED', label: 'Đã giao', color: 'emerald', icon: Check },
    { value: 'CANCELLED', label: 'Đã huỷ', color: 'zinc', icon: Ban },
];

const PAYMENT_OPTIONS = [
    { value: 'UNPAID', label: 'Chưa thanh toán', color: 'orange', icon: DollarSign },
    { value: 'PAID', label: 'Đã thanh toán', color: 'emerald', icon: Check },
    { value: 'REFUNDED', label: 'Hoàn tiền', color: 'zinc', icon: RefreshCw },
];

const statusStyle = (color: string) =>
    color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
        color === 'blue' ? 'bg-blue-50 text-blue-600' :
            color === 'orange' ? 'bg-amber-50 text-amber-600' :
                'bg-slate-100 text-slate-500';

const dotColor = (color: string) => 
    color === 'emerald' ? 'bg-emerald-500' : 
        color === 'blue' ? 'bg-blue-500' : 
            color === 'orange' ? 'bg-amber-500' : 
                'bg-slate-400';

interface Order {
    id: string;
    total: string | number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    user: { name: string | null; email: string };
    _count: { items: number };
}
type OrdersPageData = {
    count: number;
    rows: Order[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
};

type AdminOrdersClientProps = {
    initialOrders: Order[] | OrdersPageData | null | undefined;
};

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
    const normalizedOrders = Array.isArray(initialOrders)
        ? initialOrders
        : Array.isArray(initialOrders?.rows)
            ? initialOrders.rows
            : [];

    const [orders, setOrders] = useState<Order[]>(normalizedOrders);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [statusMenuMode, setStatusMenuMode] = useState<'delivery' | 'payment' | null>(null);
    
    const [loading, setLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const [deliveryFilter, setDeliveryFilter] = useState<string>("");
    const [paymentFilter, setPaymentFilter] = useState<string>("");
    
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(null);
                setStatusMenuMode(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleStatusChange = async (
        orderId: string,
        type: "delivery" | "payment",
        newValue: string
    ) => {
        setLoading(orderId);
        setMenuOpen(null);
        setStatusMenuMode(null);

        try {
            const bodyData =
                type === "delivery"
                    ? { status: newValue }
                    : { paymentStatus: newValue };

            await updateAdminOrder(orderId, bodyData);

            setOrders((prev) =>
                prev.map((o) => {
                    if (o.id === orderId) {
                        return type === "delivery"
                            ? { ...o, status: newValue }
                            : { ...o, paymentStatus: newValue };
                    }

                    return o;
                })
            );
        } catch (error) {
            console.error("UPDATE_ADMIN_ORDER_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật trạng thái đơn hàng."
            );
        } finally {
            setLoading(null);
        }
    };
    

    const safeOrders = Array.isArray(orders) ? orders : [];

    const filtered = safeOrders.filter((o) => {
        const query = searchQuery.toLowerCase();

        const matchSearch =
            !query ||
            o.id?.toLowerCase().includes(query) ||
            o.user?.name?.toLowerCase().includes(query) ||
            o.user?.email?.toLowerCase().includes(query);

        const matchDelivery = !deliveryFilter || o.status === deliveryFilter;
        const matchPayment = !paymentFilter || o.paymentStatus === paymentFilter;

        return matchSearch && matchDelivery && matchPayment;
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>
                <p className="text-slate-500 text-sm mt-1">Theo dõi và cập nhật trạng thái các đơn hàng.</p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[250px] max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn hoặc tên khách..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                </div>

                {/* Dropdown Lọc Thanh toán */}
                <select
                    value={paymentFilter}
                    onChange={e => setPaymentFilter(e.target.value)}
                    className="h-9 px-3 pr-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm bg-white appearance-none cursor-pointer"
                >
                    <option value="">Tất cả thanh toán</option>
                    {PAYMENT_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                {/* Dropdown Lọc Giao hàng */}
                <select
                    value={deliveryFilter}
                    onChange={e => setDeliveryFilter(e.target.value)}
                    className="h-9 px-3 pr-8 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm bg-white appearance-none cursor-pointer"
                >
                    <option value="">Tất cả giao hàng</option>
                    {DELIVERY_OPTIONS.map(s => (
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Ngày đặt</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">SP</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">TT Thanh toán</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">TT Giao hàng</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Tổng tiền</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(order => {
                                const currentDelivery = DELIVERY_OPTIONS.find(s => s.value === order.status) || DELIVERY_OPTIONS[0];
                                const currentPayment = PAYMENT_OPTIONS.find(s => s.value === order.paymentStatus) || PAYMENT_OPTIONS[0];
                                
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
                                        
                                        {/* Cột 1: Trạng Thái Thanh Toán */}
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${statusStyle(currentPayment.color)}`}>
                                                <div className={`h-1.5 w-1.5 rounded-full ${dotColor(currentPayment.color)}`} />
                                                {currentPayment.label}
                                            </span>
                                        </td>

                                        {/* Cột 2: Trạng Thái Giao Hàng */}
                                        <td className="px-4 py-3">
                                            {loading === order.id ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                                                    <Loader2 className="h-3 w-3 animate-spin" /> Đang lưu
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${statusStyle(currentDelivery.color)}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${dotColor(currentDelivery.color)}`} />
                                                    {currentDelivery.label}
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
                                                    onClick={() => { setMenuOpen(menuOpen === order.id ? null : order.id); setStatusMenuMode(null); }}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors text-slate-400"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>

                                                {menuOpen === order.id && (
                                                    <div className="absolute top-full mt-1 right-0 w-56 bg-white rounded-lg border border-slate-200 shadow-xl p-1 z-50">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4 text-slate-400" /> Xem chi tiết
                                                        </Link>
                                                        <div className="h-px bg-slate-100 my-1" />
                                                        
                                                        {/* Nút bật Menu Thanh toán */}
                                                        <button
                                                            onClick={() => setStatusMenuMode(statusMenuMode === 'payment' ? null : 'payment')}
                                                            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <DollarSign className="h-4 w-4 text-slate-400" /> TT Thanh toán
                                                            </span>
                                                            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${statusMenuMode === 'payment' ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {/* Sub-menu Thanh toán */}
                                                        {statusMenuMode === 'payment' && (
                                                            <div className="mt-0.5 space-y-0.5 pl-4 bg-slate-50/50 rounded-md p-1 border border-slate-100">
                                                                {PAYMENT_OPTIONS.map(opt => (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => handleStatusChange(order.id, 'payment', opt.value)}
                                                                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors ${order.paymentStatus === opt.value ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                                                                    >
                                                                        <span className="flex items-center gap-1.5">
                                                                            <div className={`h-1.5 w-1.5 rounded-full ${dotColor(opt.color)}`} /> {opt.label}
                                                                        </span>
                                                                        {order.paymentStatus === opt.value && <Check className="h-3 w-3 text-emerald-500" />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Nút bật Menu Giao hàng */}
                                                        <button
                                                            onClick={() => setStatusMenuMode(statusMenuMode === 'delivery' ? null : 'delivery')}
                                                            className="w-full flex items-center justify-between px-3 py-2 mt-0.5 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <Truck className="h-4 w-4 text-slate-400" /> TT Giao hàng
                                                            </span>
                                                            <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${statusMenuMode === 'delivery' ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {/* Sub-menu Giao Hàng */}
                                                        {statusMenuMode === 'delivery' && (
                                                            <div className="mt-0.5 space-y-0.5 pl-4 bg-slate-50/50 rounded-md p-1 border border-slate-100">
                                                                {DELIVERY_OPTIONS.map(opt => (
                                                                    <button
                                                                        key={opt.value}
                                                                        onClick={() => handleStatusChange(order.id, 'delivery', opt.value)}
                                                                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors ${order.status === opt.value ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                                                                    >
                                                                        <span className="flex items-center gap-1.5">
                                                                            <div className={`h-1.5 w-1.5 rounded-full ${dotColor(opt.color)}`} /> {opt.label}
                                                                        </span>
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
                                    <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShoppingBag className="h-10 w-10 opacity-20" />
                                            <p className="font-medium text-sm">Không tìm thấy đơn hàng phù hợp.</p>
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