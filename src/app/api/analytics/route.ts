import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateFilter: any = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);
    const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    const orders = await prisma.order.findMany({
        where,
        include: {
            items: { include: { product: { select: { name: true } } } },
        },
    });

    // Top products
    const productMap = new Map<string, { name: string; revenue: number; quantity: number }>();
    for (const order of orders) {
        for (const item of order.items) {
            const name = item.product?.name || "Sản phẩm không rõ";
            const existing = productMap.get(name) || { name, revenue: 0, quantity: 0 };
            existing.revenue += Number(item.price) * item.quantity;
            existing.quantity += item.quantity;
            productMap.set(name, existing);
        }
    }
    const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const deliveredOrders = orders.filter(o => o.status === "DELIVERED");
    const deliveredRevenue = deliveredOrders.reduce((s, o) => s + Number(o.total), 0);

    return NextResponse.json({
        totalRevenue,
        deliveredRevenue,
        totalOrders: orders.length,
        deliveredOrders: deliveredOrders.length,
        avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
        topProducts,
    });
}
