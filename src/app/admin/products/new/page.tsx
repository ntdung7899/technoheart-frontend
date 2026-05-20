"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Image as ImageIcon, Sparkles, Package, DollarSign, Tag, ChevronDown, ShieldCheck, X, UploadCloud } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createAdminProduct } from "@/lib/api/admin-products";
import { getCategories, type Category } from "@/lib/api/categories";
import { uploadFile } from "@/lib/api/files";


export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: [] as string[],
    warranty: "Bảo hành 12 tháng chính hãng",
    shippingInfo: "Giao hàng nhanh 1-2 ngày",
    returnPolicy: "Hỗ trợ đổi trong 7 ngày",
    origin: "",
    });

    useEffect(() => {
        async function loadCategories() {
            try {
            const data = await getCategories({ take: 100 });

            setCategories(data);

            if (data.length > 0) {
                setFormData((prev) => ({
                ...prev,
                categoryId: data[0].id,
                }));
            }
            } catch (error) {
            console.error("LOAD_CATEGORIES_ERROR:", error);
            }
        }

        loadCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createAdminProduct(formData);

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("CREATE_ADMIN_PRODUCT_ERROR:", error);

            alert(
            error instanceof Error
                ? error.message
                : "Không thể tạo sản phẩm"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file hình ảnh");
            return;
        }

        try {
            setUploadingImage(true);

            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            const uploadedUrl = await uploadFile(file);

            setFormData((prev) => ({
            ...prev,
            images: [uploadedUrl],
            }));
        } catch (error) {
            console.error("UPLOAD_PRODUCT_IMAGE_ERROR:", error);
            alert(error instanceof Error ? error.message : "Upload ảnh thất bại");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleRemoveImage = () => {
        setImagePreview("");

        setFormData((prev) => ({
            ...prev,
            images: [],
        }));
    };

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
                <h1 className="text-2xl font-bold">Tạo sản phẩm</h1>
                <p className="text-slate-500 text-sm mt-1">Điền thông tin chi tiết để niêm yết sản phẩm mới lên cửa hàng.</p>
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
                                    {categories.length === 0 && (
                                        <option value="" disabled>Đang tải danh mục...</option>
                                    )}
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                            {categories.length === 0 && (
                                <p className="text-[10px] text-orange-500 mt-2 ml-1 italic">Bạn cần tạo ít nhất một danh mục trước.</p>
                            )}
                        </div>
                    </div>

                    {/* Media */}
                    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-sm">Hình ảnh sản phẩm</h3>
                        </div>

                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
                                <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
                                {imagePreview || formData.images[0] ? (
                                    <>
                                    <img
                                        src={imagePreview || formData.images[0]}
                                        alt="Ảnh sản phẩm"
                                        className="h-full w-full object-contain p-2"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    </>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <UploadCloud className="h-6 w-6" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        Chọn ảnh từ máy
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        PNG, JPG, JPEG, WEBP
                                    </p>
                                    </div>
                                )}
                                </div>

                                <label className="flex h-10 cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                                {uploadingImage ? "Đang upload..." : "Tải ảnh lên"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={uploadingImage}
                                    className="hidden"
                                />
                                </label>

                                {formData.images[0] && (
                                <p className="mt-3 line-clamp-2 break-all text-xs text-slate-400">
                                    {formData.images[0]}
                                </p>
                                )}
                            </div>
                        </div>
                    

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || categories.length === 0}
                        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                            <>
                                <Package className="h-4 w-4" />
                                Tạo sản phẩm
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
