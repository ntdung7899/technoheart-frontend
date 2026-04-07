import type { AffiliateData } from "./constants";

interface Props {
    profile: NonNullable<AffiliateData["profile"]>;
    stats: NonNullable<AffiliateData["stats"]>;
    rankGradient: string;
}

export function RankProgression({ profile, stats, rankGradient }: Props) {
    if (!stats.progression.nextRank) return null;

    return (
        <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">Tiến trình thăng hạng</h3>
                <span className="text-xs text-muted-foreground">
                    {profile.rank} → {stats.progression.nextRank}
                </span>
            </div>
            <div className="h-3 rounded-full bg-secondary/50 overflow-hidden">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${rankGradient} transition-all duration-500`}
                    style={{ width: `${stats.progression.progress}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
                Còn cần{" "}
                <span className="font-bold text-foreground">
                    {stats.progression.pvNeeded.toLocaleString("vi-VN")} PV{" "}
                    {stats.progression.pvType === "team" ? "nhóm" : "cá nhân"}
                </span>{" "}
                để đạt {stats.progression.nextRank}
            </p>
        </div>
    );
}
