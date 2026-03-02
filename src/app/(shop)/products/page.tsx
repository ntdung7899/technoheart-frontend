
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { Search } from "lucide-react";
import { Metadata } from "next";
import clsx from "clsx";

export const metadata: Metadata = {
    title: "Sản phẩm | Technoheart",
    description: "Khám phá bộ sưu tập sản phẩm công nghệ cao cấp của Technoheart.",
};

interface Props {
    searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const categoryFilter = params.category || '';
    const searchFilter = params.search || '';

    const where: { categoryId?: string; name?: { contains: string; mode: 'insensitive' } } = {};
    let selectedCategory = null;

    if (categoryFilter) {
        // Try to find by ID first
        selectedCategory = await prisma.category.findUnique({
            where: { id: categoryFilter }
        });

        if (selectedCategory) {
            where.categoryId = categoryFilter;
        } else {
            // Fallback for names/slugs
            selectedCategory = await prisma.category.findFirst({
                where: { name: categoryFilter }
            });
            if (selectedCategory) {
                where.categoryId = selectedCategory.id;
            }
        }
    }

    if (searchFilter) {
        where.name = { contains: searchFilter, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-8">
                    <div>
                        <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground/50">Danh mục</h3>
                        <ul className="space-y-1.5">
                            <li>
                                <Link
                                    href="/products"
                                    className={clsx(
                                        "block px-4 py-2.5 rounded-xl transition-all text-sm font-bold",
                                        !categoryFilter ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/products?category=${cat.id}`}
                                        className={clsx(
                                            "block px-4 py-2.5 rounded-xl transition-all text-sm font-bold",
                                            categoryFilter === cat.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-10 border-b border-border/40 pb-8">
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                            <div className="h-1 w-4 bg-primary rounded-full"></div>
                            BỘ SƯU TẬP
                        </div>
                        <h1 className="text-4xl font-black tracking-tightest lg:text-5xl text-foreground">
                            {selectedCategory ? selectedCategory.name : "Tất cả sản phẩm"}
                        </h1>
                        <p className="text-muted-foreground mt-3 font-medium text-lg">
                            Tìm thấy <span className="text-foreground font-black">{products.length}</span> sản phẩm phù hợp
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-[2.5rem] bg-muted/5 h-[400px]">
                            <div className="h-20 w-20 bg-background shadow-xl rounded-[1.5rem] flex items-center justify-center mb-6">
                                <Search className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Không tìm thấy sản phẩm</h3>
                            <p className="text-muted-foreground mt-3 max-w-xs mx-auto font-medium">Chúng tôi không tìm thấy sản phẩm nào phù hợp trong danh mục này.</p>
                            <Link href="/products" className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-xs font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                Xóa bộ lọc
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
