"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Wallet, MoreHorizontal, Check, ChevronDown, Loader2, RefreshCw, Ban, CreditCard } from "lucide-react";
import { updateAdminWithdrawalStatus } from "@/lib/api/admin-affiliate";

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'Chờ xử lý', color: 'orange', icon: RefreshCw },
    { value: 'APPROVED', label: 'Đã duyệt', color: 'blue', icon: Check },
    { value: 'PAID', label: 'Đã chuyển khoản', color: 'emerald', icon: Wallet },
    { value: 'REJECTED', label: 'Từ chối (Hoàn tiền)', color: 'red', icon: Ban },
];

const PV_RATE = 26000;

const statusStyle = (color: string) =>
    color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
        color === 'blue' ? 'bg-blue-50 text-blue-600' :
            color === 'orange' ? 'bg-amber-50 text-amber-600' :
                'bg-red-50 text-red-600';

const dotColor = (color: string) => 
    color === 'emerald' ? 'bg-emerald-500' : 
        color === 'blue' ? 'bg-blue-500' : 
            color === 'orange' ? 'bg-amber-500' : 
                'bg-red-500';

interface Withdrawal {
    id: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: string;
    createdAt: string;
    user: { name: string | null; email: string; referralCode: string };
}

export default function WithdrawalsClient({ initialData }: { initialData: Withdrawal[] }) {
    const [data, setData] = useState<Withdrawal[]>(initialData);
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    
    const menuRef = useRef<HTMLTableCellElement>(null);
    
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        const confirmMsg =
            newStatus === "REJECTED"
                ? "Bạn có chắc muốn TỪ CHỐI lệnh này? Tiền sẽ được hoàn lại vào số dư của đối tác."
                : "Xác nhận đổi trạng thái?";

        if (!window.confirm(confirmMsg)) return;

        setLoading(id);
        setMenuOpen(null);

        try {
            const nextStatus = String(newStatus || "").toUpperCase();

            await updateAdminWithdrawalStatus(id, {
                status: nextStatus,
            });

            setData((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            status: nextStatus,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error("UPDATE_ADMIN_WITHDRAWAL_STATUS_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra khi cập nhật!"
            );
        } finally {
            setLoading(null);
        }
    };

    const filtered = data.filter(item => {
        const query = searchQuery.toLowerCase();
        const matchSearch = !query ||
            item.user.name?.toLowerCase().includes(query) ||
            item.user.email.toLowerCase().includes(query) ||
            item.accountNumber.includes(query);
            
        const matchStatus = !statusFilter || item.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Yêu cầu rút tiền</h1>
                <p className="text-slate-500 text-sm mt-1">Quản lý và duyệt các lệnh rút hoa hồng từ đối tác.</p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[250px] max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên đối tác, email hoặc số tài khoản..."
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
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className={`rounded-xl border border-slate-200 bg-white shadow-sm overflow-visible ${menuOpen ? 'pb-48' : ''}`}>
                <div className="overflow-visible">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Mã lệnh</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đối tác</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Thông tin nhận tiền</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Số lượng (PV)</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Số tiền (VNĐ)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Trạng thái</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(item => {
                                const currentOpt = STATUS_OPTIONS.find(s => s.value === item.status) || STATUS_OPTIONS[0];
                                
                                return (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs text-slate-500">#{item.id.slice(0, 6).toUpperCase()}</span>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-slate-900">{item.user.name || 'N/A'}</p>
                                            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{item.user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-start gap-2">
                                                <CreditCard className="h-4 w-4 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700">{item.bankName}</p>
                                                    <p className="text-[11px] font-mono text-slate-500">{item.accountNumber}</p>
                                                    <p className="text-[10px] uppercase font-semibold text-slate-400">{item.accountName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-slate-600">{item.amount.toLocaleString()} PV</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-bold text-primary">
                                                {(item.amount * PV_RATE).toLocaleString('vi-VN')} đ
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {loading === item.id ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                                                    <Loader2 className="h-3 w-3 animate-spin" /> Đang xử lý
                                                </span>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${statusStyle(currentOpt.color)}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${dotColor(currentOpt.color)}`} />
                                                    {currentOpt.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right relative" ref={menuOpen === item.id ? menuRef : undefined}>
                                            <button
                                                onClick={() => setMenuOpen(menuOpen === item.id ? null : item.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>

                                            {menuOpen === item.id && (
                                                <div className="absolute top-full mt-1 right-4 w-48 bg-white rounded-lg border border-slate-200 shadow-xl p-1 z-50">
                                                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Đổi trạng thái</div>
                                                    {STATUS_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => handleStatusChange(item.id, opt.value)}
                                                            className={`w-full flex items-center justify-between px-2 py-2 rounded-md text-[12px] font-medium transition-colors ${item.status === opt.value ? 'bg-slate-50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <opt.icon className={`h-3.5 w-3.5 ${item.status === opt.value ? 'text-primary' : 'text-slate-400'}`} /> {opt.label}
                                                            </span>
                                                            {item.status === opt.value && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Wallet className="h-10 w-10 opacity-20" />
                                            <p className="font-medium text-sm">Chưa có yêu cầu rút tiền nào.</p>
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