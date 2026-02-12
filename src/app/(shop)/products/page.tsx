import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { clsx } from "clsx";
import { Search } from "lucide-react";

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const { category, search } = await searchParams;
    const categoryFilter = typeof category === 'string' ? category : undefined;
    const searchFilter = typeof search === 'string' ? search : undefined;

    const where: any = {};
    if (categoryFilter) {
        where.category = { name: categoryFilter };
    }
    if (searchFilter) {
        where.name = { contains: searchFilter, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
        where,
        include: { category: true },
    });

    const categories = await prisma.category.findMany();

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-8">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Danh mục</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/products"
                                    className={clsx(
                                        "block px-3 py-2 rounded-md transition-all",
                                        !categoryFilter ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            {[
                                { name: 'Điện thoại', slug: 'Phones' },
                                { name: 'Laptop', slug: 'Laptops' },
                                { name: 'Phụ kiện', slug: 'Accessories' }
                            ].map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={`/products?category=${cat.slug}`}
                                        className={clsx(
                                            "block px-3 py-2 rounded-md transition-all",
                                            categoryFilter === cat.slug ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "hover:bg-muted text-muted-foreground"
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
                    <div className="mb-8 border-b border-border/40 pb-6">
                        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl text-foreground">
                            {categoryFilter ? (
                                categoryFilter === 'Phones' ? 'Điện thoại' :
                                    categoryFilter === 'Laptops' ? 'Laptop' :
                                        categoryFilter === 'Accessories' ? 'Phụ kiện' : categoryFilter
                            ) : "Tất cả sản phẩm"}
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">
                            Tìm thấy <span className="text-foreground">{products.length}</span> sản phẩm phù hợp
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: any) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10 h-80">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold">Không tìm thấy sản phẩm</h3>
                            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Chúng tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.</p>
                            <Link href="/products" className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:scale-105">
                                Xóa bộ lọc
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
