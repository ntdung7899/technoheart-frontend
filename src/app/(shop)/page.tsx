
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
      <section className="relative w-full overflow-hidden hero-section-bg">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-blue-400/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-20%] left-[-15%] w-[600px] h-[600px] bg-violet-400/8 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-300/4 rounded-full blur-[180px]" />
          {/* Dot grid texture */}
          <div className="hero-dot-grid absolute inset-0 opacity-[0.025]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

            {/* ---- LEFT CONTENT ---- */}
            <div className="flex flex-col justify-center space-y-7 animate-fade-in-up">
              {/* Shimmer Badge */}
              <div className="hero-shimmer-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Hàng Mới Về — Vừa Ra Mắt
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl leading-[1.08]">
                  {heroProduct?.name || "Điện Máy Cao Cấp"}
                </h1>
                {heroProduct?.category && (
                  <p className="text-muted-foreground text-lg">
                    Danh mục: <span className="font-semibold text-foreground">{heroProduct.category.name}</span>
                  </p>
                )}
              </div>

              {/* Price highlight */}
              {heroProduct?.price && (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-primary tracking-tight">
                    {formatPrice(Number(heroProduct.price))}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-bold text-green-600">
                    Miễn phí vận chuyển
                  </span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
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

              {/* Rating + Stats */}
              <div className="flex flex-wrap items-center gap-5 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">4.9</span>
                  <span className="text-sm text-muted-foreground">(2,000+ đánh giá)</span>
                </div>
                <span className="hidden sm:block w-px h-4 bg-border" />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Chính hãng 100%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-blue-500" />
                    Giao trong 24h
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="pt-2">
                <SearchModal variant="hero" />
              </div>
            </div>

            {/* ---- RIGHT: PRODUCT VISUAL ---- */}
            {heroProduct && heroProduct.images.length > 0 && (
              <div className="flex items-center justify-center animate-fade-in relative" style={{ animationDelay: '0.2s' }}>
                <div className="relative w-full max-w-[480px]">

                  {/* Outer decorative ring */}
                  <div className="absolute inset-[-24px] rounded-full border border-dashed border-primary/15 hero-ring-spin" />
                  <div className="absolute inset-[-44px] rounded-full border border-dashed border-purple-400/10 hero-ring-spin-reverse" />

                  {/* Background glow card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-primary/5 to-violet-500/10 rounded-[2.5rem] rotate-3 scale-[0.97] blur-sm" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/8 to-blue-300/8 rounded-[2.5rem] -rotate-2 scale-[0.99]" />

                  {/* Main Image Card */}
                  <div className="relative w-full aspect-square overflow-hidden rounded-[2.5rem] bg-white shadow-[0_32px_64px_rgba(37,99,235,0.15),0_8px_24px_rgba(0,0,0,0.08)] border border-white/80">
                    <Image
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      fill
                      className="object-cover transition-transform hover:scale-[1.04] duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 480px"
                      priority
                    />
                    {/* Subtle inner gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                  </div>

                  {/* Floating card: Price */}
                  <div className="absolute -left-6 top-12 hero-float-card animate-float z-20">
                    <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl border border-white/60">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Giá ưu đãi</p>
                        <p className="text-sm font-extrabold text-primary">{formatPrice(Number(heroProduct.price))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating card: Rating */}
                  <div className="absolute -right-6 top-1/3 hero-float-card-slow animate-float z-20" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl border border-white/60">
                      <div className="h-9 w-9 rounded-xl bg-yellow-400/15 flex items-center justify-center shrink-0">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Đánh giá</p>
                        <p className="text-sm font-extrabold text-foreground">4.9 / 5 ⭐</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating card: Shipping */}
                  <div className="absolute -left-4 bottom-12 hero-float-card animate-float z-20" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl border border-white/60">
                      <div className="h-9 w-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                        <Truck className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Vận chuyển</p>
                        <p className="text-sm font-extrabold text-green-600">Miễn phí 🚚</p>
                      </div>
                    </div>
                  </div>

                  {/* Badge: Featured */}
                  <div className="absolute right-4 bottom-6 z-20">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-primary/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Chính Hãng
                    </span>
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
            {categories.slice(0, 6).map((category: any) => (
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
          {categories.length > 6 && (
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold px-6 py-3 text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all"
              >
                Xem tất cả danh mục
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 40%, #f5f3ff 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Được yêu thích nhất
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-5xl">
                Sản Phẩm{' '}
                <span className="gradient-text">Nổi Bật</span>
              </h2>
              <p className="text-muted-foreground text-base max-w-md">
                Tuyển chọn những thiết bị công nghệ tốt nhất — chất lượng đỉnh cao, giá trị thực sự.
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-border bg-background/80 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-200 shadow-sm"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2.5 h-12 px-8 text-sm rounded-xl"
            >
              Khám Phá Toàn Bộ Sản Phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
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
