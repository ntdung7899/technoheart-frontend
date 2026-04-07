import { Star, Zap, Crown, Shield, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const PV_RATE = 26000;

export interface AffiliateData {
    registered: boolean;
    profile?: {
        id: string;
        referralCode: string;
        rank: string;
        personalPV: number;
        teamPV: number;
        totalEarnings: number;
    };
    stats?: {
        f1Count: number;
        f2Count: number;
        pendingEarnings: number;
        rates: { f1Rate: number; f2Rate: number };
        achievement: { rate: number; label: string } | null;
        progression: { nextRank: string | null; pvNeeded: number; progress: number; pvType: "personal" | "team" };
        rankInfo: { label: string; minPersonalPV: number; minTeamPV: number; description: string; color: string };
    };
}

export const RANK_DISPLAY: Record<string, { label: string; icon: LucideIcon; gradient: string; badge: string }> = {
    BA: { label: "Brand Ambassador", icon: Star, gradient: "from-slate-500 to-slate-700", badge: "bg-slate-100 text-slate-700" },
    VIP: { label: "VIP Partner", icon: Zap, gradient: "from-blue-500 to-blue-700", badge: "bg-blue-100 text-blue-700" },
    VVIP: { label: "VVIP Partner", icon: Crown, gradient: "from-purple-500 to-purple-700", badge: "bg-purple-100 text-purple-700" },
    L1: { label: "Đại diện kinh doanh", icon: Shield, gradient: "from-emerald-500 to-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
    L2: { label: "Giám đốc khu vực", icon: Award, gradient: "from-amber-500 to-amber-700", badge: "bg-amber-100 text-amber-700" },
    L3: { label: "Giám đốc vùng", icon: Award, gradient: "from-red-500 to-red-700", badge: "bg-red-100 text-red-700" },
    L4: { label: "Đại sứ TH quốc gia", icon: Crown, gradient: "from-pink-500 to-pink-700", badge: "bg-pink-100 text-pink-700" },
    L5: { label: "Đại sứ TH toàn cầu", icon: Crown, gradient: "from-indigo-500 to-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
};

export const COMMISSION_TABLE = [
    { rank: "BA", pv: "≥ 100 PV", f1: "5%", f2: "—" },
    { rank: "VIP", pv: "≥ 500 PV", f1: "8%", f2: "3%" },
    { rank: "VVIP", pv: "≥ 1.000 PV", f1: "10%", f2: "3,5%" },
];

export const ACHIEVEMENT_TABLE = [
    { level: "L1", title: "Đại diện kinh doanh", rate: "3%", condition: "VIP + Nhóm ≥ 20.000 PV" },
    { level: "L2", title: "Giám đốc khu vực", rate: "5%", condition: "VIP + Nhóm ≥ 60.000 PV" },
    { level: "L3", title: "Giám đốc vùng", rate: "7%", condition: "VVIP + Nhóm ≥ 170.000 PV" },
    { level: "L4", title: "Đại sứ TH quốc gia", rate: "8%", condition: "VVIP + Nhóm ≥ 600.000 PV" },
    { level: "L5", title: "Đại sứ TH toàn cầu", rate: "9%", condition: "VVIP + Nhóm ≥ 2.000.000 PV" },
];
