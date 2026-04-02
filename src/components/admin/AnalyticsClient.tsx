"use client";

import { useState, useEffect } from "react";
import {
    BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight,
    DollarSign, ShoppingBag, Calendar, Download,
    Layers, PieChart, Loader2, Package
} from "lucide-react";

interface TopProduct {
    name: string;
    revenue: number;
    quantity: number;
}

interface AnalyticsData {
    totalRevenue: number;
    deliveredRevenue: number;
    totalOrders: number;
    deliveredOrders: number;
    avgOrderValue: number;
    topProducts: TopProduct[];
}

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-emerald-500', 'bg-pink-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500'];

const PRESETS = [
    { label: '7 ngày', days: 7 },
    { label: '30 ngày', days: 30 },
    { label: '90 ngày', days: 90 },
    { label: 'Năm nay', days: -1 },
    { label: 'Tất cả', days: 0 },
];

export default function AdminAnalyticsClient() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(1); // 30 days default
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const getDateRange = () => {
        const preset = PRESETS[selectedPreset];
        const now = new Date();
        if (preset.days === 0) return { from: "", to: "" };
        if (preset.days === -1) {
            return { from: new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
        }
        const f = new Date(now.getTime() - preset.days * 86400000);
        return { from: f.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
    };

    const fetchData = async () => {
        setLoading(true);
        const range = from ? { from, to } : getDateRange();
        const params = new URLSearchParams();
        if (range.from) params.set("from", range.from);
        if (range.to) params.set("to", range.to);

        const res = await fetch(`/api/analytics?${params}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [selectedPreset]);

    const handleExport = async () => {
        setExporting(true);
        const range = from ? { from, to } : getDateRange();
        const params = new URLSearchParams();
        if (range.from) params.set("from", range.from);
        if (range.to) params.set("to", range.to);

        const res = await fetch(`/api/analytics/export?${params}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bao-cao-${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        setExporting(false);
    };

    const handleCustomFilter = () => {
        if (from) fetchData();
    };

    const fmtVnd = (n: number) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Báo cáo doanh thu</h1>
                    <p className="text-slate-500 text-sm mt-1">Phân tích chuyên sâu về hiệu suất bán hàng.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Date presets */}
                    <div className="flex gap-0.5 bg-slate-100 rounded-lg p-1">
                        {PRESETS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => { setSelectedPreset(i); setFrom(""); setTo(""); }}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${selectedPreset === i && !from ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="h-9 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60"
                    >
                        {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        Xuất Excel
                    </button>
                </div>
            </div>

            {/* Custom date range */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />
                    Tuỳ chọn:
                </div>
                <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                />
                <span className="text-slate-400 text-sm">→</span>
                <input type="date" value={to} onChange={e => setTo(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                />
                <button
                    onClick={handleCustomFilter}
                    className="h-9 px-4 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                    Áp dụng
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : data ? (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Tổng doanh thu', value: fmtVnd(data.totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Giá trị TB/đơn', value: fmtVnd(data.avgOrderValue), icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Tổng đơn hàng', value: data.totalOrders.toString(), icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                                <div className={`h-10 w-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-400 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Revenue breakdown */}
                        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-slate-900">Phân tích doanh thu</h3>
                                <p className="text-slate-500 text-sm">Tổng hợp theo sản phẩm bán chạy</p>
                            </div>

                            {data.topProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                                    <Package className="h-10 w-10 opacity-20" />
                                    <p className="text-sm font-medium">Chưa có dữ liệu trong khoảng thời gian này</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {data.topProducts.slice(0, 6).map((product, idx) => {
                                        const maxRev = data.topProducts[0]?.revenue || 1;
                                        return (
                                            <div key={idx} className="group space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-500">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{product.name}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{product.quantity} đã bán</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${COLORS[idx % COLORS.length]} rounded-full transition-all duration-1000`}
                                                        style={{ width: `${(product.revenue / maxRev) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[11px] text-slate-400">
                                                    <span>Doanh thu</span>
                                                    <span className="font-medium text-slate-900">{fmtVnd(product.revenue)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick stats sidebar */}
                        <div className="space-y-4">
                            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                                <h3 className="text-sm font-bold text-slate-900">Trạng thái đơn hàng</h3>
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Đã giao</span>
                                        <span className="text-sm font-bold text-emerald-600">{data.deliveredOrders}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Tổng đơn</span>
                                        <span className="text-sm font-bold text-slate-900">{data.totalOrders}</span>
                                    </div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Tỷ lệ hoàn tất</span>
                                        <span className="text-sm font-bold text-primary">
                                            {data.totalOrders > 0 ? ((data.deliveredOrders / data.totalOrders) * 100).toFixed(1) : 0}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                                <h3 className="text-sm font-bold text-slate-900">Doanh thu đã giao</h3>
                                <p className="text-2xl font-bold text-emerald-600">{fmtVnd(data.deliveredRevenue)}</p>
                                <p className="text-[11px] text-slate-400">Chỉ tính đơn DELIVERED</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
