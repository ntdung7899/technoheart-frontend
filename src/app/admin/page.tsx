
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
    const productsCount = await prisma.product.count();
    const ordersCount = await prisma.order.count();
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
                    <div className="mt-2 text-3xl font-bold">{productsCount}</div>
                </div>
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                    <div className="mt-2 text-3xl font-bold">{ordersCount}</div>
                </div>
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Revenue (Est)</h3>
                    <div className="mt-2 text-3xl font-bold">$0.00</div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="p-4 font-medium">Order ID</th>
                                <th className="p-4 font-medium">Customer</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Total</th>
                                <th className="p-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="p-4 font-mono">{order.id.slice(0, 8)}...</td>
                                    <td className="p-4">{order.user.name || order.user.email}</td>
                                    <td className="p-4 capitalize">{order.status.toLowerCase()}</td>
                                    <td className="p-4">${Number(order.total).toFixed(2)}</td>
                                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {recentOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No orders yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-right">
                    <Link href="/admin/orders" className="text-sm text-primary hover:underline">View All Orders</Link>
                </div>
            </div>
        </div>
    );
}
