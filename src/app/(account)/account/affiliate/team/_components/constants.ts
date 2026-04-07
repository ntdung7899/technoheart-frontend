import { Star, Zap, Crown, Shield, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TeamMember {
    id: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        avatar: string | null;
        createdAt: string;
        affiliate: {
            rank: string;
            personalPV: number;
            teamPV: number;
        } | null;
    };
    joinedAt: string;
}

export interface F2Member extends TeamMember {
    parentUserId: string | null;
}

export const RANK_ICONS: Record<string, LucideIcon> = {
    BA: Star, VIP: Zap, VVIP: Crown, L1: Shield, L2: Award, L3: Award, L4: Crown, L5: Crown,
};

export const RANK_COLORS: Record<string, string> = {
    BA: "text-slate-500", VIP: "text-blue-500", VVIP: "text-purple-500",
    L1: "text-emerald-500", L2: "text-amber-500", L3: "text-red-500",
    L4: "text-pink-500", L5: "text-indigo-500",
};
