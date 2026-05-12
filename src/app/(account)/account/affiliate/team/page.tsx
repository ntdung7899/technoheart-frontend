"use client";

import { useEffect, useState } from "react";
import { Loader2, GitBranch } from "lucide-react";
import type { TeamMember, F2Member } from "./_components/constants";
import { SummaryCards } from "./_components/SummaryCards";
import { TabSelector } from "./_components/TabSelector";
import { MemberList } from "./_components/MemberList";
import { TreeModal } from "./_components/TreeModal";
import {
    getAffiliateTeam,
    type AffiliateTeamMember,
} from "@/lib/api/affiliate";

function mapToTeamMember(member: AffiliateTeamMember): TeamMember {
    return {
        id: member.id,
        joinedAt: member.joinedAt || new Date().toISOString(),
        user: {
            id: member.user?.id || member.userId || member.id,
            name: member.user?.name || member.name || "Người dùng",
            email: member.user?.email || member.email || "",
            avatar: member.user?.avatar || null,
            createdAt:
                member.user?.createdAt ||
                member.joinedAt ||
                new Date().toISOString(),
            affiliate: {
                rank: member.rank || "BA",
                personalPV: Number(member.personalPV || 0),
                teamPV: Number(member.teamPV || 0),
            },
        },
    };
}

function mapToF2Member(member: AffiliateTeamMember): F2Member {
    return {
        id: member.id,
        parentUserId: member.parentUserId || null,
        joinedAt: member.joinedAt || new Date().toISOString(),
        user: {
            id: member.user?.id || member.userId || member.id,
            name: member.user?.name || member.name || "Người dùng",
            email: member.user?.email || member.email || "",
            avatar: member.user?.avatar || null,
            createdAt:
                member.user?.createdAt ||
                member.joinedAt ||
                new Date().toISOString(),
            affiliate: {
                rank: member.rank || "BA",
                personalPV: Number(member.personalPV || 0),
                teamPV: Number(member.teamPV || 0),
            },
        },
    };
}

export default function TeamPage() {
    const [f1, setF1] = useState<TeamMember[]>([]);
    const [f2, setF2] = useState<F2Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"f1" | "f2">("f1");
    const [treeOpen, setTreeOpen] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadTeam() {
            try {
                const data = await getAffiliateTeam();

                const members = Array.isArray(data.members)
                    ? data.members
                    : [];

                const f1Members = members
                    .filter((member) => Number(member.level) === 1)
                    .map(mapToTeamMember);

                const f2Members = members
                    .filter((member) => Number(member.level) === 2)
                    .map(mapToF2Member);

                if (mounted) {
                    setF1(f1Members);
                    setF2(f2Members);
                }
            } catch (error) {
                console.error("LOAD_AFFILIATE_TEAM_ERROR:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadTeam();

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Mạng lưới
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Danh sách thành viên bạn đã giới thiệu
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setTreeOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/50 px-4 py-2 text-sm font-bold hover:border-primary/40 hover:text-primary transition-all shrink-0"
                    >
                        <GitBranch className="h-4 w-4" />
                        Xem cây
                    </button>
                </div>

                <SummaryCards f1Count={f1.length} f2Count={f2.length} />

                <TabSelector
                    tab={tab}
                    f1Count={f1.length}
                    f2Count={f2.length}
                    onTabChange={setTab}
                />

                <MemberList members={tab === "f1" ? f1 : f2} tab={tab} />
            </div>

            <TreeModal
                open={treeOpen}
                onClose={() => setTreeOpen(false)}
                f1={f1}
                f2={f2}
            />
        </>
    );
}