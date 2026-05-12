"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import type { AffiliateData } from "./_components/constants";
import { RANK_DISPLAY, PV_RATE } from "./_components/constants";
import { NotRegisteredView } from "./_components/NotRegisteredView";
import { StatsCards } from "./_components/StatsCards";
import { RankProgression } from "./_components/RankProgression";
import { ReferralCode } from "./_components/ReferralCode";
import { CommissionRates } from "./_components/CommissionRates";
import { QuickLinks } from "./_components/QuickLinks";
import { WithdrawalCard } from "./_components/WithdrawalCard";
import {
    getAffiliateProfile,
    registerAffiliate,
    withdrawAffiliate,
    type AffiliateData as ApiAffiliateData,
} from "@/lib/api/affiliate";

type UiStats = NonNullable<AffiliateData["stats"]>;
type UiRankInfo = UiStats["rankInfo"];

const RANK_RULES: Record<string, UiRankInfo> = {
    BA: {
        label: "Brand Ambassador",
        minPersonalPV: 100,
        minTeamPV: 0,
        description: "Cấp bậc khởi đầu dành cho cộng tác viên giới thiệu sản phẩm.",
        color: "slate",
    },
    VIP: {
        label: "VIP Partner",
        minPersonalPV: 500,
        minTeamPV: 0,
        description: "Đối tác VIP có hiệu suất cá nhân tốt và được hưởng hoa hồng cao hơn.",
        color: "blue",
    },
    VVIP: {
        label: "VVIP Partner",
        minPersonalPV: 1000,
        minTeamPV: 0,
        description: "Đối tác VVIP có hiệu suất cao, đủ điều kiện nhận thêm quyền lợi nâng cao.",
        color: "purple",
    },
    L1: {
        label: "Đại diện kinh doanh",
        minPersonalPV: 500,
        minTeamPV: 20000,
        description: "Cấp thành tựu dành cho đối tác có nhóm đạt tối thiểu 20.000 PV.",
        color: "emerald",
    },
    L2: {
        label: "Giám đốc khu vực",
        minPersonalPV: 500,
        minTeamPV: 60000,
        description: "Cấp thành tựu dành cho đối tác có nhóm đạt tối thiểu 60.000 PV.",
        color: "amber",
    },
    L3: {
        label: "Giám đốc vùng",
        minPersonalPV: 1000,
        minTeamPV: 170000,
        description: "Cấp thành tựu dành cho đối tác VVIP có nhóm đạt tối thiểu 170.000 PV.",
        color: "red",
    },
    L4: {
        label: "Đại sứ TH quốc gia",
        minPersonalPV: 1000,
        minTeamPV: 600000,
        description: "Cấp thành tựu cấp quốc gia cho đối tác VVIP có nhóm đạt tối thiểu 600.000 PV.",
        color: "pink",
    },
    L5: {
        label: "Đại sứ TH toàn cầu",
        minPersonalPV: 1000,
        minTeamPV: 2000000,
        description: "Cấp thành tựu cao nhất cho đối tác VVIP có nhóm đạt tối thiểu 2.000.000 PV.",
        color: "indigo",
    },
};

const NEXT_RANK: Record<string, string | null> = {
    BA: "VIP",
    VIP: "VVIP",
    VVIP: "L1",
    L1: "L2",
    L2: "L3",
    L3: "L4",
    L4: "L5",
    L5: null,
};

function normalizeAffiliateData(apiData: ApiAffiliateData): AffiliateData {
    if (!apiData.registered || !apiData.profile) {
        return {
            registered: false,
        };
    }

    const profile = apiData.profile;
    const apiStats = apiData.stats;

    const rank = profile.rank || "BA";
    const rankInfo = RANK_RULES[rank] || RANK_RULES.BA;

    const personalPV = Number(profile.personalPV || 0);
    const teamPV = Number(profile.teamPV || 0);

    const nextRank = NEXT_RANK[rank] ?? null;
    const nextRankInfo = nextRank ? RANK_RULES[nextRank] : null;

    const pvType: "personal" | "team" =
        rank === "BA" || rank === "VIP" || rank === "VVIP"
            ? "personal"
            : "team";

    const currentPV = pvType === "personal" ? personalPV : teamPV;

    const targetPV = nextRankInfo
        ? pvType === "personal"
            ? nextRankInfo.minPersonalPV
            : nextRankInfo.minTeamPV
        : currentPV;

    const pvNeeded = nextRankInfo
        ? Math.max(0, targetPV - currentPV)
        : 0;

    const progress =
        targetPV > 0 ? Math.min(100, (currentPV / targetPV) * 100) : 100;

    const f1Rate =
        rank === "BA"
            ? 0.05
            : rank === "VIP"
              ? 0.08
              : 0.1;

    const f2Rate =
        rank === "BA"
            ? 0
            : rank === "VIP"
              ? 0.03
              : 0.035;

    return {
        registered: true,
        profile: {
            id: profile.id,
            referralCode: profile.referralCode,
            rank: profile.rank || "BA",
            personalPV: personalPV,
            teamPV: teamPV,
            totalEarnings: Number(profile.totalEarnings || 0),
            paidEarnings: Number(profile.paidEarnings || 0),
            lastWithdrawal: profile.lastWithdrawal
                ? {
                      bankName: profile.lastWithdrawal.bankName,
                      accountNumber: profile.lastWithdrawal.accountNumber,
                      accountName: profile.lastWithdrawal.accountName,
                  }
                : undefined,
        },
        stats: {
            f1Count: Number(apiStats?.f1Count || 0),
            f2Count: Number(apiStats?.f2Count || 0),

            // Không đổi logic tiền: pending chỉ lấy pendingCommissions từ BE
            pendingEarnings: Number(apiStats?.pendingCommissions || 0),

            rates: {
                f1Rate,
                f2Rate,
            },

            achievement: null,

            progression: {
                nextRank,
                pvNeeded,
                progress,
                pvType,
            },

            rankInfo,
        },
    };
}

