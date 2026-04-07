import { Users, DollarSign, Loader2, Check } from "lucide-react";
import { Overview, formatPrice } from "./constants";

export default function OverviewCards({ overview }: { overview: Overview }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
                    <Users className="h-4 w-4" /> Đối tác
                </div>
                <p className="text-2xl font-bold text-slate-900">{overview.totalAffiliates}</p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-2">
                    <DollarSign className="h-4 w-4" /> Tổng HH
                </div>
                <p className="text-2xl font-bold text-slate-900">{formatPrice(overview.totalCommissions)}</p>
            </div>
            <div className="rounded-xl bg-white border border-amber-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-amber-500 text-xs font-medium mb-2">
                    <Loader2 className="h-4 w-4" /> Chờ duyệt
                </div>
                <p className="text-2xl font-bold text-amber-600">{formatPrice(overview.totalPending)}</p>
            </div>
            <div className="rounded-xl bg-white border border-blue-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-blue-500 text-xs font-medium mb-2">
                    <Check className="h-4 w-4" /> Đã duyệt
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(overview.totalApproved)}</p>
            </div>
        </div>
    );
}
