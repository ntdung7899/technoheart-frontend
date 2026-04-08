import { DollarSign, TrendingUp, Award, UserPlus, Loader2 } from "lucide-react";
import { PV_RATE, COMMISSION_TABLE, ACHIEVEMENT_TABLE } from "./constants";

interface Props {
    registering: boolean;
    onRegister: () => void;
    error?: string | null;
}

export function NotRegisteredView({ registering, onRegister, error }: Props) {
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
                    onClick={onRegister}
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
                {error && (
                    <p className="mt-3 text-sm text-red-300 font-medium">{error}</p>
                )}
            </div>
        </div>
    );
}
