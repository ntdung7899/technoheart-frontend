"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, Package, DollarSign, Tag, ChevronDown, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        imageUrl: "",
        warranty: "",
        shippingInfo: "",
        returnPolicy: "",
        origin: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodRes] = await Promise.all([
                    fetch("/api/categories"),
                    fetch(`/api/products/${id}`)
                ]);

                const catsData = await catsRes.json();
                const prodData = await prodRes.json();

                setCategories(catsData);
                setFormData({
                    name: prodData.name,
                    description: prodData.description,
                    price: prodData.price.toString(),
                    stock: prodData.stock.toString(),
                    categoryId: prodData.categoryId,
                    imageUrl: prodData.images[0] || "",
                    warranty: prodData.warranty || "",
                    shippingInfo: prodData.shippingInfo || "",
                    returnPolicy: prodData.returnPolicy || "",
                    origin: prodData.origin || "",
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to load product data");
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to update product");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating product");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto pb-12 text-slate-900">
            <div className="mb-6">
                <Link href="/admin/products" className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-primary transition-colors">
                    <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Quay lại danh sách
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold">Cập nhật sản phẩm</h1>
                <p className="text-slate-500 text-sm mt-1">Thay đổi thông tin cho sản phẩm: <span className="text-slate-900">{formData.name}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm">Thông tin cơ bản</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Ví dụ: iPhone 15 Pro Max"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Mô tả sản phẩm</label>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(val) => setFormData({ ...formData, description: val })}
                                    placeholder="Mô tả chi tiết về sản phẩm, tính năng, thông số..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Pricing */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm">Giá cả & Kho hàng</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Giá bán (VND)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="1000"
                                        placeholder="0"
                                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Số lượng tồn kho</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        min="0"
                                        placeholder="0"
                                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                        value={formData.stock}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm">Thông tin sản phẩm</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Bảo hành</label>
                                <input
                                    type="text"
                                    name="warranty"
                                    placeholder="VD: Bảo hành 12 tháng chính hãng"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                    value={formData.warranty}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Giao hàng</label>
                                <input
                                    type="text"
                                    name="shippingInfo"
                                    placeholder="VD: Giao hàng nhanh 1-2 ngày"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                    value={formData.shippingInfo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Chính sách đổi</label>
                                <input
                                    type="text"
                                    name="returnPolicy"
                                    placeholder="VD: Hỗ trợ đổi trong 7 ngày"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                    value={formData.returnPolicy}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">Xuất xứ</label>
                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="VD: Apple VN"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                    value={formData.origin}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Organization */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Tag className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm">Phân loại</h3>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 ml-1">Danh mục</label>
                            <div className="relative">
                                <select
                                    name="categoryId"
                                    required
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30 appearance-none"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                >
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm">Hình ảnh</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6 text-center group overflow-hidden relative">
                                {formData.imageUrl ? (
                                    <Image src={formData.imageUrl} alt="Preview" fill className="object-contain" unoptimized />
                                ) : (
                                    <>
                                        <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <p className="text-[11px] text-slate-400">Xem trước</p>
                                    </>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 ml-1">URL Hình ảnh</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all focus:border-primary/30"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                            <>
                                <Save className="h-4 w-4" />
                                Lưu thay đổi
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full h-9 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-400"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
}
