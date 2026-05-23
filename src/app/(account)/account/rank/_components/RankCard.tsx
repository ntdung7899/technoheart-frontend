"use client";

import { Award, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { formatPV, getRankDisplay } from "@/lib/format-meu";
import type { RankSnapshot } from "@/lib/api/bonus";

export function RankCard({ snapshot }: { snapshot: RankSnapshot }) {
  const displayRank = snapshot.managementRankAchieved || snapshot.finalRankCode;
  const rankInfo = getRankDisplay(displayRank);
  const branchCount = snapshot.qualifyingBranches
    ? Object.keys(snapshot.qualifyingBranches).length
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: rankInfo?.color || "#64748B" }}
          >
            <Award className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cấp bậc {displayRank}
            </p>
            <p className="text-xl font-bold text-slate-900">
              {rankInfo?.label || displayRank || "Chưa có cấp bậc"}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Bảo lưu vĩnh viễn
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" />
            Team PV
          </div>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatPV(snapshot.teamPV)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingUp className="h-3.5 w-3.5" />
            Personal PV
          </div>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {formatPV(snapshot.personalPV)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            Nhánh đủ điều kiện
          </div>
          <p className="mt-1 text-lg font-bold text-slate-900">{branchCount}</p>
        </div>
      </div>

      {snapshot.managementRankAchieved === null && (
        <p className="mt-4 text-xs text-slate-400">
          Chu kỳ hiện tại chưa đạt cấp bậc quản trị mới. Đang hiển thị cấp bậc bảo
          lưu cao nhất ({snapshot.finalRankCode}).
        </p>
      )}
    </div>
  );
}
