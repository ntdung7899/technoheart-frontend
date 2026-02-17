"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, Package, DollarSign, Tag, ChevronDown, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";
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
        <div className="w-full mx-auto pb-20 text-zinc-900">
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
                        Chỉnh sửa
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest">Cập nhật sản phẩm</h1>
                    <p className="text-zinc-500 font-medium text-lg">Thay đổi thông tin cho sản phẩm: <span className="text-zinc-900">{formData.name}</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(val) => setFormData({ ...formData, description: val })}
                                    placeholder="Mô tả chi tiết về sản phẩm, tính năng, thông số..."
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

                    {/* Product Information */}
                    <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/30 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-sm">Thông tin sản phẩm</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Bảo hành</label>
                                <input
                                    type="text"
                                    name="warranty"
                                    placeholder="VD: Bảo hành 12 tháng chính hãng"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.warranty}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Giao hàng</label>
                                <input
                                    type="text"
                                    name="shippingInfo"
                                    placeholder="VD: Giao hàng nhanh 1-2 ngày"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.shippingInfo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Chính sách đổi trả</label>
                                <input
                                    type="text"
                                    name="returnPolicy"
                                    placeholder="VD: Hỗ trợ đổi trả trong 7 ngày"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.returnPolicy}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Xuất xứ</label>
                                <input
                                    type="text"
                                    name="origin"
                                    placeholder="VD: Apple VN"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.origin}
                                    onChange={handleChange}
                                />
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
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Danh mục</label>
                            <div className="relative">
                                <select
                                    name="categoryId"
                                    required
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30 appearance-none"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                >
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                            </div>
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
                            <div className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center p-6 text-center group overflow-hidden relative">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <>
                                        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="h-6 w-6 text-zinc-400" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Xem trước</p>
                                    </>
                                )}
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
                                <Save className="h-5 w-5" />
                                Lưu thay đổi
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
