"use client";

import { useState } from "react";
import { X, Crown, Star, Mail, Calendar, TrendingUp, Users, ChevronLeft, DollarSign } from "lucide-react";
import Image from "next/image";
import { RANK_ICONS, RANK_COLORS, type TeamMember, type F2Member } from "./constants";
import { MemberCommissions } from "./MemberCommissions";

interface Props {
    open: boolean;
    onClose: () => void;
    f1: TeamMember[];
    f2: F2Member[];
}

// Layout constants
const AV = 52;
const NW = 88;
const HG = 24;
const VG = 56;
const PAD = 32;

const RANK_LABELS: Record<string, string> = {
    BA: "Brand Ambassador", VIP: "VIP Partner", VVIP: "VVIP Partner",
    L1: "Đại diện kinh doanh", L2: "Giám đốc khu vực", L3: "Giám đốc vùng",
    L4: "Đại sứ TH quốc gia", L5: "Đại sứ TH toàn cầu",
};

const RANK_BG: Record<string, string> = {
    BA: "bg-slate-100 ring-slate-300", VIP: "bg-blue-50 ring-blue-300",
    VVIP: "bg-purple-50 ring-purple-300", L1: "bg-emerald-50 ring-emerald-300",
    L2: "bg-amber-50 ring-amber-300", L3: "bg-red-50 ring-red-300",
    L4: "bg-pink-50 ring-pink-300", L5: "bg-indigo-50 ring-indigo-300",
};

function getInitials(name: string | null, email: string) {
    return (name || email).slice(0, 2).toUpperCase();
}

interface TreeNodeProps {
    x: number;
    y: number;
    member?: TeamMember;
    isRoot?: boolean;
    selected?: boolean;
    onClick?: () => void;
    level?: "f1" | "f2";
}

function TreeNode({ x, y, member, isRoot, selected, onClick, level }: TreeNodeProps) {
    const rank = member?.user.affiliate?.rank;
    const RankIcon = rank ? (RANK_ICONS[rank] ?? Star) : null;
    const rankColor = rank ? (RANK_COLORS[rank] ?? "text-slate-400") : "";
    const ringBg = rank ? (RANK_BG[rank] ?? "bg-secondary/80 ring-border") : "bg-secondary/80 ring-border";

    return (
        <div
            className="absolute flex flex-col items-center gap-1 select-none"
            style={{ left: x - NW / 2, top: y, width: NW }}
        >
            <button
                type="button"
                onClick={!isRoot ? onClick : undefined}
                className={`group flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ring-[2.5px] overflow-hidden transition-all duration-200 ${
                    isRoot
                        ? "ring-primary bg-primary cursor-default"
                        : `${ringBg} cursor-pointer hover:scale-110 hover:shadow-lg ${selected ? "scale-110 shadow-lg ring-primary !bg-primary/10" : ""}`
                }`}
            >
                {isRoot ? (
                    <Crown className="h-5 w-5 text-white" />
                ) : member?.user.avatar ? (
                    <Image
                        src={member.user.avatar}
                        alt=""
                        width={52}
                        height={52}
                        className="h-[52px] w-[52px] object-cover"
                        unoptimized
                    />
                ) : (
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        {member && getInitials(member.user.name, member.user.email)}
                    </span>
                )}
            </button>

            {/* Name */}
            <p className={`w-full truncate text-center text-[11px] font-semibold leading-tight ${selected ? "text-primary" : ""}`}>
                {isRoot ? "Bạn" : (member?.user.name || "—")}
            </p>

            {/* Rank badge or level tag */}
            {isRoot ? (
                <span className="text-[10px] leading-none text-muted-foreground font-medium">Bạn</span>
            ) : RankIcon && rank ? (
                <span className={`flex items-center gap-0.5 text-[10px] font-bold leading-none ${rankColor}`}>
                    <RankIcon className="h-2.5 w-2.5 shrink-0" />
                    {rank}
                </span>
            ) : (
                <span className="text-[10px] leading-none text-muted-foreground">
                    {level === "f1" ? "F1" : "F2"}
                </span>
            )}
        </div>
    );
}

