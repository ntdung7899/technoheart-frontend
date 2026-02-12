
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 4,
    include: { category: true },
  });
}

async function getCategories() {
  return await prisma.category.findMany();
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  // Find a hero product (e.g., iPhone 15 Pro or just the first one)
  const heroProduct = featuredProducts.find((p) => p.name.includes('iPhone')) || featuredProducts[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 bg-secondary/30 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit">
                New Arrival
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {heroProduct?.name || "Premium Electronics"}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {heroProduct?.description || "Experience the future with our latest collection of premium gadgets."}
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href={heroProduct ? `/products/${heroProduct.id}` : "/products"}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Shop Now
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  View All Products
                </Link>
              </div>
            </div>
            {heroProduct && heroProduct.images.length > 0 && (
              <div className="flex items-center justify-center">
                <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-xl bg-white p-8 shadow-xl">
                  <Image
                    src={heroProduct.images[0]}
                    alt={heroProduct.name}
                    width={500}
                    height={500}
                    className="object-contain w-full h-full transition-transform hover:scale-105 duration-500"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find the perfect device for your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {categories.map((category) => (
              <Link
                href={`/products?category=${category.name}`}
                key={category.id}
                className="group relative overflow-hidden rounded-lg bg-secondary/50 p-6 transition-all hover:bg-secondary"
              >
                <div className="flex flex-col items-center gap-4">
                  {category.image && (
                    <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md bg-white p-4 shadow-sm">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full transition-transform group-hover:scale-110 duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Handpicked premium electronics just for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md h-full flex flex-col">
                  <div className="p-6 flex-1 flex flex-col items-center">
                    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white p-4 mb-4">
                      {product.images.length > 0 && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full transition-transform group-hover:scale-105 duration-300"
                        />
                      )}
                    </div>
                    <div className="w-full text-left space-y-1">
                      <p className="text-sm text-muted-foreground">{product.category.name}</p>
                      <h3 className="font-semibold text-lg leading-tight group-hover:underline decoration-primary/50 underline-offset-4">{product.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold">${Number(product.price)}</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/products"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
