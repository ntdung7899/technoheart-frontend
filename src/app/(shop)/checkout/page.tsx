
"use client";

import { useCartStore } from "@/store/cart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck, Truck, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";


export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        referralCode: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        zip: formData.zip,
                        country: formData.country,
                    },
                    total: total(),
                    referralCode: formData.referralCode || undefined,
                }),
            });

            if (response.ok) {
                clearCart();
                router.push("/checkout/success");
            } else {
                const errorData = await response.json().catch(() => null);
                if (errorData?.invalidItems) {
                    alert(`Sản phẩm không còn tồn tại: ${errorData.invalidItems.join(", ")}. Vui lòng xóa giỏ hàng và thêm lại.`);
                } else {
                    alert("Không thể đặt hàng. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert("Đã xảy ra lỗi.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
                <p className="text-muted-foreground mb-8">Bạn cần có sản phẩm trong giỏ hàng để tiến hành thanh toán.</p>
                <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Simple Header */}
            <div className="border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-16 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/cart" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Quay lại giỏ hàng
                    </Link>
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
                        <span className="text-primary">01 Giỏ hàng</span>
                        <span className="h-px w-8 bg-border" />
                        <span className="text-foreground">02 Thanh toán</span>
                        <span className="h-px w-8 bg-border" />
                        <span>03 Hoàn tất</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Thông tin giao hàng</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 p-8 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Địa chỉ cụ thể</label>
                                        <input
                                            type="text"
                                            name="street"
                                            required
                                            placeholder="Số nhà, tên đường..."
                                            className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={formData.street}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Thành phố</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Tỉnh / Thành</label>
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Mã bưu điện</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                required
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.zip}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Quốc gia</label>
                                            <input
                                                type="text"
                                                name="country"
                                                required
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.country}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Code */}
                            <div className="space-y-2 pt-4">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                    Mã giới thiệu (không bắt buộc)
                                </label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    placeholder="VD: TH-ABC123"
                                    className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-4 mb-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight">Phương thức thanh toán</h2>
                            </div>

                            <div className="p-8 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-xl space-y-4">
                                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Giao hàng tận nơi mới trả tiền</p>
                                        </div>
                                    </div>
                                    <div className="h-6 w-6 rounded-full border-4 border-primary flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">Các phương thức thanh toán khác đang được phát triển.</p>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 flex items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            Đang xử lý đơn hàng...
                                        </>
                                    ) : (
                                        `Hoàn tất đặt hàng - ${formatPrice(total())}`
                                    )}
                                </button>
                                <p className="text-center text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-6 flex items-center justify-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-green-500" /> Thanh toán an toàn & bảo mật
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 sticky top-32">
                        <div className="rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-xl relative overflow-hidden">
                            <h2 className="text-2xl font-bold mb-8 tracking-tight">Tóm tắt đơn hàng</h2>

                            <ul className="space-y-4 mb-8">
                                {items.map((item) => (
                                    <li key={item.id} className="flex gap-4 items-center group">
                                        <div className="relative h-16 w-16 min-w-[4rem] rounded-xl border border-border/50 bg-white p-1 overflow-hidden">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1 group-hover:scale-110 transition-transform"
                                                />
                                            )}
                                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center border-2 border-background">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Đơn giá: {formatPrice(item.price)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-4 pt-6 border-t border-border/40">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-muted-foreground">Tạm tính</span>
                                    <span>{formatPrice(total())}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-muted-foreground">Giao hàng</span>
                                    <span className="text-green-500 font-semibold uppercase text-xs tracking-wider bg-green-500/10 px-2 py-0.5 rounded-full">Miễn phí</span>
                                </div>
                                <div className="pt-4 flex justify-between items-baseline">
                                    <span className="text-xl font-bold">Tổng cộng</span>
                                    <span className="text-3xl font-bold text-primary tracking-tighter">{formatPrice(total())}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider text-right">Đã bao gồm thuế VAT</p>
                            </div>

                            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                                <div className="text-xs leading-snug">
                                    <p className="font-semibold text-foreground">Chính sách bảo vệ người mua</p>
                                    <p className="text-muted-foreground">Hoàn tiền 100% nếu hàng không đúng mô tả hoặc gặp sự cố vận chuyển.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
