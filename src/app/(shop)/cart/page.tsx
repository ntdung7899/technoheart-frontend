
import { CartClient } from "@/components/cart/CartClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Giỏ hàng | TechnoHeart",
    description: "Xem lại các sản phẩm đã chọn.",
};

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Giỏ hàng</h1>
            <CartClient />
        </div>
    );
}
