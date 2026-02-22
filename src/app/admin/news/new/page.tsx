"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Send, Loader2, ImageIcon, Eye, EyeOff, Star
} from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface NewsCategory {
    id: string;
    name: string;
    color: string;
}

export default function NewNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(false);
    const [categories, setCategories] = useState<NewsCategory[]>([]);

    useEffect(() => {
        fetch("/api/news-categories")
            .then(r => r.json())
            .then(data => setCategories(Array.isArray(data) ? data : []));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }
        setLoading(true);
        const res = await fetch("/api/news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            router.push("/admin/news");
        } else {
            const data = await res.json();
            setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/news" className="h-11 w-11 flex items-center justify-center rounded-2xl border border-zinc-200 hover:bg-zinc-100 transition-all text-zinc-500">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-0.5">Tin tức</p>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">Viết bài mới</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tiêu đề bài viết *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => set("title", e.target.value)}
                            placeholder="Nhập tiêu đề hấp dẫn..."
                            className="w-full text-2xl font-black text-zinc-900 bg-transparent border-none outline-none placeholder:text-zinc-200 focus:ring-0"
                            required
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tóm tắt *</label>
                        <textarea
                            value={form.excerpt}
                            onChange={e => set("excerpt", e.target.value)}
                            placeholder="Mô tả ngắn gọn nội dung bài viết (hiển thị trên trang danh sách)..."
                            rows={3}
                            className="w-full text-sm font-medium text-zinc-700 bg-transparent border-none outline-none resize-none placeholder:text-zinc-300 focus:ring-0 leading-relaxed"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Nội dung bài viết *</label>
                        </div>
                        <RichTextEditor
                            value={form.content}
                            onChange={(val) => set("content", val)}
                            placeholder="Viết nội dung bài viết đầy đủ ở đây..."
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
                            {error}
                        </div>
                    )}
                </div>

                {/* Sidebar settings */}
                <div className="space-y-5">
                    {/* Publish */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Xuất bản</p>

                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                {form.published ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-zinc-300" />}
                                <span className="text-sm font-bold text-zinc-700">Xuất bản ngay</span>
                            </div>
                            <div
                                onClick={() => set("published", !form.published)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.published ? "bg-emerald-500" : "bg-zinc-200"}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label>

                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                <Star className={`h-4 w-4 ${form.featured ? "text-yellow-500 fill-yellow-500" : "text-zinc-300"}`} />
                                <span className="text-sm font-bold text-zinc-700">Bài nổi bật</span>
                            </div>
                            <div
                                onClick={() => set("featured", !form.featured)}
                                className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-yellow-400" : "bg-zinc-200"}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label>
                    </div>

                    {/* Category */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Danh mục</p>
                        {categories.length === 0 ? (
                            <div className="space-y-2">
                                <p className="text-xs text-zinc-400 font-medium">
                                    Chưa có danh mục nào. <Link href="/admin/news/categories" className="text-primary font-bold hover:underline">Tạo danh mục</Link>
                                </p>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={e => set("category", e.target.value)}
                                    placeholder="Hoặc nhập danh mục thủ công..."
                                    className="w-full h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => set("category", cat.name)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${form.category === cat.name
                                            ? "text-white shadow-md"
                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-transparent"
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
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Thời gian đọc</label>
                        <input
                            type="text"
                            value={form.readTime}
                            onChange={e => set("readTime", e.target.value)}
                            placeholder="VD: 5 phút"
                            className="w-full h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-sm p-6 space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                            <span className="flex items-center gap-2">
                                <ImageIcon className="h-3.5 w-3.5" />
                                URL ảnh bìa
                            </span>
                        </label>
                        <input
                            type="url"
                            value={form.image}
                            onChange={e => set("image", e.target.value)}
                            placeholder="https://..."
                            className="w-full h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {form.image && (
                            <div className="aspect-video rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 relative">
                                <Image src={form.image} alt="preview" fill className="object-cover" unoptimized onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        {loading ? "Đang lưu..." : form.published ? "Xuất bản bài viết" : "Lưu bản nháp"}
                    </button>
                </div>
            </form>
        </div>
    );
}
