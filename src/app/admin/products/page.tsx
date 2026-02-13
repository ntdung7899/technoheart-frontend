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
        <div className="space-y-10 pb-20 text-zinc-900">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="h-1 w-6 bg-primary rounded-full"></div>
                        Kho hàng
                    </div>
                    <h1 className="text-5xl font-black tracking-tightest">Sản phẩm</h1>
                    <p className="text-zinc-500 font-medium text-lg">Quản lý danh sách sản phẩm, giá cả và tồn kho của bạn.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus className="h-5 w-5" />
                    Thêm sản phẩm mới
                </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] border border-zinc-200 shadow-xl shadow-zinc-200/30">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-primary" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên sản phẩm hoặc danh mục..."
                        className="h-12 w-full rounded-2xl bg-zinc-50 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="h-12 px-6 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center gap-2 font-bold text-sm text-zinc-600">
                    <Filter className="h-4 w-4" /> Lọc danh mục
                </button>
            </div>

            {/* Products Table */}
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
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Tên sản phẩm</th>
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Danh mục</th>
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Giá bán</th>
                                    <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Tồn kho</th>
                                    <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredProducts.map((product: any) => (
                                    <tr key={product.id} className="group hover:bg-zinc-50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="relative h-14 w-14 rounded-2xl border border-zinc-200 bg-white p-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                {product.images.length > 0 && (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain p-2"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{product.name}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 ring-1 ring-inset ring-zinc-200">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-sm tabular-nums tracking-tight">
                                                {Number(product.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${product.stock < 10 ? 'bg-red-50 text-red-500' : 'bg-zinc-100 text-zinc-500'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-zinc-400">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
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
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-zinc-400">
                                                <Package className="h-12 w-12 opacity-20" />
                                                <p className="font-bold tracking-tight text-lg">Không tìm thấy sản phẩm nào</p>
                                                {!searchTerm && <Link href="/admin/products/new" className="text-primary font-bold hover:underline">Thêm sản phẩm ngay</Link>}
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
