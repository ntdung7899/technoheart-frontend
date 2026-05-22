"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  Loader2,
} from "lucide-react";
import {
  getAdminProducts,
  deleteAdminProduct,
  type AdminProduct,
} from "@/lib/api/admin-products";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Không thể xóa sản phẩm";
}

function normalizeProducts(data: unknown): AdminProduct[] {
  if (Array.isArray(data)) {
    return data;
  }

  const anyData = data as any;

  if (Array.isArray(anyData?.data)) {
    return anyData.data;
  }

  if (Array.isArray(anyData?.responseData)) {
    return anyData.responseData;
  }

  if (Array.isArray(anyData?.rows)) {
    return anyData.rows;
  }

  return [];
}

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState("all");
  const [appliedFilter, setAppliedFilter] = useState("all");

  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        const data = await getAdminProducts();

        if (mounted) {
          setProducts(normalizeProducts(data));
        }
      } catch (error) {
        console.error("LOAD_ADMIN_PRODUCTS_ERROR:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách sản phẩm"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${name}"?\n\nLưu ý: Nếu sản phẩm đã phát sinh trong đơn hàng thì hệ thống sẽ không cho xóa.`
    );

    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      await deleteAdminProduct(id);

      setProducts((prev) => prev.filter((item) => item.id !== id));

      alert("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("DELETE_ADMIN_PRODUCT_ERROR:", error);

      const message = getErrorMessage(error);

      if (
        message.includes("đơn hàng") ||
        message.includes("OrderItem") ||
        message.includes("foreign key") ||
        message.includes("409")
      ) {
        alert(
          "Không thể xóa sản phẩm này vì sản phẩm đã phát sinh trong đơn hàng.\n\nBạn nên chuyển sản phẩm sang trạng thái ngừng bán hoặc ẩn sản phẩm thay vì xóa."
        );
      } else {
        alert(message);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getStockFilter = (p: AdminProduct) => {
    const stock = Number(p.stock || 0);

    if (appliedFilter === "inStock") return stock > 0;
    if (appliedFilter === "lowStock") return stock > 0 && stock < 10;
    if (appliedFilter === "outOfStock") return stock === 0;

    return true;
  };

  const filteredProducts = products.filter((p: any) => {
    const query = searchTerm.trim().toLowerCase();

    const productName = String(p.name || "").toLowerCase();
    const categoryName = String(p.category?.name || "").toLowerCase();

    const matchSearch =
      !query ||
      productName.includes(query) ||
      categoryName.includes(query);

    return matchSearch && getStockFilter(p);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sản phẩm</h1>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý danh sách sản phẩm, giá cả và tồn kho.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />

          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm hoặc danh mục..."
            className="h-9 w-full max-w-md rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-600"
        >
          <Filter className="h-3.5 w-3.5" />
          Lọc
        </button>
      </div>

      {appliedFilter !== "all" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Đang lọc:</span>

          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">
            {appliedFilter === "inStock" && "Còn hàng"}
            {appliedFilter === "lowStock" && "Sắp hết hàng"}
            {appliedFilter === "outOfStock" && "Hết hàng"}

            <button
              type="button"
              onClick={() => setAppliedFilter("all")}
              className="ml-1 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
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
                    Tên sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                    Giá bán
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                    Tồn kho
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product: any) => {
                  const categoryName = product.category?.name || "Chưa có danh mục";
                  const isDeleting = deletingId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="relative h-10 w-10 rounded-lg border border-slate-200 bg-white mx-auto overflow-hidden">
                          {product.images?.length > 0 ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name || "product image"}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                              <Package className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                          {product.name}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                          {categoryName}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm font-medium tabular-nums text-slate-900">
                          {Number(product.price || 0).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                            Number(product.stock || 0) < 10
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {Number(product.stock || 0)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-400">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 hover:text-primary transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(product.id, product.name)}
                            title="Xóa sản phẩm"
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Package className="h-8 w-8 opacity-30" />
                        <p className="text-sm">Không tìm thấy sản phẩm nào</p>

                        {!searchTerm && (
                          <Link
                            href="/admin/products/new"
                            className="text-primary text-sm hover:underline"
                          >
                            Thêm sản phẩm ngay
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-80 space-y-4">
            <h3 className="font-semibold">Bộ lọc sản phẩm</h3>

            <select
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="inStock">Còn hàng</option>
              <option value="lowStock">Sắp hết hàng</option>
              <option value="outOfStock">Hết hàng</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="px-3 py-1 border rounded"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={() => {
                  setAppliedFilter(tempFilter);
                  setIsFilterOpen(false);
                }}
                className="px-3 py-1 bg-primary text-white rounded"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}