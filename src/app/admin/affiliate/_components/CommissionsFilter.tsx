import { ArrowLeft } from "lucide-react";

const STATUS_TABS = [
    { value: "", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "PAID", label: "Đã TT" },
    { value: "CANCELLED", label: "Đã huỷ" },
];

interface Props {
    hasAffiliate: boolean;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onBack: () => void;
}

export default function CommissionsFilter({ hasAffiliate, statusFilter, onStatusChange, onBack }: Props) {
    return (
        <div className="flex items-center gap-3">
            {hasAffiliate && (
                <button
                    onClick={onBack}
                    className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 font-medium text-sm text-slate-600 transition-colors shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" /> Tất cả
                </button>
            )}
            <div className="flex rounded-lg bg-slate-100 p-1 gap-0.5 flex-1">
                {STATUS_TABS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => onStatusChange(f.value)}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === f.value ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
