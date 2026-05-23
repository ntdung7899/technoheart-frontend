"use client";

import { useEffect, useRef, useState } from "react";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function compute(target: number): Countdown {
  const diff = Math.max(0, target - Date.now());

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
  };
}

/**
 * Đếm ngược tới một mốc thời gian (ISO string hoặc timestamp).
 * Tự cập nhật mỗi giây và gọi onExpire một lần khi về 0.
 */
export function useCountdown(
  target: string | number | null | undefined,
  onExpire?: () => void
): Countdown | null {
  const targetMs =
    target == null
      ? null
      : typeof target === "number"
      ? target
      : new Date(target).getTime();

  const [, setTick] = useState(0);

  const firedRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    firedRef.current = false;
    if (targetMs == null || Number.isNaN(targetMs)) return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);

      if (compute(targetMs).total <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpireRef.current?.();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetMs]);

  return targetMs == null || Number.isNaN(targetMs) ? null : compute(targetMs);
}

export function formatCountdown(c: Countdown): string {
  const parts: string[] = [];
  if (c.days > 0) parts.push(`${c.days} ngày`);
  parts.push(`${c.hours} giờ`);
  parts.push(`${c.minutes} phút`);
  parts.push(`${c.seconds} giây`);
  return parts.join(" ");
}
