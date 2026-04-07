"use client";

import { useState } from "react";
import Image from "next/image";
import { Users, UserCircle, Star, ChevronDown, DollarSign } from "lucide-react";
import { RANK_ICONS, RANK_COLORS, type TeamMember } from "./constants";
import { MemberCommissions } from "./MemberCommissions";

interface Props {
    members: TeamMember[];
    tab: "f1" | "f2";
}

export function MemberList({ members, tab }: Props) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (members.length === 0) {
        return (
            <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mt-4">
                    Chưa có thành viên {tab === "f1" ? "F1" : "F2"} nào
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Chia sẻ mã giới thiệu để mở rộng mạng lưới
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {members.map((member) => {
                const rank = member.user.affiliate?.rank;
                const RankIcon = rank ? (RANK_ICONS[rank] || Star) : Star;
                const rankColor = rank ? (RANK_COLORS[rank] || "text-slate-400") : "text-slate-400";
                const isExpanded = expandedId === member.id;

                return (
                    <div
                        key={member.id}
                        className={`rounded-2xl border bg-card/50 transition-all ${
                            isExpanded ? "border-primary/30 shadow-sm" : "border-border/40"
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : member.id)}
                            className="flex items-center gap-4 p-4 w-full text-left"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/50 shrink-0">
                                {member.user.avatar ? (
                                    <Image
                                        src={member.user.avatar}
                                        alt=""
                                        width={44}
                                        height={44}
                                        className="h-11 w-11 rounded-full object-cover"
                                        unoptimized
                                    />
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
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                                </span>
                                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                }`} />
                            </div>
                        </button>

                        {/* Expandable commission history */}
                        {isExpanded && (
                            <div className="px-4 pb-4 border-t border-border/40 pt-3">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                                    <h4 className="text-xs font-bold">Lịch sử hoa hồng</h4>
                                </div>
                                <MemberCommissions memberId={member.user.id} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
