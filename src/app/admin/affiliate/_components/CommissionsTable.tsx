import { Loader2 } from "lucide-react";
import { CommissionItem, RANK_LABELS, STATUS_CONFIG, formatPrice } from "./constants";

interface Props {
    commissions: CommissionItem[];
    loading: boolean;
    selectedIds: string[];
    onToggleSelect: (id: string, checked: boolean) => void;
    onToggleAll: () => void;
}

export default function CommissionsTable({ commissions, loading, selectedIds, onToggleSelect, onToggleAll }: Props) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
            ) : commissions.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">Không có hoa hồng nào</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === commissions.length && commissions.length > 0}
                                        onChange={onToggleAll}
                                        className="h-4 w-4 rounded border-slate-300"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đối tác</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đơn hàng</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Loại</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Giá trị ĐH</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Tỉ lệ</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Hoa hồng</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Ngày</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {commissions.map((c) => {
                                const statusInfo = STATUS_CONFIG[c.status] || STATUS_CONFIG.PENDING;
                                return (
                                    <tr key={c.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(c.id)}
                                                onChange={(e) => onToggleSelect(c.id, e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-slate-900">{c.affiliateName}</p>
                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${RANK_LABELS[c.affiliateRank]?.color || ""}`}>
                                                {c.affiliateRank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-xs font-mono text-slate-500 truncate max-w-30">{c.orderId.slice(0, 12)}...</p>
                                            <p className="text-[10px] text-slate-400">Khách: {c.orderBuyer}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xs font-medium">
                                                {c.type === "ACHIEVEMENT" ? "Thưởng" : `F${c.level}`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-slate-600">{formatPrice(c.orderTotal)}</td>
                                        <td className="px-4 py-3 text-center text-sm font-medium text-primary">{(c.rate * 100).toFixed(1)}%</td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{formatPrice(c.amount)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
