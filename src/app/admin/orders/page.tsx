import prisma from "@/lib/prisma";
import AdminOrdersClient from "@/components/admin/OrdersClient";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            _count: { select: { items: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const serialized = orders.map(o => ({
        id: o.id,
        total: Number(o.total).toString(),
        status: o.status,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt.toISOString(),
        user: { name: o.user.name, email: o.user.email },
        _count: o._count,
    }));

    return <AdminOrdersClient initialOrders={serialized} />;
}