
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { clsx } from 'clsx';

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
                        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/products"
                                    className={clsx(
                                        "block px-3 py-2 rounded-md transition-colors",
                                        !categoryFilter ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                                    )}
                                >
                                    All Products
                                </Link>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/products?category=${cat.name}`}
                                        className={clsx(
                                            "block px-3 py-2 rounded-md transition-colors",
                                            categoryFilter === cat.name ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
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
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {categoryFilter ? `${categoryFilter}` : "All Products"}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Showing {products.length} results
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/20 h-64">
                            <h3 className="text-xl font-semibold">No products found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters.</p>
                            <Link href="/products" className="mt-4 text-primary hover:underline">Clear Filters</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
