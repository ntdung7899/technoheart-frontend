"use client";

import { useState } from "react";
import { Clock, MapPin, Loader2, Check, X, PackageCheck } from "lucide-react";
import { useCountdown, formatCountdown } from "@/hooks/useCountdown";
import { formatVND, getStatusStyle } from "@/lib/format-meu";
import type { HubOrder } from "@/lib/api/hub";

export function HubOrderCard({
  order,
  variant,
  onAccept,
  onReject,
  onComplete,
  onExpire,
}: {
  order: HubOrder;
  variant: "assigned" | "accepted";
  onAccept?: (id: string) => Promise<void>;
  onReject?: (order: HubOrder) => void;
  onComplete?: (id: string) => Promise<void>;
  onExpire?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const countdown = useCountdown(
    variant === "assigned" ? order.timeoutAt : null,
    onExpire
  );
  const style = getStatusStyle(order.status);
  const address = order.order?.address;
  const addressText = address
    ? [address.street, address.ward, address.city, address.state]
        .filter(Boolean)
        .join(", ")
    : "—";

  async function run(fn?: (id: string) => Promise<void>) {
    if (!fn) return;
    setBusy(true);
    try {
      await fn(order.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">
            Đơn #{order.orderId}
          </p>
          <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{addressText}</span>
          </p>
          {address?.name && (
            <p className="text-xs text-slate-400">
              {address.name} · {address.phone}
            </p>
          )}
          {typeof order.order?.total === "number" && (
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatVND(order.order.total)}
            </p>
          )}
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}
        >
          {style.label}
        </span>
      </div>

      {variant === "assigned" && countdown && (
        <div
          className={`mt-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
            countdown.total > 0
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          <Clock className="h-4 w-4" />
          {countdown.total > 0
            ? `Còn ${formatCountdown(countdown)} để phản hồi`
            : "Đã quá hạn phản hồi"}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        {variant === "assigned" && (
          <>
            <button
              onClick={() => run(onAccept)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Nhận đơn
            </button>
            <button
              onClick={() => onReject?.(order)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              Từ chối
            </button>
          </>
        )}

        {variant === "accepted" && (
          <button
            onClick={() => run(onComplete)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-th-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-th-blue/90 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PackageCheck className="h-4 w-4" />
            )}
            Hoàn thành giao hàng
          </button>
        )}
      </div>
    </div>
  );
}
