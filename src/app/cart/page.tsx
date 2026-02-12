
import { CartClient } from "@/components/cart/CartClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shopping Cart | TechnoHeart",
    description: "Review your selected items.",
};

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
            <CartClient />
        </div>
    );
}
