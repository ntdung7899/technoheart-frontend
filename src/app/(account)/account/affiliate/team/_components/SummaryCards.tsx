interface Props {
    f1Count: number;
    f2Count: number;
}

export function SummaryCards({ f1Count, f2Count }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                <p className="text-3xl font-bold text-primary">{f1Count}</p>
                <p className="text-xs text-muted-foreground mt-1">F1 – Giới thiệu trực tiếp</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                <p className="text-3xl font-bold">{f2Count}</p>
                <p className="text-xs text-muted-foreground mt-1">F2 – Giới thiệu gián tiếp</p>
            </div>
        </div>
    );
}
