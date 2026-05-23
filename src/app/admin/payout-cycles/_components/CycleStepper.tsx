"use client";

import { Check } from "lucide-react";

const STEPS = [
  { title: "Tạo chu kỳ", desc: "POST /admin/payout-cycles → status OPEN" },
  { title: "Tính rank", desc: "POST /admin/rank-calculation/run" },
  { title: "Chuyển PROCESSING", desc: "PUT status=PROCESSING" },
  { title: "Duyệt & chi trả", desc: "Thưởng + rút tiền (ngày 10–15)" },
  { title: "Đóng chu kỳ", desc: "PUT status=CLOSED" },
];

export function CycleStepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="space-y-4">
      {STEPS.map((step, idx) => {
        const stepNo = idx + 1;
        const done = stepNo < currentStep;
        const active = stepNo === currentStep;
        return (
          <li key={step.title} className="flex gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                done
                  ? "bg-emerald-500 text-white"
                  : active
                  ? "bg-primary text-primary-foreground"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : stepNo}
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  active ? "text-slate-900" : "text-slate-600"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-slate-400">{step.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
