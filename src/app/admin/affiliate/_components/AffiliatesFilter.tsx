import { Search } from "lucide-react";
import { RANK_LABELS } from "./constants";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    rankFilter: string;
    onRankChange: (value: string) => void;
}

export default function AffiliatesFilter({ search, onSearchChange, rankFilter, onRankChange }: Props) {
    return (
        <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Tìm theo tên, email, SĐT..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
            </div>
            <select
                value={rankFilter}
                onChange={(e) => onRankChange(e.target.value)}
                className="h-9 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
            >
                <option value="">Tất cả rank</option>
                {Object.keys(RANK_LABELS).map((r) => (
                    <option key={r} value={r}>{RANK_LABELS[r].label}</option>
                ))}
            </select>
        </div>
    );
}
