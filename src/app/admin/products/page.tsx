"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal, Package, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProducts(products.filter((p: any) => p.id !== id));
            } else {
                alert("Xóa sản phẩm thất bại");
            }
        } catch (error) {
            console.error(error);
            alert("Đã có lỗi xảy ra");
        }
    };

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sản phẩm</h1>
                    <p className="text-slate-500 text-sm mt-1">Quản lý danh sách sản phẩm, giá cả và tồn kho.</p>
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
                <button className="h-9 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm text-slate-600">
                    <Filter className="h-3.5 w-3.5" /> Lọc
                </button>
            </div>

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
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 w-16">Ảnh</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Tên sản phẩm</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Danh mục</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">Giá bán</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">Tồn kho</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredProducts.map((product: any) => (
                                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="relative h-10 w-10 rounded-lg border border-slate-200 bg-white mx-auto overflow-hidden">
                                                {product.images.length > 0 && (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain p-1"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">{product.name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium tabular-nums text-slate-900">
                                                {Number(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                                {product.stock}
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
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                                <Package className="h-8 w-8 opacity-30" />
                                                <p className="text-sm">Không tìm thấy sản phẩm nào</p>
                                                {!searchTerm && <Link href="/admin/products/new" className="text-primary text-sm hover:underline">Thêm sản phẩm ngay</Link>}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
