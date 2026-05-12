import { Users, DollarSign } from "lucide-react";
import { Overview, formatPrice } from "./constants";

export default function OverviewCards({ overview }: { overview: Overview }) {
    const totalAffiliates =
        Number(
            overview.totalAffiliates ??
                (overview as any).affiliates ??
                (overview as any).activeAffiliates ??
                0
        ) || 0;

    const totalCommissions =
        Number(
            (overview as any).totalCommissions ??
                (overview as any).totalEarnings ??
                (overview as any).revenue ??
                (overview as any).pendingCommissions ??
                0
        ) || 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {/* Thẻ Tổng Đối Tác */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            Tổng Đối Tác
                        </p>

                        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {totalAffiliates.toLocaleString("vi-VN")}
                        </h3>
                    </div>

                    <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-40 blur-2xl pointer-events-none" />
            </div>

            {/* Thẻ Tổng Hoa Hồng */}
            <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-primary/30 transition-all duration-300 group">
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                            Tổng Hoa Hồng Phát Sinh
                        </p>

                        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {formatPrice(totalCommissions)}
                        </h3>
                    </div>

                    <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                    </div>
                </div>

                <div className="absolute -right-6 -bottom-6 h-32 w-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-40 blur-2xl pointer-events-none" />
            </div>
        </div>
    );
}