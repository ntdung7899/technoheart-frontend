import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import { AffiliateProfile, RANK_LABELS, formatPrice } from "./constants";

interface Props {
    profiles: AffiliateProfile[];
    loading: boolean;
    onViewCommissions: (affiliateId: string) => void;
    onEdit: (affiliateId: string) => void;
    onDelete: (affiliateId: string) => void;
}

export default function AffiliatesTable({ profiles, loading, onViewCommissions, onEdit, onDelete }: Props) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
            ) : profiles.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">Không tìm thấy đối tác nào</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Đối tác</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Rank</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">PV cá nhân</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">PV nhóm</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Tổng thu nhập</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {profiles.map((p) => {
                                const rankInfo = RANK_LABELS[p.rank] || RANK_LABELS.BA;
                                return (
                                    <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-xs text-slate-600 shrink-0">
                                                    {(p.user.name || p.user.email).slice(0, 1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{p.user.name || "N/A"}</p>
                                                    <p className="text-[11px] text-slate-400">{p.user.email}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{p.referralCode}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${rankInfo.color}`}>
                                                {rankInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium">{p.personalPV.toLocaleString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-right text-sm font-medium">{p.teamPV.toLocaleString("vi-VN")}</td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{formatPrice(p.totalEarnings)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onViewCommissions(p.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-primary hover:text-white text-slate-600 text-xs font-medium transition-colors"
                                                >
                                                    <Eye className="h-3.5 w-3.5" /> Chi tiết
                                                </button>
                                                <button
                                                    onClick={() => onEdit(p.id)}
                                                    title="Chỉnh sửa"
                                                    className="p-1.5 rounded-md bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-600 transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(p.id)}
                                                    title="Xóa đối tác"
                                                    className="p-1.5 rounded-md bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
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