"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Tag,
    Image as ImageIcon,
    Loader2,
    Trash2,
    Edit,
    Package,
    LayoutGrid
} from "lucide-react";
import Image from "next/image";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: "", image: "" });
    const [editingId, setEditingId] = useState<string | null>(null);


    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: any) => {
        setEditingId(category.id);
        setFormData({ name: category.name, image: category.image || "" });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setFormData({ name: "", image: "" });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ name: "", image: "" });
                setEditingId(null);
                setIsModalOpen(false);
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Tổ chức
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest text-zinc-900">Danh mục</h1>
                    <p className="text-zinc-500 font-medium text-lg">Quản lý các nhóm sản phẩm trong cửa hàng của bạn.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus className="h-5 w-5" />
                    Thêm danh mục mới
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/30">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục..."
                        className="h-12 w-full rounded-2xl bg-zinc-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border-transparent text-zinc-900"
                    />
                </div>
            </div>

            {/* Categories Table/Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-200">
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 w-24 text-center">Hình ảnh</th>
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Tên danh mục</th>
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">ID</th>
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Số sản phẩm</th>
                                    <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {categories.map((category: any) => (
                                    <tr key={category.id} className="group hover:bg-zinc-50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="relative h-14 w-14 rounded-2xl border border-zinc-200 bg-white p-2 flex items-center justify-center group-hover:scale-110 transition-transform mx-auto">
                                                {category.image ? (
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-contain p-2"
                                                    />
                                                ) : (
                                                    <LayoutGrid className="h-6 w-6 text-zinc-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors text-zinc-900">{category.name}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-[10px] text-zinc-400">{category.id}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-600">
                                                <Package className="h-3 w-3" />
                                                {category._count.products}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-zinc-400">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-200 transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Simple Modal for Adding Category */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <div className="space-y-2 mb-8">
                            <h3 className="text-3xl font-black tracking-tight text-zinc-900">
                                {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                            </h3>
                            <p className="text-zinc-500 text-sm font-medium">
                                {editingId ? "Cập nhật thông tin cho danh mục sản phẩm." : "Nhập thông tin cho danh mục sản phẩm mới."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Tên danh mục</label>
                                <input
                                    type="text"
                                    required
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ví dụ: Điện thoại, Laptop..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">URL Hình ảnh (tùy chọn)</label>
                                <input
                                    type="text"
                                    className="h-14 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all focus:border-primary/30"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-14 rounded-2xl border border-zinc-200 text-zinc-600 font-black text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Xác nhận"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
