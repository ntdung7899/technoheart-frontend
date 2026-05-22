"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Save, Loader2, ImageIcon, Eye, EyeOff, Star, Trash2, UploadCloud, X
} from "lucide-react";
import { uploadFile } from "@/lib/api/files";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
    getAdminNewsById,
    updateAdminNews,
    deleteAdminNews,
} from "@/lib/api/admin-news";

import {
    getAdminNewsCategories,
    type AdminNewsCategory,
} from "@/lib/api/admin-news-categories";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(false);
    const [categories, setCategories] = useState<AdminNewsCategory[]>([]);
    const [fallbackCategoryName, setFallbackCategoryName] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState("");



    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        categoryId: "",
        image: "",
        readTime: "5 phút",
        featured: false,
        published: false,
    });

    const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

    useEffect(() => {
        let mounted = true;

        async function loadNewsDetail() {
            try {
                const data = await getAdminNewsById(id);

                if (!mounted) return;

                setForm({
                    title: data.title || "",
                    excerpt: data.excerpt || "",
                    content: data.content || "",
                    categoryId: data.newsCategoryId || "",
                    image: data.image || "",
                    readTime: data.readTime || "5 phút",
                    featured: Boolean(data.featured),
                    published: Boolean(data.published),
                });

                if (!data.newsCategoryId && data.category) {
                    setFallbackCategoryName(data.category);
                }
            } catch (error) {
                console.error("LOAD_ADMIN_NEWS_DETAIL_ERROR:", error);
                setError("Không tải được dữ liệu bài viết.");
            } finally {
                if (mounted) {
                    setFetching(false);
                }
            }
        }

        loadNewsDetail();

        return () => {
            mounted = false;
        };
    }, [id]);

    useEffect(() => {
        let mounted = true;

        async function loadCategories() {
            try {
                const data = await getAdminNewsCategories();

                if (mounted) {
                    setCategories(data);
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

    useEffect(() => {
        if (!form.categoryId && fallbackCategoryName && categories.length > 0) {
            const matchedCategory = categories.find(c => c.name === fallbackCategoryName);
            if (matchedCategory) {
                setForm(prev => ({ ...prev, categoryId: matchedCategory.id }));
            }
        }
    }, [form.categoryId, fallbackCategoryName, categories]);

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
        setLoading(true);

        try {
            const selectedCategory = categories.find(
                (item) => item.id === form.categoryId
            );

            await updateAdminNews(id, {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                image: form.image,
                readTime: form.readTime,
                featured: form.featured,
                published: form.published,

                // BE nhận newsCategoryId
                newsCategoryId: form.categoryId || null,

                // Giữ fallback category name để public news vẫn hiển thị được
                category: selectedCategory?.name || fallbackCategoryName || "Tin tức",
            });

            router.push("/admin/news");
            router.refresh();
        } catch (error) {
            console.error("UPDATE_ADMIN_NEWS_ERROR:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra, vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;

        try {
            await deleteAdminNews(id);

            router.push("/admin/news");
            router.refresh();
        } catch (error) {
            console.error("DELETE_ADMIN_NEWS_ERROR:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Không thể xoá bài viết."
            );
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/admin/news" className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">Tin tức</p>
                        <h1 className="text-xl font-bold text-slate-900">Chỉnh sửa bài viết</h1>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                    Xoá bài
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-4">
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

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-2">
                        <label className="text-xs font-medium text-slate-500">Tóm tắt *</label>
                        <textarea
                            value={form.excerpt}
                            onChange={e => set("excerpt", e.target.value)}
                            placeholder="Mô tả ngắn gọn..."
                            rows={3}
                            className="w-full text-sm text-slate-700 bg-transparent border-none outline-none resize-none placeholder:text-slate-300 focus:ring-0 leading-relaxed"
                            required
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                            <label className="text-xs font-medium text-slate-500">Nội dung *</label>
                        </div>
                        <RichTextEditor
                            value={form.content}
                            onChange={(val) => set("content", val)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">{error}</div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-500">Xuất bản</p>
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                {form.published ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                <span className="text-sm font-medium text-slate-700">Xuất bản</span>
                            </div>
                            <div onClick={() => set("published", !form.published)} className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.published ? "bg-emerald-500" : "bg-slate-200"}`}>
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label>
                        {/* <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                <Star className={`h-4 w-4 ${form.featured ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                                <span className="text-sm font-medium text-slate-700">Nổi bật</span>
                            </div>
                            <div onClick={() => set("featured", !form.featured)} className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-yellow-400" : "bg-slate-200"}`}>
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label> */}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-500">Danh mục</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => set("categoryId", cat.id)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${form.categoryId === cat.id
                                            ? "text-white shadow-md"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                    style={{
                                        backgroundColor:
                                            form.categoryId === cat.id ? cat.color : undefined,
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <label className="text-xs font-medium text-slate-500">Thời gian đọc</label>
                        <input type="text" value={form.readTime} onChange={e => set("readTime", e.target.value)}
                            className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

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

                    <button type="submit" disabled={loading}
                        className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}
