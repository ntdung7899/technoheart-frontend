"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Edit,
  Package,
  LayoutGrid,
} from "lucide-react";
import Image from "next/image";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  type AdminCategory,
} from "@/lib/api/admin-categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      console.error("LOAD_ADMIN_CATEGORIES_ERROR:", error);
      alert(error instanceof Error ? error.message : "Không tải được danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      image: category.image || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const currentCategory = categories.find((item) => item.id === id);

    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa danh mục "${
          currentCategory?.name || id
        }"?`
      )
    ) {
      return;
    }

    try {
      await deleteAdminCategory(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("DELETE_ADMIN_CATEGORY_ERROR:", error);
      alert(error instanceof Error ? error.message : "Không thể xóa danh mục");
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", image: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        const updated = await updateAdminCategory(editingId, {
          name: formData.name,
          image: formData.image,
        });

        setCategories((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item))
        );
      } else {
        const created = await createAdminCategory({
          name: formData.name,
          image: formData.image,
        });

        setCategories((prev) => [created, ...prev]);
      }

      setFormData({ name: "", image: "" });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("SAVE_ADMIN_CATEGORY_ERROR:", error);
      alert(error instanceof Error ? error.message : "Không thể lưu danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý các nhóm sản phẩm trong cửa hàng.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="relative max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 w-16">
                    Ảnh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Tên danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    ID
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                    Số sản phẩm
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-10 w-10 rounded-lg border border-slate-200 bg-white mx-auto overflow-hidden flex items-center justify-center">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <LayoutGrid className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                        {category.name}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-400">
                        {category.id}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        <Package className="h-3 w-3" />
                        {category._count?.products ?? 0}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-sm text-slate-400"
                    >
                      Không có danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
            </h3>

            <p className="text-slate-500 text-sm mb-5">
              {editingId
                ? "Cập nhật thông tin cho danh mục sản phẩm."
                : "Nhập thông tin cho danh mục mới."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Tên danh mục
                </label>

                <input
                  type="text"
                  required
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Điện thoại, Laptop..."
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  URL Hình ảnh
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    className="h-9 flex-1 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://..."
                  />

                  <div className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {formData.image && (
                <div className="relative h-32 w-full rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                    setFormData({ name: "", image: "" });
                  }}
                  className="flex-1 h-9 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editingId ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}