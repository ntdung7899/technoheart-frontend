"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

export function RejectOrderModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  async function handleConfirm() {
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await onConfirm(note.trim());
      setNote("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900">Từ chối đơn hàng</h3>
        <p className="mt-1 text-sm text-slate-500">
          Vui lòng nhập lý do từ chối đơn hàng này.
        </p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-th-blue focus:outline-none focus:ring-2 focus:ring-th-blue/20"
          placeholder="Lý do từ chối..."
        />

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting || !note.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận từ chối
          </button>
        </div>
      </div>
    </div>
  );
}
