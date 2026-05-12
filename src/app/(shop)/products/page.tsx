import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";
import { Search } from "lucide-react";
import { Metadata } from "next";
import clsx from "clsx";
import { getProducts, type ProductViewModel } from "@/lib/api/products";
import { getCategories, type Category } from "@/lib/api/categories";

export const metadata: Metadata = {
  title: "Sản phẩm | Technoheart",
  description: "Khám phá bộ sưu tập sản phẩm công nghệ cao cấp của Technoheart.",
};

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

function buildFallbackCategories(products: ProductViewModel[]): Category[] {
  const map = new Map<string, Category>();

  products.forEach((product) => {
    if (!product.categoryId) return;

    map.set(product.categoryId, {
      id: product.categoryId,
      name: product.categoryName || product.categoryId,
    });
  });

  return Array.from(map.values());
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoryFilter = params.category || "";
  const searchFilter = params.search || "";

  const [allProducts, apiCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const categories =
    apiCategories.length > 0 ? apiCategories : buildFallbackCategories(allProducts);

  const selectedCategory = categoryFilter
    ? categories.find(
        (cat) =>
          cat.id === categoryFilter ||
          cat.name.toLowerCase() === categoryFilter.toLowerCase()
      ) || null
    : null;

  const products = allProducts.filter((product) => {
    const matchCategory =
      !categoryFilter ||
      product.categoryId === categoryFilter ||
      product.categoryId === selectedCategory?.id ||
      product.categoryName?.toLowerCase() === categoryFilter.toLowerCase();

    const matchSearch =
      !searchFilter ||
      product.name.toLowerCase().includes(searchFilter.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/50">
              Danh mục
            </h3>

            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/products"
                  className={clsx(
                    "block px-4 py-2.5 rounded-lg transition-all text-sm font-semibold",
                    !categoryFilter
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
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
                      "block px-4 py-2.5 rounded-lg transition-all text-sm font-semibold",
                      categoryFilter === cat.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-10 border-b border-border/40 pb-8">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
              <div className="h-1 w-4 bg-primary rounded-full" />
              BỘ SƯU TẬP
            </div>

            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
              {selectedCategory ? selectedCategory.name : "Tất cả sản phẩm"}
            </h1>

            <p className="text-muted-foreground mt-3 font-medium text-lg">
              Tìm thấy{" "}
              <span className="text-foreground font-bold">
                {products.length}
              </span>{" "}
              sản phẩm phù hợp
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
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/5 h-[400px]">
              <div className="h-20 w-20 bg-background shadow-xl rounded-xl flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>

              <h3 className="text-2xl font-bold tracking-tight">
                Không tìm thấy sản phẩm
              </h3>

              <p className="text-muted-foreground mt-3 max-w-xs mx-auto font-medium">
                Chúng tôi không tìm thấy sản phẩm nào phù hợp trong danh mục này.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                Xóa bộ lọc
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}