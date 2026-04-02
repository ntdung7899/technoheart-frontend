
import { CartClient } from "@/components/cart/CartClient";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Giỏ hàng | Technoheart",
    description: "Xem lại các sản phẩm đã chọn.",
};

export default function CartPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 md:py-8 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-foreground font-medium">Giỏ hàng</span>
                </nav>

                <h1 className="text-3xl font-bold tracking-tight mb-8">Giỏ hàng của bạn</h1>
                <CartClient />
            </div>
        </div>
    );
}
