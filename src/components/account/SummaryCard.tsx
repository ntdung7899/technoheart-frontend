import { ReactNode } from "react";

const colorMap = {
    blue: { icon: "bg-blue-50 text-blue-500", value: "text-blue-600" },
    amber: { icon: "bg-amber-50 text-amber-500", value: "text-amber-600" },
    rose: { icon: "bg-rose-50 text-rose-500", value: "text-rose-600" },
    emerald: { icon: "bg-emerald-50 text-emerald-500", value: "text-emerald-600" },
} as const;

interface SummaryCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subtitle?: string;
    color?: keyof typeof colorMap;
}

export function SummaryCard({ icon, label, value, subtitle, color = "blue" }: SummaryCardProps) {
    const c = colorMap[color];
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3 mb-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${c.icon}`}>
                    {icon}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </span>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${c.value}`}>{value}</p>
            {subtitle && (
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            )}
        </div>
    );
}
