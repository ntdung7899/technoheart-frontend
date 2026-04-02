"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users, Loader2, UserCircle, Crown, Star, Shield, Zap, Award } from "lucide-react";

interface TeamMember {
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

const RANK_ICONS: Record<string, typeof Star> = {
    BA: Star, VIP: Zap, VVIP: Crown, L1: Shield, L2: Award, L3: Award, L4: Crown, L5: Crown,
};

const RANK_COLORS: Record<string, string> = {
    BA: "text-slate-500", VIP: "text-blue-500", VVIP: "text-purple-500",
    L1: "text-emerald-500", L2: "text-amber-500", L3: "text-red-500",
    L4: "text-pink-500", L5: "text-indigo-500",
};

export default function TeamPage() {
    const [f1, setF1] = useState<TeamMember[]>([]);
    const [f2, setF2] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"f1" | "f2">("f1");

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch("/api/affiliate/team");
                if (res.ok) {
                    const data = await res.json();
                    setF1(data.f1);
                    setF2(data.f2);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const currentList = tab === "f1" ? f1 : f2;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Mạng lưới</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Danh sách thành viên bạn đã giới thiệu
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{f1.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">F1 – Giới thiệu trực tiếp</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4 text-center">
                    <p className="text-3xl font-bold">{f2.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">F2 – Giới thiệu gián tiếp</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl bg-secondary/30 p-1">
                <button
                    onClick={() => setTab("f1")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "f1" ? "bg-white dark:bg-card shadow-sm text-primary" : "text-muted-foreground"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    F1 ({f1.length})
                </button>
                <button
                    onClick={() => setTab("f2")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "f2" ? "bg-white dark:bg-card shadow-sm text-primary" : "text-muted-foreground"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    F2 ({f2.length})
                </button>
            </div>

            {/* Member List */}
            {currentList.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground mt-4">
                        Chưa có thành viên {tab === "f1" ? "F1" : "F2"} nào
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Chia sẻ mã giới thiệu để mở rộng mạng lưới
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {currentList.map((member) => {
                        const RankIcon = member.user.affiliate?.rank
                            ? RANK_ICONS[member.user.affiliate.rank] || Star
                            : Star;
                        const rankColor = member.user.affiliate?.rank
                            ? RANK_COLORS[member.user.affiliate.rank] || "text-slate-400"
                            : "text-slate-400";

                        return (
                            <div
                                key={member.id}
                                className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/50">
                                    {member.user.avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <Image src={member.user.avatar} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" unoptimized />
                                    ) : (
                                        <UserCircle className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">
                                        {member.user.name || "Chưa đặt tên"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    {member.user.affiliate ? (
                                        <>
                                            <div className={`flex items-center gap-1 text-sm font-bold ${rankColor}`}>
                                                <RankIcon className="h-3.5 w-3.5" />
                                                {member.user.affiliate.rank}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {member.user.affiliate.personalPV.toLocaleString("vi-VN")} PV
                                            </p>
                                        </>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">Chưa là affiliate</span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground shrink-0">
                                    {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
