"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react"; // THÊM MỚI: Import icon ShieldAlert
import type { AffiliateData } from "./_components/constants";
import { RANK_DISPLAY, PV_RATE } from "./_components/constants";
import { NotRegisteredView } from "./_components/NotRegisteredView";
import { StatsCards } from "./_components/StatsCards";
import { RankProgression } from "./_components/RankProgression";
import { ReferralCode } from "./_components/ReferralCode";
import { CommissionRates } from "./_components/CommissionRates";
import { QuickLinks } from "./_components/QuickLinks";
import { WithdrawalCard } from "./_components/WithdrawalCard";

export default function AffiliatePage() {
    const [data, setData] = useState<AffiliateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [withdrawing, setWithdrawing] = useState(false);

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

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleRegister = async () => {
        setRegistering(true);
        setRegisterError(null);
        try {
            const res = await fetch("/api/affiliate/register", { method: "POST" });
            if (res.ok) {
                await fetchProfile();
            } else {
                const json = await res.json().catch(() => ({}));
                if (res.status === 401) {
                    window.location.href = "/login";
                } else {
                    setRegisterError(json.error || "Đăng ký thất bại, vui lòng thử lại");
                }
            }
        } catch (err) {
            console.error(err);
            setRegisterError("Lỗi kết nối, vui lòng thử lại");
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
            const res = await fetch("/api/affiliate/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    amount, 
                    bankName, 
                    accountNumber, 
                    accountName 
                }),
            });
            
            if (res.ok) {
                alert("Yêu cầu rút tiền đã được gửi thành công!");
                await fetchProfile();
            } else {
                const error = await res.json();
                alert(error.message || "Có lỗi xảy ra khi xử lý giao dịch");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối đến máy chủ");
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
        return <NotRegisteredView registering={registering} onRegister={handleRegister} error={registerError} />;
    }

    const { profile, stats } = data;
    const rankDisplay = RANK_DISPLAY[profile!.rank] || RANK_DISPLAY.BA;
    const RankIcon = rankDisplay.icon;
    
    const totalEarningsVND = Number(profile!.totalEarnings || 0);
    const paidEarningsVND = Number(profile!.paidEarnings || 0);
    
    // 1. Tính 10% Thuế TNCN
    const taxAmountVND = totalEarningsVND * 0.1;
    const taxAmountPV = Math.floor(taxAmountVND / PV_RATE);

    // 2. Tính 90% còn lại cho Ví Khả Dụng (Trừ đi phần đã rút)
    const availableBalanceVND = Math.max(0, (totalEarningsVND * 0.9) - paidEarningsVND);
    const availableBalancePV = Math.floor(availableBalanceVND / PV_RATE);

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
            <WithdrawalCard 
                balance={availableBalancePV}
                onWithdraw={handleWithdraw}
                loading={withdrawing}
                lastBankInfo={profile?.lastWithdrawal}
            />
            {taxAmountVND > 0 && (
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-500">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-orange-800 dark:text-orange-400 text-sm">Ví Thuế TNCN (10%)</h2>
                            <p className="text-orange-700/80 dark:text-orange-500/80 text-xs mt-0.5">Hệ thống tạm giữ để đóng thuế theo quy định nhà nước</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="font-bold text-orange-700 dark:text-orange-400">{taxAmountPV.toLocaleString()} PV</p>
                        <p className="text-xs text-orange-600/80 dark:text-orange-500/80 mt-0.5">≈ {taxAmountVND.toLocaleString("vi-VN")} VNĐ</p>
                    </div>
                </div>
            )}
            <StatsCards profile={profile!} stats={stats!} />
            <RankProgression profile={profile!} stats={stats!} rankGradient={rankDisplay.gradient} />
            <ReferralCode referralCode={profile!.referralCode} />
            <CommissionRates stats={stats!} />
            <QuickLinks stats={stats!} />

            <p className="text-xs text-center text-muted-foreground">
                Quy đổi: 1 PV = {PV_RATE.toLocaleString("vi-VN")} VNĐ
            </p>
        </div>
    );
}