import { Check, DollarSign, X } from "lucide-react";

interface Props {
    count: number;
    updating: boolean;
    onApprove: () => void;
    onPay: () => void;
    onCancel: () => void;
}

export default function BulkActions({ count, updating, onApprove, onPay, onCancel }: Props) {
    if (count === 0) return null;
    return (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg p-3">
            <span className="text-sm font-medium text-primary">{count} đã chọn</span>
            <div className="flex-1" />
            <button
                onClick={onApprove}
                disabled={updating}
                className="px-3 py-1.5 rounded-md bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
                <Check className="h-3.5 w-3.5 inline mr-1" /> Duyệt
            </button>
            <button
                onClick={onPay}
                disabled={updating}
                className="px-3 py-1.5 rounded-md bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
                <DollarSign className="h-3.5 w-3.5 inline mr-1" /> Thanh toán
            </button>
            <button
                onClick={onCancel}
                disabled={updating}
                className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
                <X className="h-3.5 w-3.5 inline mr-1" /> Huỷ
            </button>
        </div>
    );
}
