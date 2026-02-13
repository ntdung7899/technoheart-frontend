
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { Search, SlidersHorizontal, ShoppingBag, X } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sản phẩm | TechnoHeart",
    description: "Khám phá bộ sưu tập sản phẩm công nghệ cao cấp của TechnoHeart.",
};

interface Props {
    searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const categoryFilter = params.category || '';
    const searchFilter = params.search || '';

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } }
    });

    const totalProducts = await prisma.product.count();

    const products = await prisma.product.findMany({
        where: {
            AND: [
                categoryFilter ? { categoryId: categoryFilter } : {},
                searchFilter ? { name: { contains: searchFilter, mode: 'insensitive' } } : {},
            ]
        },
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    const activeCategory = categories.find((c: any) => c.id === categoryFilter);

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <section className="relative border-b border-border/40 bg-secondary/20 py-10">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                {activeCategory ? activeCategory.name : 'Tất Cả Sản Phẩm'}
                            </h1>
                            <p className="text-muted-foreground mt-1.5 text-sm">
                                {products.length} sản phẩm {activeCategory ? `trong ${activeCategory.name}` : ''}
                            </p>
                        </div>
                        {/* Search */}
                        <form action="/products" method="GET" className="relative w-full sm:w-auto">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Tìm sản phẩm..."
                                defaultValue={searchFilter}
                                className="h-10 w-full sm:w-64 rounded-xl border border-border/60 bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground/60"
                            />
                            {categoryFilter && <input type="hidden" name="category" value={categoryFilter} />}
                        </form>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-56 shrink-0 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-3">
                            <SlidersHorizontal className="h-4 w-4" />
                            Danh mục
                        </div>
                        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                            <Link
                                href="/products"
                                className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${!categoryFilter
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                                    }`}
                            >
                                Tất cả ({totalProducts})
                            </Link>
                            {categories.map((category: any) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.id}`}
                                    className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${categoryFilter === category.id
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                                        }`}
                                >
                                    {category.name} ({category._count.products})
                                </Link>
                            ))}
                        </div>

                        {/* Active Filters */}
                        {(categoryFilter || searchFilter) && (
                            <div className="pt-3 border-t border-border/40 hidden lg:block">
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                    Xoá bộ lọc
                                </Link>
                            </div>
                        )}
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="h-20 w-20 bg-secondary/50 rounded-2xl flex items-center justify-center mb-6">
                                    <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                                    Hãy thử tìm kiếm với từ khóa khác hoặc xem tất cả sản phẩm.
                                </p>
                                <Link href="/products" className="btn-primary rounded-xl px-6 py-2.5 text-sm">
                                    Xem tất cả sản phẩm
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
