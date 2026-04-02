"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Save, Loader2, ImageIcon, Eye, EyeOff, Star, Trash2
} from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

const CATEGORIES = ["Công nghệ", "Đánh giá", "Đời sống", "Khuyến mãi", "Mẹo vặt"];

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(false);

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Công nghệ",
        image: "",
        readTime: "5 phút",
        featured: false,
        published: false,
    });

    const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

    useEffect(() => {
        fetch(`/api/news/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setForm({
                        title: data.title,
                        excerpt: data.excerpt,
                        content: data.content,
                        category: data.category,
                        image: data.image || "",
                        readTime: data.readTime,
                        featured: data.featured,
                        published: data.published,
                    });
                }
                setFetching(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = await fetch(`/api/news/${id}`, {
            method: "PATCH",
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

    const handleDelete = async () => {
        if (!confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;
        await fetch(`/api/news/${id}`, { method: "DELETE" });
        router.push("/admin/news");
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
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                            <div className="flex items-center gap-2.5">
                                <Star className={`h-4 w-4 ${form.featured ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}`} />
                                <span className="text-sm font-medium text-slate-700">Nổi bật</span>
                            </div>
                            <div onClick={() => set("featured", !form.featured)} className={`relative h-6 w-11 rounded-full transition-colors cursor-pointer ${form.featured ? "bg-yellow-400" : "bg-slate-200"}`}>
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-1"}`} />
                            </div>
                        </label>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <p className="text-xs font-medium text-slate-500">Danh mục</p>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button key={cat} type="button" onClick={() => set("category", cat)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${form.category === cat ? "bg-primary text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                >
                                    {cat}
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

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
                        <label className="text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5" />URL ảnh bìa</span>
                        </label>
                        <input type="url" value={form.image} onChange={e => set("image", e.target.value)}
                            placeholder="https://..." className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {form.image && (
                            <div className="aspect-video relative rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                <Image src={form.image} alt="preview" fill className="object-cover" unoptimized onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                            </div>
                        )}
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
