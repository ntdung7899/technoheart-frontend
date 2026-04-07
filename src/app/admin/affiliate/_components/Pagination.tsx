import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-slate-600">
                {page} / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
