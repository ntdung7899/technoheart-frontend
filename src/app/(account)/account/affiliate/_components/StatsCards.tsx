import { DollarSign, TrendingUp, BarChart3, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AffiliateData } from "./constants";

interface Props {
    profile: NonNullable<AffiliateData["profile"]>;
    stats: NonNullable<AffiliateData["stats"]>;
}

export function StatsCards({ profile, stats }: Props) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                    <DollarSign className="h-4 w-4" />
                    Tổng thu nhập
                </div>
                <p className="text-xl font-bold">{formatPrice(profile.totalEarnings)}</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                    <TrendingUp className="h-4 w-4" />
                    PV cá nhân
                </div>
                <p className="text-xl font-bold">{profile.personalPV.toLocaleString("vi-VN")}</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                    <BarChart3 className="h-4 w-4" />
                    PV nhóm
                </div>
                <p className="text-xl font-bold">{profile.teamPV.toLocaleString("vi-VN")}</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                    <Users className="h-4 w-4" />
                    Mạng lưới
                </div>
                <p className="text-xl font-bold">
                    {stats.f1Count} <span className="text-sm font-normal text-muted-foreground">F1</span>
                    {" / "}
                    {stats.f2Count} <span className="text-sm font-normal text-muted-foreground">F2</span>
                </p>
            </div>
        </div>
    );
}
