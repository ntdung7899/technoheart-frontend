"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users, TrendingUp, Copy, Check, Share2, Award,
    ArrowRight, Loader2, Star, Crown, Shield, Zap,
    DollarSign, UserPlus, BarChart3
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AffiliateData {
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

const RANK_DISPLAY: Record<string, { label: string; icon: typeof Star; gradient: string; badge: string }> = {
    BA: { label: "Brand Ambassador", icon: Star, gradient: "from-slate-500 to-slate-700", badge: "bg-slate-100 text-slate-700" },
    VIP: { label: "VIP Partner", icon: Zap, gradient: "from-blue-500 to-blue-700", badge: "bg-blue-100 text-blue-700" },
    VVIP: { label: "VVIP Partner", icon: Crown, gradient: "from-purple-500 to-purple-700", badge: "bg-purple-100 text-purple-700" },
    L1: { label: "Đại diện kinh doanh", icon: Shield, gradient: "from-emerald-500 to-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
    L2: { label: "Giám đốc khu vực", icon: Award, gradient: "from-amber-500 to-amber-700", badge: "bg-amber-100 text-amber-700" },
    L3: { label: "Giám đốc vùng", icon: Award, gradient: "from-red-500 to-red-700", badge: "bg-red-100 text-red-700" },
    L4: { label: "Đại sứ TH quốc gia", icon: Crown, gradient: "from-pink-500 to-pink-700", badge: "bg-pink-100 text-pink-700" },
    L5: { label: "Đại sứ TH toàn cầu", icon: Crown, gradient: "from-indigo-500 to-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
};

const COMMISSION_TABLE = [
    { rank: "BA", pv: "≥ 100 PV", f1: "5%", f2: "—" },
    { rank: "VIP", pv: "≥ 500 PV", f1: "8%", f2: "3%" },
    { rank: "VVIP", pv: "≥ 1.000 PV", f1: "10%", f2: "3,5%" },
];

const ACHIEVEMENT_TABLE = [
    { level: "L1", title: "Đại diện kinh doanh", rate: "3%", condition: "VIP + Nhóm ≥ 20.000 PV" },
    { level: "L2", title: "Giám đốc khu vực", rate: "5%", condition: "VIP + Nhóm ≥ 60.000 PV" },
    { level: "L3", title: "Giám đốc vùng", rate: "7%", condition: "VVIP + Nhóm ≥ 170.000 PV" },
    { level: "L4", title: "Đại sứ TH quốc gia", rate: "8%", condition: "VVIP + Nhóm ≥ 600.000 PV" },
    { level: "L5", title: "Đại sứ TH toàn cầu", rate: "9%", condition: "VVIP + Nhóm ≥ 2.000.000 PV" },
];

export default function AffiliatePage() {
    const [data, setData] = useState<AffiliateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/affiliate/profile");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const PV_RATE = 26000;

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleRegister = async () => {
        setRegistering(true);
        try {
            const res = await fetch("/api/affiliate/register", { method: "POST" });
            if (res.ok) {
                await fetchProfile();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRegistering(false);
        }
    };

    const copyReferralLink = async () => {
        if (!data?.profile?.referralCode) return;
        const link = `${window.location.origin}/signup?ref=${data.profile.referralCode}`;
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(link);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = link;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement("textarea");
            textarea.value = link;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // ====== NOT REGISTERED ======
    if (!data?.registered) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Affiliate Marketing</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Kiếm thu nhập không giới hạn khi giới thiệu sản phẩm Technoheart
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: DollarSign, title: "Hoa hồng đến 10%", desc: "Nhận hoa hồng từ F1 và F2" },
                        { icon: TrendingUp, title: "Thu nhập không giới hạn", desc: "Càng nhiều giới thiệu, càng nhiều thu nhập" },
                        { icon: Award, title: "Thăng hạng liên tục", desc: "Từ BA đến Đại sứ thương hiệu" },
                    ].map((b, i) => (
                        <div key={i} className="rounded-2xl border border-border/40 bg-card/50 p-5 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <b.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-sm">{b.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                        </div>
                    ))}
                </div>

                {/* PV Info */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <h2 className="font-bold mb-2">Quy đổi PV</h2>
                    <p className="text-sm text-muted-foreground">
                        1 PV = <span className="font-bold text-foreground">{PV_RATE.toLocaleString("vi-VN")} VNĐ</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Ví dụ: Đơn hàng 2.600.000đ = 100 PV
                    </p>
                </div>

                {/* Commission Table */}
                <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
                    <div className="p-4 border-b border-border/40">
                        <h2 className="font-bold">Module 1: Hoa hồng giới thiệu</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/30">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Rank</th>
                                    <th className="px-4 py-3 text-left font-semibold">PV cá nhân</th>
                                    <th className="px-4 py-3 text-center font-semibold">F1</th>
                                    <th className="px-4 py-3 text-center font-semibold">F2</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMMISSION_TABLE.map((row) => (
                                    <tr key={row.rank} className="border-t border-border/20">
                                        <td className="px-4 py-3 font-bold">{row.rank}</td>
                                        <td className="px-4 py-3">{row.pv}</td>
                                        <td className="px-4 py-3 text-center text-primary font-bold">{row.f1}</td>
                                        <td className="px-4 py-3 text-center">{row.f2}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Achievement Table */}
                <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
                    <div className="p-4 border-b border-border/40">
                        <h2 className="font-bold">Module 2-3: Thưởng thành tích & Danh hiệu</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/30">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Cấp</th>
                                    <th className="px-4 py-3 text-left font-semibold">Danh hiệu</th>
                                    <th className="px-4 py-3 text-center font-semibold">Thưởng</th>
                                    <th className="px-4 py-3 text-left font-semibold">Điều kiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ACHIEVEMENT_TABLE.map((row) => (
                                    <tr key={row.level} className="border-t border-border/20">
                                        <td className="px-4 py-3 font-bold">{row.level}</td>
                                        <td className="px-4 py-3">{row.title}</td>
                                        <td className="px-4 py-3 text-center text-primary font-bold">{row.rate}</td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">{row.condition}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Register CTA */}
                <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-6 text-white text-center">
                    <h2 className="text-xl font-bold mb-2">Bắt đầu kiếm thu nhập ngay!</h2>
                    <p className="text-sm text-white/80 mb-4">
                        Đăng ký miễn phí, nhận mã giới thiệu và bắt đầu chia sẻ
                    </p>
                    <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="inline-flex items-center gap-2 rounded-xl bg-white text-primary font-bold px-8 py-3 text-sm hover:bg-white/90 transition-all disabled:opacity-70"
                    >
                        {registering ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <UserPlus className="h-4 w-4" />
                        )}
                        <span>{registering ? "Đang đăng ký..." : "Đăng ký Affiliate"}</span>
                    </button>
                </div>
            </div>
        );
    }

    // ====== REGISTERED — DASHBOARD ======
    const { profile, stats } = data;
    const rankDisplay = RANK_DISPLAY[profile!.rank] || RANK_DISPLAY.BA;
    const RankIcon = rankDisplay.icon;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Affiliate Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Quản lý hoạt động affiliate của bạn</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${rankDisplay.badge}`}>
                    <RankIcon className="h-4 w-4" />
                    {rankDisplay.label}
                </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                        <DollarSign className="h-4 w-4" />
                        Tổng thu nhập
                    </div>
                    <p className="text-xl font-bold">{formatPrice(profile!.totalEarnings)}</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                        <TrendingUp className="h-4 w-4" />
                        PV cá nhân
                    </div>
                    <p className="text-xl font-bold">{profile!.personalPV.toLocaleString("vi-VN")}</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                        <BarChart3 className="h-4 w-4" />
                        PV nhóm
                    </div>
                    <p className="text-xl font-bold">{profile!.teamPV.toLocaleString("vi-VN")}</p>
                </div>
                <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                        <Users className="h-4 w-4" />
                        Mạng lưới
                    </div>
                    <p className="text-xl font-bold">
                        {stats!.f1Count} <span className="text-sm font-normal text-muted-foreground">F1</span>
                        {" / "}
                        {stats!.f2Count} <span className="text-sm font-normal text-muted-foreground">F2</span>
                    </p>
                </div>
            </div>

            {/* Rank Progression */}
            {stats!.progression.nextRank && (
                <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold">Tiến trình thăng hạng</h3>
                        <span className="text-xs text-muted-foreground">
                            {profile!.rank} → {stats!.progression.nextRank}
                        </span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary/50 overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${rankDisplay.gradient} transition-all duration-500`}
                            style={{ width: `${stats!.progression.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Còn cần <span className="font-bold text-foreground">{stats!.progression.pvNeeded.toLocaleString("vi-VN")} PV {stats!.progression.pvType === "team" ? "nhóm" : "cá nhân"}</span> để đạt {stats!.progression.nextRank}
                    </p>
                </div>
            )}

            {/* Referral Code */}
            <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
                <h3 className="text-sm font-bold mb-3">Mã giới thiệu của bạn</h3>
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 rounded-xl bg-secondary/50 px-4 py-3 font-mono text-lg font-semibold tracking-wider">
                        {profile!.referralCode}
                    </div>
                    <button
                        onClick={copyReferralLink}
                        className="flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-3 text-sm font-bold hover:bg-primary/90 transition-all"
                    >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="hidden sm:inline">{copied ? "Đã copy!" : "Copy link"}</span>
                    </button>
                    <button
                        onClick={() => {
                            const link = `${window.location.origin}/signup?ref=${profile!.referralCode}`;
                            if (navigator.share) {
                                navigator.share({ title: "Technoheart Affiliate", url: link });
                            }
                        }}
                        className="flex items-center justify-center rounded-xl border border-border/40 bg-card px-3 py-3 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                    Link giới thiệu: <code className="text-primary">{typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${profile!.referralCode}` : ""}</code>
                </p>
            </div>

            {/* Commission Rates */}
            <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
                <h3 className="text-sm font-bold mb-3">Tỷ lệ hoa hồng hiện tại</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-center">
                        <p className="text-2xl font-bold text-primary">{(stats!.rates.f1Rate * 100).toFixed(0)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Hoa hồng F1</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 border border-border/20 p-4 text-center">
                        <p className="text-2xl font-bold">{stats!.rates.f2Rate > 0 ? `${(stats!.rates.f2Rate * 100).toFixed(1)}%` : "—"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Hoa hồng F2</p>
                    </div>
                </div>
                {stats!.achievement && (
                    <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-center gap-3">
                        <Award className="h-5 w-5 text-amber-600" />
                        <div>
                            <p className="text-sm font-bold text-amber-700">{stats!.achievement.label}</p>
                            <p className="text-xs text-amber-600">Thưởng thành tích: {(stats!.achievement.rate * 100).toFixed(0)}%</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Links */}
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
                            <p className="text-xs text-muted-foreground">{stats!.f1Count + stats!.f2Count} thành viên</p>
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
                                {formatPrice(stats!.pendingEarnings)} đang chờ
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            </div>

            {/* PV Rate Info */}
            <p className="text-xs text-center text-muted-foreground">
                Quy đổi: 1 PV = {PV_RATE.toLocaleString("vi-VN")} VNĐ
            </p>
        </div>
    );
}
