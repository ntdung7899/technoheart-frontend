"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
    const availableBalanceVND = Number(profile!.totalEarnings || 0) - Number(profile!.paidEarnings || 0);
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
