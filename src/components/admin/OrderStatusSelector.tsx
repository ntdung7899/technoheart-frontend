"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateAdminOrder } from "@/lib/api/admin-orders";

const STATUS_OPTIONS = [
    { value: "PENDING", label: "PENDING", color: "orange" },
    { value: "PROCESSING", label: "PROCESSING", color: "blue" },
    { value: "SHIPPED", label: "SHIPPED", color: "blue" },
    { value: "DELIVERED", label: "DELIVERED", color: "emerald" },
    { value: "CANCELLED", label: "CANCELLED", color: "zinc" },
];

type Props = {
    orderId: string;
    currentStatus: string;
};

export default function OrderStatusSelector({
    orderId,
    currentStatus,
}: Props) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return;

        setLoading(true);
        setOpen(false);

        try {
            await updateAdminOrder(orderId, {
                status: newStatus,
            });

            setStatus(newStatus);
            router.refresh();
        } catch (error) {
            console.error("UPDATE_ADMIN_ORDER_STATUS_ERROR:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật trạng thái đơn hàng"
            );
        } finally {
            setLoading(false);
        }
    };

    const currentOption =
        STATUS_OPTIONS.find((opt) => opt.value === status) ||
        STATUS_OPTIONS[0];

    const buttonClass =
        currentOption.color === "emerald"
            ? "bg-emerald-50 text-emerald-600"
            : currentOption.color === "blue"
              ? "bg-blue-50 text-blue-600"
              : currentOption.color === "orange"
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-500";

    const dotClass =
        currentOption.color === "emerald"
            ? "bg-emerald-500"
            : currentOption.color === "blue"
              ? "bg-blue-500"
              : currentOption.color === "orange"
                ? "bg-amber-500"
                : "bg-slate-400";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                disabled={loading}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all disabled:opacity-60 ${buttonClass}`}
            >
                {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <div className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
                )}

                {status}

                <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute top-full mt-1 right-0 w-44 bg-white rounded-lg border border-slate-200 shadow-lg p-1 z-20">
                        {STATUS_OPTIONS.map((option) => {
                            const optionDotClass =
                                option.color === "emerald"
                                    ? "bg-emerald-500"
                                    : option.color === "blue"
                                      ? "bg-blue-500"
                                      : option.color === "orange"
                                        ? "bg-amber-500"
                                        : "bg-slate-400";

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        handleStatusChange(option.value)
                                    }
                                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                                        status === option.value
                                            ? "bg-slate-50 text-slate-900"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`h-1.5 w-1.5 rounded-full ${optionDotClass}`}
                                        />
                                        {option.label}
                                    </div>

                                    {status === option.value && (
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}