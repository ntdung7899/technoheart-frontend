
import Link from 'next/link';
import { Package, ShoppingBag, BarChart } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-muted border-r hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight">Admin Console</h2>
                </div>
                <nav className="px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background transition-colors">
                        <BarChart className="h-5 w-5" />
                        Overview
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background transition-colors">
                        <Package className="h-5 w-5" />
                        Products
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background transition-colors">
                        <ShoppingBag className="h-5 w-5" />
                        Orders
                    </Link>
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background transition-colors text-muted-foreground mt-8">
                        Back to Store
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
