"use client";

import { useState } from "react";
import { Loader2, Calculator, Play, Lock } from "lucide-react";
import {
  runRankCalculation,
  updatePayoutCycle,
  type PayoutCycle,
} from "@/lib/api/admin-payout";
import { getStatusStyle, getApiErrorMessage } from "@/lib/format-meu";

export function CycleTable({
  cycles,
  onChanged,
}: {
  cycles: PayoutCycle[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function withBusy(id: string, fn: () => Promise<unknown>, successMsg: string) {
    setBusyId(id);
    try {
      await fn();
      alert(successMsg);
      onChanged();
    } catch (err) {
      alert(getApiErrorMessage(err, "Thao tác thất bại"));
    } finally {
      setBusyId(null);
    }
  }

  if (cycles.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
        Chưa có chu kỳ chi trả nào.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Chu kỳ</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {cycles.map((cycle) => {
            const style = getStatusStyle(cycle.status);
            const busy = busyId === cycle.id;
            const status = String(cycle.status).toUpperCase();
            return (
              <tr key={cycle.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  Tháng {cycle.month}/{cycle.year}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
                  >
                    {style.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    {busy && (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    )}

                    {status === "OPEN" && (
                      <>
                        <button
                          onClick={() =>
                            withBusy(
                              cycle.id,
                              () => runRankCalculation(cycle.id),
                              "Đã chạy tính rank cho chu kỳ"
                            )
                          }
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                        >
                          <Calculator className="h-3.5 w-3.5" />
                          Tính rank
                        </button>
                        <button
                          onClick={() =>
                            withBusy(
                              cycle.id,
                              () => updatePayoutCycle(cycle.id, { status: "PROCESSING" }),
                              "Đã chuyển sang PROCESSING"
                            )
                          }
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Bắt đầu xử lý
                        </button>
                      </>
                    )}

                    {status === "PROCESSING" && (
                      <button
                        onClick={() =>
                          withBusy(
                            cycle.id,
                            () => updatePayoutCycle(cycle.id, { status: "CLOSED" }),
                            "Đã đóng chu kỳ"
                          )
                        }
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Đóng chu kỳ
                      </button>
                    )}

                    {status === "CLOSED" && (
                      <span className="text-xs text-slate-400">Đã hoàn tất</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
