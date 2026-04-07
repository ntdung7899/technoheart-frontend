import { Award } from "lucide-react";
import type { AffiliateData } from "./constants";

interface Props {
    stats: NonNullable<AffiliateData["stats"]>;
}

export function CommissionRates({ stats }: Props) {
    return (
        <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
            <h3 className="text-sm font-bold mb-3">Tỷ lệ hoa hồng hiện tại</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                        {(stats.rates.f1Rate * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Hoa hồng F1</p>
                </div>
                <div className="rounded-xl bg-secondary/50 border border-border/20 p-4 text-center">
                    <p className="text-2xl font-bold">
                        {stats.rates.f2Rate > 0
                            ? `${(stats.rates.f2Rate * 100).toFixed(1)}%`
                            : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Hoa hồng F2</p>
                </div>
            </div>
            {stats.achievement && (
                <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-3">
                    <Award className="h-5 w-5 text-amber-600" />
                    <div>
                        <p className="text-sm font-bold text-amber-700">{stats.achievement.label}</p>
                        <p className="text-xs text-amber-600">
                            Thưởng thành tích: {(stats.achievement.rate * 100).toFixed(0)}%
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
