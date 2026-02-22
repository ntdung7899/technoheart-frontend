"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus, Pencil, Trash2, Newspaper, Eye, EyeOff,
    Star, StarOff, Search, Calendar, Loader2, Tag
} from "lucide-react";

interface NewsArticle {
    id: string;
    title: string;
    category: string;
    published: boolean;
    featured: boolean;
    readTime: string;
    createdAt: string;
    author: { name: string | null; email: string };
}

export default function AdminNewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchArticles = async () => {
        setLoading(true);
        const res = await fetch("/api/news?admin=true");
        const data = await res.json();
        setArticles(data.articles || []);
        setLoading(false);
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;
        setDeletingId(id);
        await fetch(`/api/news/${id}`, { method: "DELETE" });
        await fetchArticles();
        setDeletingId(null);
    };

    const handleToggle = async (id: string, field: "published" | "featured", current: boolean) => {
        await fetch(`/api/news/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: !current }),
        });
        setArticles(prev =>
            prev.map(a => a.id === id ? { ...a, [field]: !current } : a)
        );
    };

    const filtered = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categoryColors: Record<string, string> = {
        "Công nghệ": "bg-blue-50 text-blue-600 ring-blue-200",
        "Đánh giá": "bg-purple-50 text-purple-600 ring-purple-200",
        "Đời sống": "bg-green-50 text-green-600 ring-green-200",
        "Khuyến mãi": "bg-orange-50 text-orange-600 ring-orange-200",
        "Mẹo vặt": "bg-yellow-50 text-yellow-600 ring-yellow-200",
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full" />
                        Nội dung
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-zinc-900">Quản lý Tin tức</h1>
                    <p className="text-zinc-500 font-medium text-lg">Viết và quản lý các bài đăng trên trang tin tức.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/news/categories"
                        className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
                    >
                        <Tag className="h-4 w-4" />
                        Danh mục
                    </Link>
                    <Link
                        href="/admin/news/new"
                        className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Viết bài mới
                    </Link>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                    { label: "Tổng bài viết", value: articles.length, color: "text-zinc-900" },
                    { label: "Đã xuất bản", value: articles.filter(a => a.published).length, color: "text-emerald-600" },
                    { label: "Bản nháp", value: articles.filter(a => !a.published).length, color: "text-orange-500" },
                    { label: "Nổi bật", value: articles.filter(a => a.featured).length, color: "text-yellow-500" },
                ].map((s, i) => (
                    <div key={i} className="p-6 rounded-[1.5rem] bg-white border border-zinc-200 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{s.label}</p>
                        <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search + Table */}
            <div className="rounded-[2rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all"
                        />
                    </div>
                    <span className="text-sm font-bold text-zinc-400">{filtered.length} bài viết</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                        <Newspaper className="h-12 w-12 opacity-20" />
                        <p className="font-bold text-base">
                            {articles.length === 0 ? "Chưa có bài viết nào" : "Không tìm thấy kết quả"}
                        </p>
                        {articles.length === 0 && (
                            <Link href="/admin/news/new" className="text-sm text-primary font-bold hover:underline">
                                Viết bài đầu tiên →
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-100">
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tiêu đề</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Danh mục</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Trạng thái</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Nổi bật</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ngày tạo</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {filtered.map(article => (
                                    <tr key={article.id} className="group hover:bg-zinc-50/80 transition-colors">
                                        <td className="px-6 py-5 max-w-xs">
                                            <p className="font-bold text-sm text-zinc-900 line-clamp-1 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                                                {article.readTime} · {article.author.name || article.author.email}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${categoryColors[article.category] || "bg-zinc-100 text-zinc-600 ring-zinc-200"}`}>
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => handleToggle(article.id, "published", article.published)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-inset transition-all hover:scale-105 ${article.published
                                                    ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                                                    : "bg-orange-50 text-orange-500 ring-orange-200"
                                                    }`}
                                                title="Click để thay đổi"
                                            >
                                                {article.published
                                                    ? <><Eye className="h-3 w-3" /> Đã xuất bản</>
                                                    : <><EyeOff className="h-3 w-3" /> Bản nháp</>
                                                }
                                            </button>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => handleToggle(article.id, "featured", article.featured)}
                                                className="inline-flex items-center justify-center h-9 w-9 rounded-xl hover:bg-zinc-100 transition-all mx-auto"
                                                title={article.featured ? "Bỏ nổi bật" : "Đặt nổi bật"}
                                            >
                                                {article.featured
                                                    ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    : <StarOff className="h-4 w-4 text-zinc-300" />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/news/${article.id}/edit`}
                                                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-zinc-400"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    disabled={deletingId === article.id}
                                                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-zinc-400 disabled:opacity-50"
                                                    title="Xoá"
                                                >
                                                    {deletingId === article.id
                                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                                        : <Trash2 className="h-4 w-4" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
