import { Users } from "lucide-react";

interface Props {
    tab: "f1" | "f2";
    f1Count: number;
    f2Count: number;
    onTabChange: (tab: "f1" | "f2") => void;
}

export function TabSelector({ tab, f1Count, f2Count, onTabChange }: Props) {
    return (
        <div className="flex rounded-xl bg-secondary/30 p-1">
            <button
                onClick={() => onTabChange("f1")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    tab === "f1" ? "bg-white dark:bg-card shadow-sm text-primary" : "text-muted-foreground"
                }`}
            >
                <Users className="h-4 w-4" />
                F1 ({f1Count})
            </button>
            <button
                onClick={() => onTabChange("f2")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    tab === "f2" ? "bg-white dark:bg-card shadow-sm text-primary" : "text-muted-foreground"
                }`}
            >
                <Users className="h-4 w-4" />
                F2 ({f2Count})
            </button>
        </div>
    );
}
