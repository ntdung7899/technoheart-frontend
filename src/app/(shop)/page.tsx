
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchModal } from "@/components/ui/SearchModal";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Zap, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";


async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 8,
    include: { category: true },
  });
}

async function getCategories() {
  return await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  const heroProduct = featuredProducts.find((p: any) => p.name.includes('iPhone')) || featuredProducts[0];

  return (
    <div className="flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full gradient-hero overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-16 lg:py-28 relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary w-fit">
                <Zap className="h-3.5 w-3.5" />
                Hàng Mới Về
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl leading-[1.1]">
                {heroProduct?.name || "Điện Máy Cao Cấp"}
              </h1>
              <p className="max-w-[540px] text-muted-foreground text-lg leading-relaxed">
                {heroProduct?.description || "Trải nghiệm tương lai với bộ sưu tập thiết bị công nghệ mới nhất của chúng tôi."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Link
                  href={heroProduct ? `/products/${heroProduct.id}` : "/products"}
                  className="btn-primary h-12 px-8 text-base gap-2 rounded-xl"
                >
                  Mua Ngay <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/products"
                  className="btn-secondary h-12 px-8 text-base rounded-xl"
                >
                  Xem Bộ Sưu Tập
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground ml-1">4.9/5</span>
                </div>
                <span className="text-muted-foreground/40">|</span>
                <span>2,000+ đánh giá</span>
              </div>

              {/* Hero Search Bar */}
              <div className="pt-4">
                <SearchModal variant="hero" />
              </div>

            </div>

            {heroProduct && heroProduct.images.length > 0 && (
              <div className="flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative w-full max-w-[480px] aspect-square">
                  <div className="absolute inset-0 bg-primary/5 rounded-[2rem] rotate-6 scale-95" />
                  <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl border border-border/40">
                    <Image
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      fill
                      className="object-contain p-8 transition-transform hover:scale-105 duration-700"
                      priority
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary backdrop-blur-md">
                        Nổi bật
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3">
              Khám Phá Danh Mục
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Tìm kiếm thiết bị hoàn hảo phù hợp với nhu cầu của bạn
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
            {categories.map((category: any) => (
              <Link
                href={`/products?category=${category.id}`}
                key={category.id}
                className="group relative overflow-hidden rounded-2xl bg-secondary/30 border border-border/40 p-6 card-hover flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative aspect-square w-full max-w-[180px] overflow-hidden rounded-2xl bg-white p-4 shadow-sm group-hover:shadow-lg transition-all duration-300">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain p-6 transition-transform group-hover:scale-110 duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/20 rounded-xl">
                      <span className="text-4xl font-bold text-muted-foreground/20">{category.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{category._count.products} sản phẩm</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="w-full py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
                Sản Phẩm Nổi Bật
              </h2>
              <p className="text-muted-foreground text-lg">
                Tuyển chọn những thiết bị tốt nhất dành cho bạn
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all group"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 stagger-children">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== USP SECTION ===== */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-3">
              Tại Sao Chọn TechnoHeart?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: "Giao Hàng Nhanh",
                desc: "Giao hàng miễn phí toàn quốc cho đơn từ 500.000đ. Nhận hàng trong 1-3 ngày làm việc.",
                gradient: "from-blue-500/10 to-cyan-500/10"
              },
              {
                icon: ShieldCheck,
                title: "Bảo Hành Uy Tín",
                desc: "Cam kết 100% sản phẩm chính hãng. Bảo hành lên đến 24 tháng tại trung tâm toàn quốc.",
                gradient: "from-green-500/10 to-emerald-500/10"
              },
              {
                icon: RefreshCw,
                title: "Đổi Trả Dễ Dàng",
                desc: "Hoàn tiền 100% trong 30 ngày nếu sản phẩm không đúng mô tả hoặc lỗi kỹ thuật.",
                gradient: "from-orange-500/10 to-amber-500/10"
              }
            ].map((item, idx) => (
              <div key={idx} className={`relative rounded-2xl bg-gradient-to-br ${item.gradient} border border-border/40 p-8 text-center card-hover`}>
                <div className="h-14 w-14 rounded-2xl bg-background flex items-center justify-center mx-auto mb-5 shadow-sm text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
