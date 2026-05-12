"use client";

import { useEffect, useState } from "react";
import {
    Lock,
    Globe,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
} from "lucide-react";
import {
    changeAccountPassword,
    getAccountSecurityHistory,
    type LoginHistoryItem,
} from "@/lib/api/account";

export default function SecurityPage() {
    const [history, setHistory] = useState<LoginHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [showPassword, setShowPassword] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg] = useState("");
    const [pwErr, setPwErr] = useState("");

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        let mounted = true;

        async function loadHistory() {
            try {
                const data = await getAccountSecurityHistory();

                if (mounted) {
                    setHistory(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("LOAD_SECURITY_HISTORY_ERROR:", error);

                if (mounted) {
                    setHistory([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadHistory();

        return () => {
            mounted = false;
        };
    }, []);

    const handleChangePassword = async () => {
        setPwMsg("");
        setPwErr("");

        if (!passwords.currentPassword) {
            setPwErr("Vui lòng nhập mật khẩu hiện tại");
            return;
        }

        if (!passwords.newPassword || passwords.newPassword.length < 6) {
            setPwErr("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPwErr("Mật khẩu xác nhận không khớp");
            return;
        }

        setPwLoading(true);

        try {
            await changeAccountPassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });

            setPwMsg("Đổi mật khẩu thành công!");
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.error("CHANGE_PASSWORD_ERROR:", error);

            setPwErr(
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra khi đổi mật khẩu"
            );
        } finally {
            setPwLoading(false);
        }
    };

    const getBrowserName = (ua: string | null) => {
        if (!ua) return "Không rõ";
        if (ua.includes("Edg")) return "Edge";
        if (ua.includes("Chrome")) return "Chrome";
        if (ua.includes("Firefox")) return "Firefox";
        if (ua.includes("Safari")) return "Safari";
        return "Khác";
    };

    return (
        <div className="space-y-8 max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight">Bảo mật</h1>

            <div className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <h2 className="text-sm font-bold">Đổi mật khẩu</h2>
                </div>

                {pwMsg && (
                    <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        {pwMsg}
                    </div>
                )}

                {pwErr && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-500">
                        {pwErr}
                    </div>
                )}

                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Mật khẩu hiện tại
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={passwords.currentPassword}
                                onChange={(event) =>
                                    setPasswords((current) => ({
                                        ...current,
                                        currentPassword: event.target.value,
                                    }))
                                }
                                className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Mật khẩu mới
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwords.newPassword}
                            onChange={(event) =>
                                setPasswords((current) => ({
                                    ...current,
                                    newPassword: event.target.value,
                                }))
                            }
                            className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Xác nhận mật khẩu mới
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwords.confirmPassword}
                            onChange={(event) =>
                                setPasswords((current) => ({
                                    ...current,
                                    confirmPassword: event.target.value,
                                }))
                            }
                            className="h-10 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={pwLoading}
                    className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {pwLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Lock className="h-4 w-4" />
                    )}
                    Đổi mật khẩu
                </button>
            </div>

            <div className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <h2 className="text-sm font-bold">Lịch sử đăng nhập</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                        Chưa có lịch sử đăng nhập.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {history.map((entry) => (
                            <div
                                key={entry.id}
                                className="rounded-xl bg-secondary/30 px-4 py-3 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="text-sm font-medium">
                                        {getBrowserName(entry.userAgent)}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        IP: {entry.ip || "Không rõ"}
                                    </p>
                                </div>

                                <p className="text-xs text-muted-foreground text-right">
                                    {entry.createdAt
                                        ? new Date(entry.createdAt).toLocaleString(
                                              "vi-VN"
                                          )
                                        : "Đang cập nhật"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}