function MemberDetail({ member, level, onBack }: { member: TeamMember; level: "f1" | "f2"; onBack: () => void }) {
    const rank = member.user.affiliate?.rank;
    const RankIcon = rank ? (RANK_ICONS[rank] ?? Star) : Star;
    const rankColor = rank ? (RANK_COLORS[rank] ?? "text-slate-500") : "text-slate-500";
    const rankLabel = rank ? (RANK_LABELS[rank] ?? rank) : "Chưa là affiliate";

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-200">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
            >
                <ChevronLeft className="h-3.5 w-3.5" />
                Quay lại cây
            </button>

            <div className="flex flex-col items-center gap-3 pb-4 border-b border-border/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-full ring-[2.5px] ring-border bg-secondary/80 overflow-hidden">
                    {member.user.avatar ? (
                        <Image
                            src={member.user.avatar}
                            alt=""
                            width={64}
                            height={64}
                            className="h-16 w-16 object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                            {getInitials(member.user.name, member.user.email)}
                        </span>
                    )}
                </div>
                <div className="text-center">
                    <p className="font-bold">{member.user.name || "Chưa đặt tên"}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${rankColor}`}>
                        <RankIcon className="h-3 w-3" />
                        {rankLabel}
                    </span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    level === "f1" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                    {level === "f1" ? "F1 – Trực tiếp" : "F2 – Gián tiếp"}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-secondary/40 p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Mail className="h-3 w-3" />
                        <span className="text-[10px] font-medium">Email</span>
                    </div>
                    <p className="text-xs font-semibold truncate">{member.user.email}</p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] font-medium">Tham gia</span>
                    </div>
                    <p className="text-xs font-semibold">
                        {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
                    </p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[10px] font-medium">PV cá nhân</span>
                    </div>
                    <p className="text-xs font-semibold">
                        {member.user.affiliate
                            ? member.user.affiliate.personalPV.toLocaleString("vi-VN")
                            : "0"}
                    </p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        <span className="text-[10px] font-medium">PV nhóm</span>
                    </div>
                    <p className="text-xs font-semibold">
                        {member.user.affiliate
                            ? member.user.affiliate.teamPV.toLocaleString("vi-VN")
                            : "0"}
                    </p>
                </div>
            </div>

            {/* Commission history */}
            <div className="mt-4 pt-4 border-t border-border/40">
                <div className="flex items-center gap-1.5 mb-3">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <h4 className="text-xs font-bold">Lịch sử hoa hồng</h4>
                </div>
                <MemberCommissions memberId={member.user.id} />
            </div>
        </div>
    );
}

export function TreeModal({ open, onClose, f1, f2 }: Props) {
    const [selected, setSelected] = useState<{ member: TeamMember; level: "f1" | "f2" } | null>(null);

    if (!open) return null;

    const handleClose = () => {
        setSelected(null);
        onClose();
    };

    // Group F2 by their intermediate F1 parent
    const f1Branches = f1.map((member) => ({
        member,
        children: f2.filter((f2m) => f2m.parentUserId === member.user.id),
    }));

    // Width of one F1 branch = max(1, childCount) columns
    const branchW = (childCount: number) =>
        Math.max(1, childCount) * (NW + HG) - HG;
    const branchWidths = f1Branches.map((b) => branchW(b.children.length));

    const totalW =
        branchWidths.length > 0
            ? branchWidths.reduce((acc, w, i) => acc + w + (i > 0 ? HG : 0), 0)
            : NW;

    const canvasW = Math.max(totalW, NW) + PAD * 2;
    const hasF2 = f2.length > 0;

    const rootY = PAD;
    const f1Y = rootY + AV + VG;
    const f2Y = f1Y + AV + VG;
    const nodeH = 86;
    const canvasH = (hasF2 ? f2Y + nodeH : f1Y + nodeH) + PAD;

    const rootX = canvasW / 2;

    // Calculate center X for each F1 branch
    let curX = PAD;
    const f1X: number[] = [];
    f1Branches.forEach((b, i) => {
        f1X.push(curX + branchWidths[i] / 2);
        curX += branchWidths[i] + (i < f1Branches.length - 1 ? HG : 0);
    });

    // F2 node positions
    const f2Nodes: { x: number; member: F2Member; f1Idx: number }[] = [];
    f1Branches.forEach((branch, fi) => {
        const branchStart = f1X[fi] - branchWidths[fi] / 2;
        branch.children.forEach((child, ci) => {
            f2Nodes.push({
                x: branchStart + ci * (NW + HG) + NW / 2,
                member: child,
                f1Idx: fi,
            });
        });
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div className="bg-card rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-border/40">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border/40 shrink-0">
                    <div>
                        <h2 className="text-base font-bold">Cây mạng lưới</h2>
                        <p className="text-xs text-muted-foreground">
                            {f1.length} F1 · {f2.length} F2 · Click vào thành viên để xem chi tiết
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="rounded-lg p-1.5 hover:bg-secondary/50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body: tree + optional detail pane */}
                <div className="flex flex-1 overflow-hidden min-h-0">
                    {/* Tree canvas */}
                    <div className={`overflow-auto flex-1 flex justify-center p-4 transition-all duration-300 ${selected ? "hidden sm:flex sm:flex-1" : ""}`}>
                        {f1.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary ring-2 ring-primary">
                                    <Crown className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm font-semibold">Bạn</p>
                                <p className="text-xs text-muted-foreground">
                                    Chưa có thành viên trong mạng lưới
                                </p>
                            </div>
                        ) : (
                            <div
                                className="relative shrink-0"
                                style={{ width: canvasW, height: canvasH }}
                            >
                                {/* SVG lines */}
                                <svg
                                    className="absolute inset-0 pointer-events-none"
                                    width={canvasW}
                                    height={canvasH}
                                >
                                    {/* Root → F1 (solid) */}
                                    {f1X.map((fx, i) => (
                                        <line
                                            key={`r-f1-${i}`}
                                            x1={rootX}
                                            y1={rootY + AV}
                                            x2={fx}
                                            y2={f1Y}
                                            className="stroke-border"
                                            strokeWidth={1.5}
                                        />
                                    ))}

                                    {/* F1 → F2 (dashed) */}
                                    {f2Nodes.map((pos, i) => (
                                        <line
                                            key={`f1-f2-${i}`}
                                            x1={f1X[pos.f1Idx]}
                                            y1={f1Y + AV}
                                            x2={pos.x}
                                            y2={f2Y}
                                            className="stroke-border"
                                            strokeWidth={1.5}
                                            strokeDasharray="5 3"
                                        />
                                    ))}
                                </svg>

                                {/* Root node */}
                                <TreeNode x={rootX} y={rootY} isRoot />

                                {/* F1 nodes */}
                                {f1Branches.map((branch, i) => (
                                    <TreeNode
                                        key={branch.member.id}
                                        x={f1X[i]}
                                        y={f1Y}
                                        member={branch.member}
                                        level="f1"
                                        selected={selected?.member.id === branch.member.id}
                                        onClick={() => setSelected({ member: branch.member, level: "f1" })}
                                    />
                                ))}

                                {/* F2 nodes */}
                                {f2Nodes.map((pos) => (
                                    <TreeNode
                                        key={pos.member.id}
                                        x={pos.x}
                                        y={f2Y}
                                        member={pos.member}
                                        level="f2"
                                        selected={selected?.member.id === pos.member.id}
                                        onClick={() => setSelected({ member: pos.member, level: "f2" })}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail pane */}
                    {selected && (
                        <div className="w-full sm:w-96 sm:border-l border-border/40 p-5 overflow-auto shrink-0">
                            <MemberDetail
                                member={selected.member}
                                level={selected.level}
                                onBack={() => setSelected(null)}
                            />
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="shrink-0 border-t border-border/40 px-5 py-3 flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <svg width="24" height="10">
                            <line
                                x1="0" y1="5" x2="24" y2="5"
                                stroke="currentColor" strokeWidth="1.5"
                            />
                        </svg>
                        F1 – trực tiếp
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="24" height="10">
                            <line
                                x1="0" y1="5" x2="24" y2="5"
                                stroke="currentColor" strokeWidth="1.5"
                                strokeDasharray="5 3"
                            />
                        </svg>
                        F2 – gián tiếp
                    </div>
                </div>
            </div>
        </div>
    );
}
