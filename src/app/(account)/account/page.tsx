// Force re-compile
import { getSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { SummaryCard } from "@/components/account/SummaryCard";
import { ShoppingBag, Clock, Star, Heart } from "lucide-react";

export default async function AccountDashboard() {
    const session = await getSession();
    const userId = session?.id as string;

    const [user, totalOrders, pendingOrders, wishlistCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, points: true },
        }),
        prisma.order.count({ where: { userId } }),
        prisma.order.count({ where: { userId, status: "PENDING" } }),
        prisma.wishlistItem.count({ where: { userId } }),
    ]);

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Xin chào, {user?.name || "bạn"} 👋
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Chào mừng bạn trở lại với Technoheart
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    icon={<ShoppingBag className="h-5 w-5" />}
                    label="Tổng đơn hàng"
                    value={totalOrders}
                    subtitle="Tất cả đơn hàng của bạn"
                    color="blue"
                />
                <SummaryCard
                    icon={<Clock className="h-5 w-5" />}
                    label="Đang chờ"
                    value={pendingOrders}
                    subtitle="Đơn hàng chờ xử lý"
                    color="amber"
                />
                <SummaryCard
                    icon={<Heart className="h-5 w-5" />}
                    label="Yêu thích"
                    value={wishlistCount}
                    subtitle="Sản phẩm đã lưu"
                    color="rose"
                />
                <SummaryCard
                    icon={<Star className="h-5 w-5" />}
                    label="Điểm thưởng"
                    value={user?.points || 0}
                    subtitle="Điểm tích luỹ của bạn"
                    color="emerald"
                />
            </div>

            {/* Recently Viewed */}
            <div>
                <h2 className="text-base font-semibold text-slate-900 mb-4">Sản phẩm đã xem gần đây</h2>
                <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                    <p className="text-sm text-slate-400">
                        Tính năng đang được phát triển
                    </p>
                </div>
            </div>
        </div>
    );
}
