"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Tag, Plus, Trash2, Edit2, Check, X, Loader2,
    ArrowLeft, Newspaper, Hash
} from "lucide-react";

const PRESET_COLORS = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f97316",
    "#10b981", "#06b6d4", "#eab308", "#ef4444",
    "#6366f1", "#14b8a6",
];

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    _count: { news: number };
}

export default function NewsCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [newForm, setNewForm] = useState({ name: "", description: "", color: "#3b82f6" });
    const [editForm, setEditForm] = useState({ name: "", description: "", color: "#3b82f6" });
    const [error, setError] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchCategories = async () => {
        const res = await fetch("/api/news-categories");
        const data = await res.json();
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        const res = await fetch("/api/news-categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newForm),
        });
        const data = await res.json();
        if (res.ok) {
            setNewForm({ name: "", description: "", color: "#3b82f6" });
            setShowAdd(false);
            fetchCategories();
        } else {
            setError(data.error || "Có lỗi xảy ra");
        }
        setSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setSaving(true);
        const res = await fetch(`/api/news-categories/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editForm),
        });
        const data = await res.json();
        if (res.ok) {
            setEditingId(null);
            fetchCategories();
        } else {
            setError(data.error || "Có lỗi xảy ra");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Xoá danh mục "${name}"? Các bài viết trong danh mục này sẽ không bị xoá.`)) return;
        await fetch(`/api/news-categories/${id}`, { method: "DELETE" });
        fetchCategories();
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditForm({ name: cat.name, description: cat.description || "", color: cat.color });
        setError("");
    };

    return (
        <div className="space-y-6 pb-12 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/admin/news" className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div className="flex-1">
                    <p className="text-xs font-medium text-slate-400 mb-0.5">Tin tức</p>
                    <h1 className="text-xl font-bold text-slate-900">Quản lý danh mục</h1>
                </div>
                <button
                    onClick={() => { setShowAdd(true); setError(""); }}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 active:scale-[0.98] transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Thêm danh mục
                </button>
            </div>

            {/* Add form */}
            {showAdd && (
                <div className="rounded-xl border border-primary/20 bg-white shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <Plus className="h-4 w-4 text-primary" />
                            Thêm danh mục mới
                        </p>
                        <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Tên danh mục *</label>
                                <input
                                    type="text"
                                    value={newForm.name}
                                    onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Ví dụ: Công nghệ mới"
                                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Mô tả (tuỳ chọn)</label>
                                <input
                                    type="text"
                                    value={newForm.description}
                                    onChange={e => setNewForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Mô tả ngắn về danh mục..."
                                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500">Màu sắc</label>
                            <div className="flex items-center gap-3 flex-wrap">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setNewForm(p => ({ ...p, color }))}
                                        className="h-7 w-7 rounded-md border-2 transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: color,
                                            borderColor: newForm.color === color ? "#1e293b" : "transparent",
                                            boxShadow: newForm.color === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : undefined,
                                        }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={newForm.color}
                                    onChange={e => setNewForm(p => ({ ...p, color: e.target.value }))}
                                    className="h-7 w-7 rounded-md border border-slate-200 cursor-pointer"
                                    title="Màu tuỳ chọn"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                        <div className="flex items-center justify-end gap-3">
                            <button type="button" onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors">
                                Huỷ
                            </button>
                            <button type="submit" disabled={saving} className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60 flex items-center gap-2">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Lưu danh mục
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories list */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                        <Tag className="h-10 w-10 opacity-20" />
                        <p className="font-medium text-base">Chưa có danh mục nào</p>
                        <button onClick={() => setShowAdd(true)} className="text-primary font-medium text-sm hover:underline">
                            Tạo danh mục đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {categories.map(cat => (
                            <div key={cat.id} className="group p-4 hover:bg-slate-50/50 transition-colors">
                                {editingId === cat.id ? (
                                    /* Edit form inline */
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.description}
                                                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                                                placeholder="Mô tả..."
                                                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {PRESET_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setEditForm(p => ({ ...p, color }))}
                                                    className="h-7 w-7 rounded-lg border-2 transition-all hover:scale-110"
                                                    style={{
                                                        backgroundColor: color,
                                                        borderColor: editForm.color === color ? "#1e293b" : "transparent",
                                                        boxShadow: editForm.color === color ? `0 0 0 2px white, 0 0 0 3px ${color}` : undefined,
                                                    }}
                                                />
                                            ))}
                                            <input type="color" value={editForm.color} onChange={e => setEditForm(p => ({ ...p, color: e.target.value }))} className="h-7 w-7 rounded-md border border-slate-200 cursor-pointer" />
                                        </div>
                                        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleUpdate(cat.id)} disabled={saving} className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-60">
                                                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                                Lưu
                                            </button>
                                            <button onClick={() => { setEditingId(null); setError(""); }} className="h-8 px-3 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                                                Huỷ
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Normal row */
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.color + "20" }}>
                                            <Hash className="h-4 w-4" style={{ color: cat.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-slate-900">{cat.name}</span>
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                                                <span className="text-[10px] font-mono text-slate-400">/{cat.slug}</span>
                                            </div>
                                            {cat.description && (
                                                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{cat.description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-500">
                                                <Newspaper className="h-3 w-3" />
                                                {cat._count.news} bài
                                            </span>
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-primary hover:text-primary-foreground transition-all opacity-0 group-hover:opacity-100 text-slate-500"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 text-slate-500"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
