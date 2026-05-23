"use client";

import { useState } from "react";
import { Loader2, Clock } from "lucide-react";
import { withdrawAffiliate } from "@/lib/api/affiliate";
import { formatVND, pvToVnd, getApiErrorCode, getApiErrorMessage } from "@/lib/format-meu";
import { useCountdown, formatCountdown } from "@/hooks/useCountdown";

export function WithdrawalForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closedUntil, setClosedUntil] = useState<string | null>(null);

  const countdown = useCountdown(closedUntil);
  const pvNumber = Number(amount) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (pvNumber <= 0) {
      setError("Vui lòng nhập số PV hợp lệ");
      return;
    }

    setSubmitting(true);

    try {
      await withdrawAffiliate({
        amount: pvNumber,
        bankName,
        accountNumber,
        accountName,
      });

      alert("Yêu cầu rút tiền đã được gửi thành công!");
      onSuccess();
    } catch (err) {
      if (getApiErrorCode(err) === "WITHDRAWAL_CLOSED") {
        const nextOpenAt = (err as { body?: { nextOpenAt?: string } })?.body
          ?.nextOpenAt;
        setClosedUntil(nextOpenAt || null);
      } else {
        setError(getApiErrorMessage(err, "Không thể gửi yêu cầu rút tiền"));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (closedUntil) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Clock className="mx-auto h-10 w-10 text-amber-500" />
        <h3 className="mt-3 text-lg font-bold text-amber-800">
          Cổng rút tiền đang đóng
        </h3>
        <p className="mt-1 text-sm text-amber-700">
          Cổng rút tiền chỉ mở từ ngày 10 đến 15 hàng tháng.
        </p>
        {countdown && countdown.total > 0 ? (
          <p className="mt-3 text-sm font-semibold text-amber-800">
            Mở lại sau: {formatCountdown(countdown)}
          </p>
        ) : (
          <p className="mt-3 text-sm font-semibold text-emerald-700">
            Cổng đã mở! Vui lòng thử lại.
          </p>
        )}
        <button
          onClick={onCancel}
          className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white"
        >
          Đóng
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
    >
      <h3 className="text-lg font-bold text-slate-900">Yêu cầu rút tiền</h3>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Số PV muốn rút
        </label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-th-blue focus:outline-none focus:ring-2 focus:ring-th-blue/20"
          placeholder="Nhập số PV"
        />
        {pvNumber > 0 && (
          <p className="mt-1 text-sm text-th-blue">
            = {formatVND(pvToVnd(pvNumber))}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600">
          Tên ngân hàng
        </label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-th-blue focus:outline-none focus:ring-2 focus:ring-th-blue/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Số tài khoản
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-th-blue focus:outline-none focus:ring-2 focus:ring-th-blue/20"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Tên chủ tài khoản
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-th-blue focus:outline-none focus:ring-2 focus:ring-th-blue/20"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-th-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-th-blue/90 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Gửi yêu cầu
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
