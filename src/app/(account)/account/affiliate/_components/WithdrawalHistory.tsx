"use client";

import { Clock, Check, Ban, Wallet, RefreshCw, Landmark } from "lucide-react";
import { PV_RATE } from "./constants";

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: RefreshCw },
    APPROVED: { label: 'Đã duyệt', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: Check },
    PAID: { label: 'Đã chuyển khoản', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: Wallet },
    REJECTED: { label: 'Từ chối', color: 'bg-red-50 text-red-600 border-red-200', icon: Ban },
};

interface WithdrawalItem {
    id: string;
    amount: number;
    status: string;
    createdAt: Date | string;
    bankName: string;
    accountNumber: string;
    accountName: string;
}

interface Props {
    history: WithdrawalItem[];
}

export function WithdrawalHistory({ history }: Props) {
    if (!history || history.length === 0) return null;

    return (
        <div className="bg-white dark:bg-zinc-950 border rounded-xl overflow-hidden shadow-sm mt-6">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg text-slate-900">Lịch sử</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                            <th className="px-5 py-3 font-medium">Thời gian</th>
                            <th className="px-5 py-3 font-medium">Số lượng</th>
                            <th className="px-5 py-3 font-medium">Thực nhận (VNĐ)</th>
                            <th className="px-5 py-3 font-medium">Ngân hàng</th>
                            <th className="px-5 py-3 font-medium text-right">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {history.map((item) => {
                            const statusInfo = STATUS_MAP[item.status] || STATUS_MAP.PENDING;
                            const StatusIcon = statusInfo.icon;

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                                        {new Date(item.createdAt).toLocaleString('vi-VN', {
                                            hour: '2-digit', minute: '2-digit',
                                            day: '2-digit', month: '2-digit', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-slate-700">{Number(item.amount).toLocaleString()} PV</span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <span className="font-bold text-primary">
                                            {(Number(item.amount) * PV_RATE).toLocaleString('vi-VN')} đ
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <Landmark className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 text-xs">{item.bankName}</p>
                                                <p className="text-[11px] text-slate-500 font-mono">{item.accountNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${statusInfo.color}`}>
                                            <StatusIcon className="h-3 w-3" />
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}