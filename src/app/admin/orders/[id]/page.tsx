import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    ArrowLeft, User, Mail, MapPin, Calendar, Clock, Package,
    ShoppingBag, CreditCard, Truck
} from "lucide-react";

const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-orange-50 text-orange-600 ring-orange-200' },
    PROCESSING: { label: 'Đang xử lý', color: 'bg-blue-50 text-blue-600 ring-blue-200' },
    SHIPPED: { label: 'Đang giao', color: 'bg-blue-50 text-blue-600 ring-blue-200' },
    DELIVERED: { label: 'Hoàn tất', color: 'bg-emerald-50 text-emerald-600 ring-emerald-200' },
    CANCELLED: { label: 'Đã huỷ', color: 'bg-zinc-50 text-zinc-500 ring-zinc-200' },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            address: true,
            items: {
                include: {
                    product: {
                        select: { id: true, name: true, images: true, price: true }
                    }
                }
            },
        },
    });

    if (!order) notFound();

    const statusInfo = statusMap[order.status] || statusMap.PENDING;

    return (
        <div className="space-y-10 pb-20 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="h-11 w-11 flex items-center justify-center rounded-2xl border border-zinc-200 hover:bg-zinc-100 transition-all text-zinc-500">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Đơn hàng</p>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                        <span className="font-mono text-primary">#{order.id.slice(0, 8)}</span>
                    </h1>
                </div>
                <div className="ml-auto">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ring-1 ring-inset ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Order info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Sản phẩm trong đơn ({order.items.length})
                            </p>
                        </div>
                        <div className="divide-y divide-zinc-50">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-5 hover:bg-zinc-50/50 transition-colors">
                                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                                        {item.product?.images?.[0] ? (
                                            <Image src={item.product.images[0]} alt={item.product.name} width={64} height={64} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <Package className="h-6 w-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-zinc-900 truncate">{item.product?.name || 'Sản phẩm không tồn tại'}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                                            SL: {item.quantity} × {Number(item.price).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm tabular-nums text-zinc-900">
                                            {(Number(item.price) * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 font-medium">Tạm tính</span>
                            <span className="font-bold text-zinc-900 tabular-nums">{Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500 font-medium">Phí vận chuyển</span>
                            <span className="font-bold text-emerald-600">Miễn phí</span>
                        </div>
                        <div className="h-px bg-zinc-100" />
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-zinc-900">Tổng thanh toán</span>
                            <span className="text-2xl font-black text-primary tabular-nums">
                                {Number(order.total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Customer info */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            Khách hàng
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-sm text-zinc-600 border border-zinc-200">
                                {(order.user.name || order.user.email).slice(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-zinc-900">{order.user.name || 'N/A'}</p>
                                <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                                    <Mail className="h-3 w-3" /> {order.user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    {order.address && (
                        <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                Địa chỉ giao hàng
                            </p>
                            <div className="text-sm text-zinc-700 space-y-1 font-medium">
                                {order.address.label && <p className="font-bold">{order.address.label}</p>}
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                                <p>{order.address.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Order meta */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5" />
                            Thông tin đơn
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Mã đơn</span>
                                <span className="font-mono font-bold text-zinc-900 text-xs">#{order.id.slice(0, 12)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Ngày đặt</span>
                                <span className="font-bold text-zinc-900">
                                    {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Thanh toán</span>
                                <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                                    COD
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
