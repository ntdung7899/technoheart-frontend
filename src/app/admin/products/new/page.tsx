"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, Package, DollarSign, Tag } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        imageUrl: "https://ik.imagekit.io/demo/img/default-product.jpg",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/admin/products");
                router.refresh();
            } else {
                alert("Failed to create product");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10">
                <Link href="/admin/products" className="group inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-primary transition-colors">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Quay lại danh sách
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Thêm mới
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Tạo sản phẩm</h1>
                    <p className="text-zinc-500 font-medium text-lg">Điền thông tin chi tiết để niêm yết sản phẩm mới lên cửa hàng của bạn.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-zinc-900">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/30 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-sm">Thông tin cơ bản</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Ví dụ: iPhone 15 Pro Max"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Mô tả sản phẩm</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={6}
                                    placeholder="Mô tả chi tiết về sản phẩm, tính năng, thông số..."
                                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30 resize-none text-zinc-700"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventory & Pricing */}
                    <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/30 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-sm">Giá cả & Kho hàng</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Giá bán (VND)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="1000"
                                        placeholder="0"
                                        className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Số lượng tồn kho</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="stock"
                                        required
                                        min="0"
                                        placeholder="0"
                                        className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-black focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                        value={formData.stock}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Organization */}
                    <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/30 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Tag className="h-5 w-5" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-sm">Phân loại</h3>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">ID Danh mục</label>
                            <input
                                type="text"
                                name="categoryId"
                                placeholder="Nhập ID danh mục..."
                                className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                value={formData.categoryId}
                                onChange={handleChange}
                            />
                            <p className="text-[10px] text-zinc-400 mt-2 ml-1 italic font-medium">Trong phiên bản thực tế, đây sẽ là menu lựa chọn.</p>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/30 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-sm">Hình ảnh</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center p-6 text-center group hover:border-primary/40 transition-colors">
                                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="h-6 w-6 text-zinc-400" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Demo Preview</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">URL Hình ảnh</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
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
                        className="w-full h-16 rounded-[2rem] bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                            <>
                                <Package className="h-5 w-5" />
                                Tạo sản phẩm
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full h-14 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all font-black text-[10px] uppercase tracking-[0.2em] text-zinc-400"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
}
