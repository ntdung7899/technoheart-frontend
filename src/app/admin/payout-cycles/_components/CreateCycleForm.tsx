"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { createPayoutCycle } from "@/lib/api/admin-payout";
import { getApiErrorMessage } from "@/lib/format-meu";

export function CreateCycleForm({ onCreated }: { onCreated: () => void }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPayoutCycle({ year: Number(year), month: Number(month) });
      alert("Đã tạo / mở chu kỳ chi trả");
      onCreated();
    } catch (err) {
      alert(getApiErrorMessage(err, "Không thể tạo chu kỳ"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Năm</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="h-9 w-28 rounded-lg border border-slate-200 px-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Tháng</label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="h-9 w-24 rounded-lg border border-slate-200 px-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Tạo chu kỳ
      </button>
    </form>
  );
}
