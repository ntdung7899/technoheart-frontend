"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CalendarClock } from "lucide-react";
import { getPayoutCycles, type PayoutCycle } from "@/lib/api/admin-payout";
import { CreateCycleForm } from "./_components/CreateCycleForm";
import { CycleStepper } from "./_components/CycleStepper";
import { CycleTable } from "./_components/CycleTable";

function deriveCurrentStep(cycles: PayoutCycle[]): number {
  if (cycles.length === 0) return 1;

  const hasProcessing = cycles.some(
    (c) => String(c.status).toUpperCase() === "PROCESSING"
  );
  if (hasProcessing) return 3;

  const hasOpen = cycles.some((c) => String(c.status).toUpperCase() === "OPEN");
  if (hasOpen) return 2;

  return 5;
}

export default function PayoutCyclesPage() {
  const [cycles, setCycles] = useState<PayoutCycle[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPayoutCycles();
      setCycles(data);
    } catch (error) {
      console.error("LOAD_PAYOUT_CYCLES_ERROR:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chu kỳ chi trả</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý quy trình tính rank và chi trả thưởng theo từng chu kỳ tháng.
        </p>
      </div>

      <CreateCycleForm onCreated={load} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <CycleTable cycles={cycles} onChanged={load} />
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <CalendarClock className="h-4 w-4 text-primary" />
            Quy trình chi trả
          </div>
          <CycleStepper currentStep={deriveCurrentStep(cycles)} />
        </div>
      </div>
    </div>
  );
}