export default function AffiliatePage() {
    const [data, setData] = useState<AffiliateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [withdrawing, setWithdrawing] = useState(false);

    const fetchProfile = async () => {
        try {
            const apiData = await getAffiliateProfile();
            setData(normalizeAffiliateData(apiData));
        } catch (err) {
            console.error("FETCH_AFFILIATE_PROFILE_ERROR:", err);

            if (err instanceof Error && err.message.includes("đăng nhập")) {
                window.location.href = "/login";
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleRegister = async () => {
        setRegistering(true);
        setRegisterError(null);

        try {
            await registerAffiliate();
            await fetchProfile();
        } catch (err) {
            console.error("REGISTER_AFFILIATE_ERROR:", err);

            setRegisterError(
                err instanceof Error
                    ? err.message
                    : "Đăng ký thất bại, vui lòng thử lại"
            );
        } finally {
            setRegistering(false);
        }
    };

    const handleWithdraw = async (
        amount: number,
        bankName: string,
        accountNumber: string,
        accountName: string
    ) => {
        setWithdrawing(true);

        try {
            await withdrawAffiliate({
                amount,
                bankName,
                accountNumber,
                accountName,
            });

            alert("Yêu cầu rút tiền đã được gửi thành công!");
            await fetchProfile();
        } catch (err) {
            console.error("WITHDRAW_AFFILIATE_ERROR:", err);

            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi xử lý giao dịch"
            );
        } finally {
            setWithdrawing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data?.registered) {
        return (
            <NotRegisteredView
                registering={registering}
                onRegister={handleRegister}
                error={registerError}
            />
        );
    }

    const { profile, stats } = data;

    if (!profile || !stats) {
        return (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
                Không tải được dữ liệu affiliate. Vui lòng thử lại sau.
            </div>
        );
    }

    const rankDisplay = RANK_DISPLAY[profile.rank] || RANK_DISPLAY.BA;
    const RankIcon = rankDisplay.icon;

    const totalEarningsVND = Number(profile.totalEarnings || 0);
    const paidEarningsVND = Number(profile.paidEarnings || 0);

    // 1. Tính 10% Thuế TNCN
    const taxAmountVND = totalEarningsVND * 0.1;
    const taxAmountPV = Math.floor(taxAmountVND / PV_RATE);

    // 2. Tính 90% còn lại cho Ví Khả Dụng, trừ phần đã rút
    const availableBalanceVND = Math.max(
        0,
        totalEarningsVND * 0.9 - paidEarningsVND
    );
    const availableBalancePV = Math.floor(availableBalanceVND / PV_RATE);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Affiliate Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Quản lý hoạt động affiliate của bạn
                    </p>
                </div>

                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${rankDisplay.badge}`}
                >
                    <RankIcon className="h-4 w-4" />
                    {rankDisplay.label}
                </span>
            </div>

            <WithdrawalCard
                balance={availableBalancePV}
                onWithdraw={handleWithdraw}
                loading={withdrawing}
                savedBankInfo={profile.lastWithdrawal}
            />

            {taxAmountVND > 0 && (
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-500">
                            <ShieldAlert className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold text-orange-800 dark:text-orange-400 text-sm">
                                Ví Thuế TNCN (10%)
                            </h2>
                            <p className="text-orange-700/80 dark:text-orange-500/80 text-xs mt-0.5">
                                Hệ thống tạm giữ để đóng thuế theo quy định nhà nước
                            </p>
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="font-bold text-orange-700 dark:text-orange-400">
                            {taxAmountPV.toLocaleString()} PV
                        </p>
                        <p className="text-xs text-orange-600/80 dark:text-orange-500/80 mt-0.5">
                            ≈ {taxAmountVND.toLocaleString("vi-VN")} VNĐ
                        </p>
                    </div>
                </div>
            )}

            <StatsCards profile={profile} stats={stats} />

            <RankProgression
                profile={profile}
                stats={stats}
                rankGradient={rankDisplay.gradient}
            />

            <ReferralCode referralCode={profile.referralCode} />

            <CommissionRates stats={stats} />

            <QuickLinks stats={stats} />

            <p className="text-xs text-center text-muted-foreground">
                Quy đổi: 1 PV = {PV_RATE.toLocaleString("vi-VN")} VNĐ
            </p>
        </div>
    );
}