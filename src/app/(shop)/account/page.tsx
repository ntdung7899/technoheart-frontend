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
        <div className="space-y-8">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                    Xin chào, {user?.name || "bạn"} 👋
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
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
                />
                <SummaryCard
                    icon={<Clock className="h-5 w-5" />}
                    label="Đang chờ"
                    value={pendingOrders}
                    subtitle="Đơn hàng chờ xử lý"
                />
                <SummaryCard
                    icon={<Heart className="h-5 w-5" />}
                    label="Yêu thích"
                    value={wishlistCount}
                    subtitle="Sản phẩm đã lưu"
                />
                <SummaryCard
                    icon={<Star className="h-5 w-5" />}
                    label="Điểm thưởng"
                    value={user?.points || 0}
                    subtitle="Điểm tích luỹ của bạn"
                />
            </div>

            {/* Recently Viewed */}
            <div>
                <h2 className="text-lg font-bold mb-4">Sản phẩm đã xem gần đây</h2>
                <div className="rounded-2xl border border-border/40 bg-card/50 p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Tính năng đang được phát triển
                    </p>
                </div>
            </div>
        </div>
    );
}
