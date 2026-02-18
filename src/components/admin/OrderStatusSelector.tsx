
"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'PENDING', color: 'orange' },
    { value: 'PROCESSING', label: 'PROCESSING', color: 'blue' },
    { value: 'SHIPPED', label: 'SHIPPED', color: 'blue' },
    { value: 'DELIVERED', label: 'DELIVERED', color: 'emerald' },
    { value: 'CANCELLED', label: 'CANCELLED', color: 'zinc' },
];

export default function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === status) return;

        setLoading(true);
        setOpen(false);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setStatus(newStatus);
                router.refresh();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating status");
        } finally {
            setLoading(false);
        }
    };

    const currentOption = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                disabled={loading}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset transition-all hover:scale-105 active:scale-95 ${currentOption.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' :
                    currentOption.color === 'blue' ? 'bg-blue-50 text-blue-600 ring-blue-200' :
                        currentOption.color === 'orange' ? 'bg-orange-50 text-orange-600 ring-orange-200' :
                            'bg-zinc-50 text-zinc-500 ring-zinc-200'
                    }`}
            >
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : (
                    <div className={`h-1.5 w-1.5 rounded-full ${status === 'PENDING' ? 'bg-orange-500 animate-pulse' : currentOption.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                )}
                {status}
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 p-2 z-20 transition-all duration-200 origin-top">
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${status === option.value
                                        ? 'bg-zinc-50 text-zinc-900 border border-zinc-100'
                                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${option.color === 'emerald' ? 'bg-emerald-500' :
                                            option.color === 'blue' ? 'bg-blue-500' :
                                                option.color === 'orange' ? 'bg-orange-500' :
                                                    'bg-zinc-400'
                                        }`} />
                                    {option.label}
                                </div>
                                {status === option.value && <Check className="h-3 w-3 text-emerald-500" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
