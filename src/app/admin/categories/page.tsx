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
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
                    <p className="text-slate-500 text-sm mt-1">Quản lý các nhóm sản phẩm trong cửa hàng.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Thêm danh mục
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Tìm kiếm danh mục..."
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
            </div>

            {/* Categories Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 w-16">Ảnh</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Tên danh mục</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ID</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Số sản phẩm</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.map((category: any) => (
                                    <tr key={category.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="relative h-10 w-10 rounded-lg border border-slate-200 bg-white mx-auto overflow-hidden flex items-center justify-center">
                                                {category.image ? (
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                ) : (
                                                    <LayoutGrid className="h-4 w-4 text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{category.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs text-slate-400">{category.id}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                                <Package className="h-3 w-3" />
                                                {category._count.products}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 text-slate-400">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-primary transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                        </h3>
                        <p className="text-slate-500 text-sm mb-5">
                            {editingId ? "Cập nhật thông tin cho danh mục sản phẩm." : "Nhập thông tin cho danh mục mới."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">Tên danh mục</label>
                                <input
                                    type="text"
                                    required
                                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ví dụ: Điện thoại, Laptop..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">URL Hình ảnh (tùy chọn)</label>
                                <input
                                    type="text"
                                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-9 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xác nhận"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
