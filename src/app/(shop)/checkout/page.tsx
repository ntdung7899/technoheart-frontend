"use client";

import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ShieldCheck, Truck, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/api/orders";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        street: "",
        ward: "",
        district: "",
        city: "",
        referralCode: "",
    });
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");


    useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
        .then((res) => res.json())
        .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then((res) => res.json())
                .then((data) => {
                    setDistricts(data.districts);
                    setWards([]); // Reset phường xã
                    setFormData(prev => ({ ...prev, city: data.name, ward: "" }));
                });
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then((res) => res.json())
                .then((data) => {
                    setWards(data.wards);
                    setFormData(prev => ({ ...prev, district: data.name })); 
                });
        }
    }, [selectedDistrict]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createOrder({
                customerName: formData.name,
                customerPhone: formData.phone,
                paymentMethod,
                referralCode: formData.referralCode || undefined,
                shippingFee: 0,
                address: {
                    fullName: formData.name,
                    phone: formData.phone,
                    street: `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.city}`,
                    city: formData.city,
                    state: formData.district,
                    zip: "",
                    country: "Việt Nam",
                },
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            });

            clearCart();

            if (paymentMethod === "BANK") {
                router.push(
                    `/checkout/pay?code=${encodeURIComponent(
                        result.code || result.transactionId
                    )}&amount=${encodeURIComponent(String(result.total))}`
                );
            } else {
                router.push(
                    `/checkout/success?code=${encodeURIComponent(
                        result.code || result.transactionId
                    )}`
                );
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể đặt hàng. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const PV_EXCHANGE_RATE = 26000;
    const pvValue = Math.floor(total() / PV_EXCHANGE_RATE);

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
                            <div className="space-y-4 relative z-10">
                                    {/* Hàng 1: Tên & SĐT */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Họ và tên</label>
                                            <input type="text" name="name" required placeholder="Nhập họ tên người nhận..."
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Số điện thoại</label>
                                            <input type="tel" name="phone" required placeholder="Nhập số điện thoại..."
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Hàng 2: Địa chỉ cụ thể */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Địa chỉ cụ thể (Số nhà, đường)</label>
                                        <input type="text" name="street" required placeholder="Số nhà, tên đường..."
                                            className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            value={formData.street} onChange={handleChange} />
                                    </div>

                                    {/* Hàng 3: Phường & TP */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Tỉnh / Thành phố</label>
                                            <select 
                                                required
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                                onChange={(e) => {
                                                    setSelectedProvince(e.target.value);
                                                    const name = provinces.find(p => p.code == e.target.value)?.name;
                                                    setFormData({ ...formData, city: name || "" });
                                                }}
                                            >
                                                <option value="">Chọn Tỉnh/Thành phố</option>
                                                {provinces.map((p) => (
                                                    <option key={p.code} value={p.code}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Quận / Huyện</label>
                                            <select 
                                                required
                                                disabled={!selectedProvince}
                                                className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none disabled:opacity-50"
                                                onChange={(e) => {
                                                    setSelectedDistrict(e.target.value);
                                                    // Bạn có thể lưu tên quận vào formData nếu DB yêu cầu
                                                }}
                                            >
                                                <option value="">Chọn Quận/Huyện</option>
                                                {districts.map((d) => (
                                                    <option key={d.code} value={d.code}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Hàng 4: Phường/Xã */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Phường / Xã</label>
                                        <select 
                                            required
                                            disabled={!selectedDistrict}
                                            className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none disabled:opacity-50"
                                            onChange={(e) => {
                                                const name = wards.find(w => w.code == e.target.value)?.name;
                                                setFormData({ ...formData, ward: name || "" });
                                            }}
                                        >
                                            <option value="">Chọn Phường/Xã</option>
                                            {wards.map((w) => (
                                                <option key={w.code} value={w.code}>{w.name}</option>
                                            ))}
                                        </select>
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

                            {/* GIAO DIỆN CHỌN PHƯƠNG THỨC THANH TOÁN */}
                            <div className="p-8 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-xl space-y-4">
                                
                                {/* Lựa chọn 1: Thanh toán khi nhận hàng (COD) */}
                                <div 
                                    onClick={() => setPaymentMethod("COD")}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === "COD" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Giao hàng tận nơi mới trả tiền</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === "COD" ? "border-primary" : "border-muted"}`}>
                                        {paymentMethod === "COD" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                    </div>
                                </div>

                                {/* Lựa chọn 2: Chuyển khoản ngân hàng (QR Code) */}
                                <div 
                                    onClick={() => setPaymentMethod("BANK")}
                                    className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === "BANK" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === "BANK" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Chuyển khoản (Quét mã QR)</p>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Thanh toán tự động 24/7, an toàn và bảo mật</p>
                                        </div>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-4 flex items-center justify-center ${paymentMethod === "BANK" ? "border-primary" : "border-muted"}`}>
                                        {paymentMethod === "BANK" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                    </div>
                                </div>
                                
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

                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-sm font-bold text-amber-600">Quy ra PV</span>
                                <span className="text-xl font-bold text-amber-600">{pvValue.toLocaleString("vi-VN")} PV</span>
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
