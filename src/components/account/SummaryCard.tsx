import { ReactNode } from "react";

interface SummaryCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subtitle?: string;
}

export function SummaryCard({ icon, label, value, subtitle }: SummaryCardProps) {
    return (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground">
                    {icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                </span>
            </div>
            <p className="text-2xl font-extrabold tracking-tight">{value}</p>
            {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
        </div>
    );
}
