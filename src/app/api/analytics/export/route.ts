import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateFilter: any = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);
    const where = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    // Get orders
    const orders = await prisma.order.findMany({
        where,
        include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });

    // Calculate top products
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

    // Stats
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const deliveredOrders = orders.filter(o => o.status === "DELIVERED");
    const deliveredRevenue = deliveredOrders.reduce((s, o) => s + Number(o.total), 0);

    // Build Excel
    const wb = XLSX.utils.book_new();

    // Sheet 1: Overview
    const overviewData = [
        ["Chỉ số", "Giá trị"],
        ["Tổng đơn hàng", orders.length],
        ["Đơn hoàn thành", deliveredOrders.length],
        ["Tổng doanh thu", totalRevenue],
        ["Doanh thu (đã giao)", deliveredRevenue],
        ["Giá trị TB/đơn", orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overviewData), "Tổng quan");

    // Sheet 2: Top Products
    const productData = [
        ["Sản phẩm", "Doanh thu (VND)", "Số lượng bán"],
        ...topProducts.map(p => [p.name, p.revenue, p.quantity]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(productData), "Top sản phẩm");

    // Sheet 3: Orders
    const orderData = [
        ["Mã đơn", "Khách hàng", "Email", "Trạng thái", "Tổng tiền", "Ngày tạo"],
        ...orders.map(o => [
            o.id,
            o.user.name || "N/A",
            o.user.email,
            o.status,
            Number(o.total),
            new Date(o.createdAt).toLocaleDateString("vi-VN"),
        ]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(orderData), "Đơn hàng");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="bao-cao-${new Date().toISOString().slice(0, 10)}.xlsx"`,
        },
    });
}
