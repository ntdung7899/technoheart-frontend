"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus, Pencil, Trash2, Newspaper, Eye, EyeOff,
    Star, StarOff, Search, Calendar, Loader2, Tag
} from "lucide-react";
import {
    getAdminNews,
    deleteAdminNews,
    updateAdminNews,
    type AdminNews,
} from "@/lib/api/admin-news";

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

function mapAdminNewsToArticle(item: AdminNews): NewsArticle {
    return {
        id: item.id,
        title: item.title,
        category: item.category || "Tin tức",
        published: Boolean(item.published),
        featured: Boolean(item.featured),
        readTime: item.readTime || "5 phút",
        createdAt: item.createdAt || new Date().toISOString(),
        author: {
            name: null,
            email: "Admin",
        },
    };
}

export default function AdminNewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchArticles = async () => {
        setLoading(true);

        try {
            const data = await getAdminNews();
            setArticles(data.map(mapAdminNewsToArticle));
        } catch (error) {
            console.error("LOAD_ADMIN_NEWS_ERROR:", error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchArticles(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;

        setDeletingId(id);

        try {
            await deleteAdminNews(id);
            await fetchArticles();
        } catch (error) {
            console.error("DELETE_ADMIN_NEWS_ERROR:", error);
            alert(error instanceof Error ? error.message : "Không thể xoá bài viết");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggle = async (
        id: string,
        field: "published" | "featured",
        current: boolean
    ) => {
        try {
            await updateAdminNews(id, {
                [field]: !current,
                title: "",
                content: ""
            });

            setArticles((prev) =>
                prev.map((a) =>
                    a.id === id ? { ...a, [field]: !current } : a
                )
            );
        } catch (error) {
            console.error("TOGGLE_ADMIN_NEWS_ERROR:", error);
            alert(error instanceof Error ? error.message : "Không thể cập nhật bài viết");
        }
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
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tin tức</h1>
                    <p className="text-slate-500 text-sm mt-1">Viết và quản lý bài đăng trên trang tin tức.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/news/categories"
                        className="h-9 px-3 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Tag className="h-3.5 w-3.5" />
                        Danh mục
                    </Link>
                    <Link
                        href="/admin/news/new"
                        className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Viết bài mới
                    </Link>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Tổng bài viết", value: articles.length, color: "text-slate-900" },
                    { label: "Đã xuất bản", value: articles.filter(a => a.published).length, color: "text-emerald-600" },
                    { label: "Bản nháp", value: articles.filter(a => !a.published).length, color: "text-amber-600" },
                    // { label: "Nổi bật", value: articles.filter(a => a.featured).length, color: "text-yellow-500" },
                ].map((s, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Search + Table */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>
                    <span className="text-xs text-slate-400">{filtered.length} bài viết</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2 text-slate-400">
                        <Newspaper className="h-8 w-8 opacity-30" />
                        <p className="text-sm">
                            {articles.length === 0 ? "Chưa có bài viết nào" : "Không tìm thấy kết quả"}
                        </p>
                        {articles.length === 0 && (
                            <Link href="/admin/news/new" className="text-sm text-primary hover:underline">
                                Viết bài đầu tiên
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Tiêu đề</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Danh mục</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Trạng thái</th>
                                    {/* <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Nổi bật</th> */}
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Ngày tạo</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(article => (
                                    <tr key={article.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3 max-w-xs">
                                            <p className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {article.readTime} · {article.author.name || article.author.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${categoryColors[article.category] || "bg-slate-100 text-slate-600"}`}>
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleToggle(article.id, "published", article.published)}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${article.published
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-amber-50 text-amber-600"
                                                    }`}
                                            >
                                                {article.published
                                                    ? <><Eye className="h-3 w-3" /> Xuất bản</>
                                                    : <><EyeOff className="h-3 w-3" /> Nháp</>
                                                }
                                            </button>
                                        </td>
                                        {/* <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleToggle(article.id, "featured", article.featured)}
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 transition-colors mx-auto"
                                            >
                                                {article.featured
                                                    ? <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    : <StarOff className="h-4 w-4 text-slate-300" />
                                                }
                                            </button>
                                        </td> */}
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/news/${article.id}/edit`}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-primary transition-colors text-slate-400"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    disabled={deletingId === article.id}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors text-slate-400 disabled:opacity-50"
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
