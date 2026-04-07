import Link from "next/link";
import { Users, DollarSign, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AffiliateData } from "./constants";

interface Props {
    stats: NonNullable<AffiliateData["stats"]>;
}

export function QuickLinks({ stats }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
                href="/account/affiliate/team"
                className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/50 p-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Mạng lưới</p>
                        <p className="text-xs text-muted-foreground">
                            {stats.f1Count + stats.f2Count} thành viên
                        </p>
                    </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
                href="/account/affiliate/commissions"
                className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/50 p-4 hover:border-primary/30 hover:shadow-sm transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Hoa hồng</p>
                        <p className="text-xs text-muted-foreground">
                            {formatPrice(stats.pendingEarnings)} đang chờ
                        </p>
                    </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
        </div>
    );
}
