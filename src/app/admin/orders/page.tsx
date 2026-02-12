
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            _count: { select: { items: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight mb-8">Orders</h1>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="p-4 font-medium">Order ID</th>
                            <th className="p-4 font-medium">Customer</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Items</th>
                            <th className="p-4 font-medium">Total</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-muted/10">
                                <td className="p-4 font-mono">{order.id.slice(0, 8)}...</td>
                                <td className="p-4">{order.user.name || order.user.email}</td>
                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">{order._count.items} items</td>
                                <td className="p-4 font-bold">${Number(order.total).toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/orders/${order.id}`} className="text-muted-foreground hover:text-primary">
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
