"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Send, Loader2, ImageIcon, Eye, EyeOff, Star, UploadCloud, X, } from "lucide-react";
import { uploadFile } from "@/lib/api/files";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createAdminNews } from "@/lib/api/admin-news";
import {
    getAdminNewsCategories,
    type AdminNewsCategory,
} from "@/lib/api/admin-news-categories";

type NewsCategory = AdminNewsCategory;

export default function NewNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(false);
    const [categories, setCategories] = useState<NewsCategory[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadCategories() {
            try {
                const data = await getAdminNewsCategories();

                if (mounted) {
                    setCategories(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("LOAD_ADMIN_NEWS_CATEGORIES_ERROR:", error);

                if (mounted) {
                    setCategories([]);
                }
            }
        }

        loadCategories();

        return () => {
            mounted = false;
        };
    }, []);

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        image: "",
        readTime: "5 phút",
        featured: false,
        published: false,
    });

    const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

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

            set("image", uploadedUrl);
        } catch (error) {
            console.error("UPLOAD_NEWS_IMAGE_ERROR:", error);
            alert(error instanceof Error ? error.message : "Upload ảnh thất bại");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
        };

        const handleRemoveImage = () => {
        setImagePreview("");
        set("image", "");
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        setLoading(true);

        try {
            await createAdminNews({
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category || "Tin tức",
                image: form.image,
                readTime: form.readTime,
                featured: form.featured,
                published: form.published,
            });

            router.push("/admin/news");
            router.refresh();
        } catch (error) {
            console.error("CREATE_ADMIN_NEWS_ERROR:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra, vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-12 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/admin/news" className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Tin tức</p>
                    <h1 className="text-xl font-bold text-slate-900">Viết bài mới</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Title */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2">
                        <label className="text-xs font-medium text-slate-500">Tiêu đề bài viết *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => set("title", e.target.value)}
                            placeholder="Nhập tiêu đề hấp dẫn..."
                            className="w-full text-xl font-bold text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-200 focus:ring-0"
                            required
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2">
                        <label className="text-xs font-medium text-slate-500">Tóm tắt *</label>
                        <textarea
                            value={form.excerpt}
                            onChange={e => set("excerpt", e.target.value)}
                            placeholder="Mô tả ngắn gọn nội dung bài viết..."
                            rows={3}
                            className="w-full text-sm text-slate-700 bg-transparent border-none outline-none resize-none placeholder:text-slate-300 focus:ring-0 leading-relaxed"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                            <label className="text-xs font-medium text-slate-500">Nội dung bài viết *</label>
                        </div>
                        <RichTextEditor
                            value={form.content}
                            onChange={(val) => set("content", val)}
                            placeholder="Viết nội dung bài viết đầy đủ ở đây..."
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Sidebar settings */}
                <div className="space-y-4">
                    {/* Publish */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-500">Xuất bản</p>

                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                {form.published ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                <span className="text-sm font-medium text-slate-700">Xuất bản ngay</span>
                            </div>
                            <div
                                onClick={() => set("published", !form.published)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.published ? "bg-emerald-500" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label>

                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                <Star className={`h-4 w-4 ${form.featured ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                                <span className="text-sm font-medium text-slate-700">Bài nổi bật</span>
                            </div>
                            <div
                                onClick={() => set("featured", !form.featured)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-yellow-400" : "bg-slate-200"}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label>
                    </div>

                    {/* Category */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-500">Danh mục</p>
                        {categories.length === 0 ? (
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400 font-medium">
                                    Chưa có danh mục nào. <Link href="/admin/news/categories" className="text-primary font-semibold hover:underline">Tạo danh mục</Link>
                                </p>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={e => set("category", e.target.value)}
                                    placeholder="Hoặc nhập danh mục thủ công..."
                                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => set("category", cat.name)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border-2 ${form.category === cat.name
                                            ? "text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent"
                                            }`}
                                        style={form.category === cat.name ? {
                                            backgroundColor: cat.color,
                                            borderColor: cat.color,
                                        } : {}}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Read time */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <label className="text-xs font-medium text-slate-500">Thời gian đọc</label>
                        <input
                            type="text"
                            value={form.readTime}
                            onChange={e => set("readTime", e.target.value)}
                            placeholder="VD: 5 phút"
                            className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-bold text-slate-800">Ảnh đại diện bài viết</p>
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
                            <div className="relative mb-4 aspect-video overflow-hidden rounded-xl border border-slate-200 bg-white">
                            {imagePreview || form.image ? (
                                <>
                                <img
                                    src={imagePreview || form.image}
                                    alt="Ảnh bài viết"
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

                            {form.image && (
                            <p className="mt-3 line-clamp-2 break-all text-xs text-slate-400">
                                {form.image}
                            </p>
                            )}
                        </div>
                        </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {loading ? "Đang lưu..." : form.published ? "Xuất bản bài viết" : "Lưu bản nháp"}
                    </button>
                </div>
            </form>
        </div>
    );
}
