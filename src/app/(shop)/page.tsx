import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Zap,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Quote,
  Heart,
  FlaskConical,
  Cpu,
  Handshake,
  Target,
} from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ContactForm } from "@/components/ui/ContactForm";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

async function getFeaturedProducts() {
  return await prisma.product.findMany({
    take: 8,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Static content ───────────────────────────────────────────────────────────

const coreValues = [
  {
    icon: FlaskConical,
    title: "Đổi mới dựa trên khoa học",
    desc: "Lấy nghiên cứu và công nghệ làm nền tảng cho mọi sáng tạo – tạo ra giá trị được chứng minh bằng dữ liệu và thực tiễn.",
  },
  {
    icon: Heart,
    title: "Con người là trung tâm",
    desc: "Phát triển công nghệ vì sức khỏe, trí tuệ và hạnh phúc con người – không để công nghệ tách rời nhân tính.",
  },
  {
    icon: ShieldCheck,
    title: "Chính trực và minh bạch",
    desc: "Trung thực, rõ ràng, ứng dụng công nghệ số và blockchain để đảm bảo minh bạch tuyệt đối trong mọi hoạt động.",
  },
  {
    icon: Handshake,
    title: "Hợp tác để tạo giá trị",
    desc: "Kết nối trí tuệ Việt với cộng đồng khoa học toàn cầu – cùng kiến tạo giá trị bền vững cho xã hội và hành tinh.",
  },
  {
    icon: Target,
    title: "Phát triển vì mục tiêu lớn hơn lợi nhuận",
    desc: "Theo đuổi tăng trưởng bền vững gắn liền với phụng sự, lan tỏa tri thức, trao quyền và kiến tạo thịnh vượng toàn diện.",
  },
];

const stats = [
  { value: "200+", label: "Sản phẩm khoa học", icon: Zap },
  { value: "50+", label: "Chuyên gia & Đối tác", icon: Users },
  { value: "10+", label: "Năm kinh nghiệm", icon: Award },
  { value: "98%", label: "Khách hàng hài lòng", icon: Star },
];

const philosophy = [
  {
    key: "Khoa học là gốc rễ",
    desc: "Mọi sản phẩm và quyết định đều dựa trên bằng chứng khoa học và giá trị nhân sinh.",
  },
  {
    key: "Công nghệ là cầu nối",
    desc: "AI, Blockchain và số hóa giúp lan tỏa tri thức và minh bạch toàn cầu.",
  },
  {
    key: "Phụng sự là con đường",
    desc: "Thành công là kết quả tự nhiên của hành trình phụng sự bằng trí tuệ và tình yêu.",
  },
  {
    key: "Con người là trung tâm",
    desc: "Sức khỏe – trí tuệ – hạnh phúc là thước đo cao nhất của thành công doanh nghiệp.",
  },
  {
    key: "Hợp tác thay vì cạnh tranh",
    desc: "Cùng nhau phát triển, kiến tạo giá trị bền vững cho xã hội và hành tinh.",
  },
];

const whyChoose = [
  "Xuất phát từ nền tảng khoa học thực chứng – không chỉ là kinh doanh.",
  "Lãnh đạo khoa học uy tín – Giáo sư Trần Văn Tín.",
  "Giải pháp toàn diện cho sức khỏe, trí tuệ và phụng sự con người.",
  "Định vị \"Made by Vietnamese Intelligence for The World.\"",
  "Tiên phong ứng dụng Blockchain & Khoa học lượng tử.",
  "Hệ sinh thái \"Consumer to Co‑Creator.\"",
];

const testimonials = [
  {
    name: "Nguyễn Thị Lan",
    role: "Giám đốc điều hành, HealthTech VN",
    text: "TechnoHeart đã giúp chúng tôi chuyển hóa nền tảng khoa học thành sản phẩm thực tiễn. Đội ngũ chuyên nghiệp và tận tâm, dự án hoàn thành trước tiến độ 2 tuần.",
    rating: 5,
  },
  {
    name: "Trần Minh Quân",
    role: "CEO, EduSmart Platform",
    text: "Với sự hỗ trợ của TechnoHeart, hệ thống giáo dục của chúng tôi đã phục vụ hơn 50.000 học viên. Công nghệ AI và blockchain tích hợp hoàn hảo với yêu cầu minh bạch.",
    rating: 5,
  },
  {
    name: "Phạm Thu Hương",
    role: "Trưởng phòng Công nghệ, VinaBio",
    text: "Nền tảng phân tích dựa trên khoa học mà TechnoHeart xây dựng đã tăng tỷ lệ chuyển đổi của chúng tôi lên 34%. Đội ngũ hiểu sâu về cả khoa học lẫn công nghệ.",
    rating: 5,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col" style={{ background: "#0A1628" }}>

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 40%, #0A1628 100%)",
          minHeight: "100vh",
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/tech-hero-bg.png"
            alt="Tech background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(10,22,40,0.88) 0%, rgba(13,31,60,0.72) 50%, rgba(10,22,40,0.88) 100%)",
            }}
          />
        </div>

        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: "600px", height: "600px",
              top: "-200px", right: "-100px",
              background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "500px", height: "500px",
              bottom: "-150px", left: "-100px",
              background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative" style={{ paddingTop: "130px", paddingBottom: "100px" }}>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

            {/* Left */}
            <div className="flex flex-col space-y-8 animate-fade-in-up">
              <div
                className="inline-flex items-center gap-2 rounded-full w-fit px-4 py-2 text-sm font-semibold"
                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
              >
                <span className="h-2 w-2 rounded-full animate-ping-slow" style={{ background: "#FACC15" }} />
                Đối tác Công nghệ Khoa học Đáng tin cậy
              </div>

              <div style={{ width: "60px", height: "4px", background: "linear-gradient(90deg, #FACC15, #FFD700)", borderRadius: "2px" }} />

              <div className="space-y-4">
                <h1
                  className="font-extrabold leading-tight tracking-tight"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "#FFFFFF", lineHeight: "1.1" }}
                >
                  Khoa học vì{" "}
                  <span style={{ background: "linear-gradient(90deg, #3B82F6, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Con người
                  </span>
                  <br />Đổi mới bằng{" "}
                  <span style={{ color: "#FACC15" }}>Trái tim</span>
                </h1>
                <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#93C5FD" }}>
                  TechnoHeart – đơn vị trực thuộc Viện Khoa học Phát triển Tài năng Việt Nam – Bộ Khoa học & Công nghệ (ID: A‑1940). Tiên phong chuyển giao, thương mại hóa và lan tỏa các công trình khoa học Việt Nam.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#products" className="th-btn-primary inline-flex items-center justify-center gap-2">
                  Xem Sản Phẩm <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#about" className="th-btn-outline inline-flex items-center justify-center gap-2">
                  Tìm Hiểu Thêm <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* USP strip */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                {[
                  { icon: Truck, text: "Giao hàng miễn phí từ 500k" },
                  { icon: ShieldCheck, text: "Hàng chính hãng 100%" },
                  { icon: RefreshCw, text: "Đổi trả trong 30 ngày" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: "#93C5FD" }}>
                    <item.icon className="h-4 w-4" style={{ color: "#FACC15" }} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right – hero image */}
            <div className="relative flex items-center justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative w-full max-w-[520px]">
                {/* glow */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "radial-gradient(ellipse, rgba(59,130,246,0.28) 0%, transparent 70%)",
                    filter: "blur(40px)", transform: "scale(1.1)",
                  }}
                />
                <div
                  className="relative animate-float rounded-3xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(59,130,246,0.3)",
                    boxShadow: "0 0 0 1px rgba(59,130,246,0.2), 0 32px 64px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.15)",
                  }}
                >
                  <Image src="/hero-dashboard.png" alt="Nền tảng TechnoHeart" width={520} height={390} className="object-cover w-full" priority />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(10,22,40,0.45) 100%)" }} />
                </div>

                {/* float cards */}
                <div className="absolute -left-8 top-8 animate-float th-float-card" style={{ animationDelay: "0.5s" }}>
                  <div className="th-glass-card flex items-center gap-3 px-4 py-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(250,204,21,0.15)" }}>
                      <TrendingUp className="h-4 w-4" style={{ color: "#FACC15" }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#60A5FA" }}>Sản phẩm</p>
                      <p className="text-sm font-bold text-white">200+ Khoa học</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-16 animate-float th-float-card" style={{ animationDelay: "1s" }}>
                  <div className="th-glass-card flex items-center gap-3 px-4 py-3">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.2)" }}>
                      <Zap className="h-4 w-4" style={{ color: "#60A5FA" }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#60A5FA" }}>Đối tác</p>
                      <p className="text-sm font-bold text-white">50+ Chuyên gia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "60px" }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#0A1628" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════ */}
      <section style={{ background: "#0D1F3C", borderTop: "1px solid rgba(59,130,246,0.1)", borderBottom: "1px solid rgba(59,130,246,0.1)" }}>
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2" style={{ color: "#FACC15" }} />
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium" style={{ color: "#60A5FA" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GIỚI THIỆU
      ═══════════════════════════════════════════════════ */}
      <section
        id="about"
        className="w-full"
        style={{ background: "linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)", paddingTop: "96px", paddingBottom: "96px" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Logo / image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)", filter: "blur(30px)", transform: "scale(1.15)" }}
                />
                <div
                  className="relative rounded-3xl overflow-hidden flex items-center justify-center"
                  style={{
                    width: "340px", height: "340px",
                    background: "linear-gradient(135deg, #0D1F3C 0%, #1E3A5F 100%)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Logo */}
                  <div className="text-center flex flex-col items-center justify-center gap-4">
                    <Image
                      src="/logo-techno-web.png"
                      alt="TechnoHeart Logo"
                      width={240}
                      height={120}
                      className="object-contain w-auto max-h-40"
                    />
                    <p className="text-xs" style={{ color: "#60A5FA" }}>Science · Technology · Heart</p>
                  </div>
                </div>
                {/* deco ring */}
                <div
                  className="absolute -inset-4 rounded-full hero-ring-spin pointer-events-none"
                  style={{ border: "1.5px dashed rgba(59,130,246,0.2)" }}
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
              >
                <FlaskConical className="h-4 w-4" style={{ color: "#FACC15" }} />
                Giới thiệu về TechnoHeart
              </div>

              <h2 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#FFFFFF", lineHeight: "1.2" }}>
                Đơn vị tiên phong chuyển giao{" "}
                <span style={{ color: "#60A5FA" }}>Khoa học Việt Nam</span>{" "}
                ra thế giới
              </h2>

              <div className="space-y-4 text-base leading-relaxed" style={{ color: "#CBD5E1" }}>
                <p>
                  <strong className="text-white">TechnoHeart</strong> – đơn vị trực thuộc Viện Khoa học Phát triển Tài năng Việt Nam – Bộ Khoa học & Công nghệ (ID: A‑1940). Văn phòng: Phòng 410, Tòa nhà SBI, Đường số 3, Lô 6B, Khu Công viên Phần mềm Quang Trung, TP. Hồ Chí Minh.
                </p>
                <p>
                  TechnoHeart đã tiên phong trong việc chuyển giao, thương mại hóa và lan tỏa các công trình khoa học Việt Nam, kết nối tri thức đến cộng đồng, biến khoa học thành giá trị sống phục vụ sức khỏe và hạnh phúc con người.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { icon: Target, label: "Tầm nhìn:", text: "Trở thành tập đoàn khoa học – công nghệ nhân văn toàn cầu, tiên phong trong nghiên cứu, ứng dụng và thương mại hóa các công trình khoa học đột phá." },
                  { icon: Heart, label: "Sứ mệnh:", text: "Bồi dưỡng cộng đồng những con người không chỉ sống – mà còn sống tốt. Ứng dụng và chuyển giao khoa học – công nghệ vào đời sống, biến tri thức thành giải pháp." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-9 w-9 rounded-xl shrink-0 flex items-center justify-center" style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}>
                      <item.icon className="h-4 w-4" style={{ color: "#FACC15" }} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                      <strong className="text-white">{item.label}</strong> {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GIÁ TRỊ CỐT LÕI
      ═══════════════════════════════════════════════════ */}
      <section
        id="values"
        className="w-full"
        style={{ background: "linear-gradient(180deg, #0D1F3C 0%, #0A1628 100%)", paddingTop: "96px", paddingBottom: "96px" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
            >
              <CheckCircle className="h-4 w-4" style={{ color: "#FACC15" }} />
              Định hướng phát triển
            </div>
            <h2 className="font-extrabold tracking-tight mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF" }}>
              Giá Trị <span style={{ color: "#60A5FA" }}>Cốt Lõi</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
              Năm nguyên tắc định hướng mọi hoạt động của TechnoHeart – từ nghiên cứu đến sản phẩm và phụng sự cộng đồng.
            </p>
          </div>

          <div className="space-y-5">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="th-value-card flex items-center gap-6 p-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(59,130,246,0.12)",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="h-16 w-16 rounded-2xl shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(250,204,21,0.08)", border: "1.5px solid rgba(250,204,21,0.35)" }}
                >
                  <val.icon className="h-7 w-7" style={{ color: "#FACC15" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">{val.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#93C5FD" }}>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SẢN PHẨM NỔI BẬT
      ═══════════════════════════════════════════════════ */}
      <section
        id="products"
        className="w-full"
        style={{
          background: "linear-gradient(180deg, #0A1628 0%, #0c1a30 50%, #0A1628 100%)",
          paddingTop: "96px",
          paddingBottom: "96px",
        }}
      >
        {/* Decorative blobs */}
        <div className="relative">
          <div
            className="absolute top-0 left-1/4 pointer-events-none"
            style={{ width: "500px", height: "500px", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)", filter: "blur(60px)", transform: "translateY(-50%)" }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
            <div className="space-y-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#FACC15" }} />
                Được yêu thích nhất
              </div>
              <h2 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF" }}>
                Sản Phẩm{" "}
                <span style={{ color: "#60A5FA" }}>Nổi Bật</span>
              </h2>
              <p className="text-base max-w-md" style={{ color: "#93C5FD" }}>
                Tuyển chọn những sản phẩm khoa học chất lượng cao – được chứng minh bằng dữ liệu và thực tiễn.
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
              style={{ border: "1px solid rgba(96,165,250,0.3)", color: "#60A5FA", background: "rgba(59,130,246,0.06)" }}
            >
              Xem tất cả sản phẩm
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-14 text-center">
                <Link href="/products" className="th-btn-primary inline-flex items-center gap-2.5">
                  Khám Phá Toàn Bộ Sản Phẩm
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg" style={{ color: "#60A5FA" }}>Sản phẩm đang được cập nhật...</p>
              <Link href="/products" className="th-btn-primary inline-flex items-center gap-2 mt-6">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRIẾT LÝ VẬN HÀNH
      ═══════════════════════════════════════════════════ */}
      <section
        id="philosophy"
        className="w-full"
        style={{ background: "linear-gradient(180deg, #0D1F3C 0%, #0A1628 100%)", paddingTop: "96px", paddingBottom: "96px" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
            >
              <Cpu className="h-4 w-4" style={{ color: "#FACC15" }} />
              Triết lý vận hành
            </div>
            <h2 className="font-extrabold tracking-tight mb-3" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF" }}>
              Triết Lý Vận Hành{" "}
              <span style={{ color: "#60A5FA" }}>TechnoHeart</span>
            </h2>
            <p className="italic text-lg mb-2" style={{ color: "#93C5FD" }}>
              "Khoa học là nền tảng – Phụng sự là động lực – Con người là trung tâm."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {philosophy.map((item, idx) => (
              <div
                key={idx}
                className={`th-service-card group ${idx === 4 ? "lg:col-start-2" : ""
                  }`}
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-4 font-extrabold text-lg shrink-0"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1.5px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#FACC15" }}>{item.key}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#93C5FD" }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Leadership quote */}
          <div
            className="mt-14 rounded-2xl p-8 text-center"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(59,130,246,0.15)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Quote className="h-10 w-10 mx-auto mb-4" style={{ color: "#FACC15" }} />
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Thông điệp lãnh đạo</h3>
            <blockquote className="text-base italic leading-relaxed max-w-3xl mx-auto mb-6" style={{ color: "#CBD5E1" }}>
              "Chúng tôi không chỉ tạo ra công nghệ – chúng tôi kiến tạo tương lai nhân văn. Mỗi bước tiến của TechnoHeart là hành trình đưa khoa học phục vụ con người, để tri thức không còn nằm trong phòng thí nghiệm mà tỏa sáng trong cuộc sống."
            </blockquote>

            {/* Brand spirit */}
            <div
              className="inline-block rounded-xl px-6 py-4 mt-2"
              style={{ background: "rgba(250,204,21,0.07)", border: "1px solid rgba(250,204,21,0.2)" }}
            >
              <p className="font-extrabold text-lg" style={{ color: "#FACC15" }}>
                "Science for Humanity – Innovation with Heart – Prosperity with Purpose."
              </p>
              <p className="text-sm mt-2" style={{ color: "#93C5FD" }}>
                Khoa học vì Con người – Đổi mới bằng Trái tim – Hướng đến Cuộc sống Thịnh vượng và Có ý nghĩa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TẠI SAO CHỌN TECHNOHEART
      ═══════════════════════════════════════════════════ */}
      <section
        id="why"
        className="w-full"
        style={{ background: "linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)", paddingTop: "96px", paddingBottom: "96px" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div className="space-y-8">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
                >
                  <Award className="h-4 w-4" style={{ color: "#FACC15" }} />
                  Lý do lựa chọn
                </div>
                <h2 className="font-extrabold tracking-tight mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF", lineHeight: "1.2" }}>
                  Tại Sao Chọn{" "}
                  <span style={{ color: "#60A5FA" }}>TechnoHeart?</span>
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: "#93C5FD" }}>
                  06 lý do khiến hàng nghìn khách hàng tin tưởng lựa chọn TechnoHeart là đối tác phát triển khoa học – công nghệ của họ.
                </p>
              </div>

              <ul className="space-y-4">
                {whyChoose.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: "rgba(250,204,21,0.15)", border: "1px solid rgba(250,204,21,0.3)", color: "#FACC15" }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>{item}</span>
                  </li>
                ))}
              </ul>

              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "#FACC15" }}>🏢 Văn phòng:</p>
                <p className="text-sm" style={{ color: "#93C5FD" }}>
                  Phòng 410, Tòa nhà SBI, Đường số 3, Lô 6B, Khu Công viên Phần mềm Quang Trung, TP. Hồ Chí Minh, Việt Nam.
                </p>
              </div>
            </div>

            {/* Right – USP cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: Truck, title: "Giao Hàng Nhanh", desc: "Miễn phí toàn quốc cho đơn từ 500.000đ. Nhận hàng trong 1–3 ngày làm việc.", color: "#3B82F6" },
                { icon: ShieldCheck, title: "Bảo Hành Uy Tín", desc: "Cam kết 100% sản phẩm chính hãng. Bảo hành lên đến 24 tháng toàn quốc.", color: "#60A5FA" },
                { icon: RefreshCw, title: "Đổi Trả Dễ Dàng", desc: "Hoàn tiền 100% trong 30 ngày nếu sản phẩm không đúng mô tả hoặc lỗi kỹ thuật.", color: "#FACC15" },
                { icon: Award, title: "Chứng Nhận Khoa Học", desc: "Tất cả sản phẩm được kiểm định bởi Viện Khoa học Phát triển Tài năng Việt Nam.", color: "#FACC15" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(59,130,246,0.15)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `rgba(${item.color === "#FACC15" ? "250,204,21" : "59,130,246"},0.12)`, border: `1px solid rgba(${item.color === "#FACC15" ? "250,204,21" : "59,130,246"},0.25)` }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#93C5FD" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="reputation"
        className="w-full relative overflow-hidden py-16 md:py-20"
        style={{
          background: "linear-gradient(180deg, #0A1628 0%, #0D1F3C 100%)"
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2
            className="font-extrabold tracking-tight mb-4" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF", lineHeight: "1.2" }}
          >
            UY TÍN <span style={{ color: "#60A5FA" }}>GHI NHẬN</span>
          </h2>
          <div className="max-w-5xl mx-auto space-y-4">
            <p className="text-white text-lg md:text-xl leading-relaxed font-medium">
              Các bài báo, phỏng vấn và giải thưởng vinh danh Giáo sư Trần Văn Tín.
              Chứng nhận của Viện Khoa học & Phát triển Tài năng Việt Nam.
              Sự công nhận của cộng đồng khoa học & truyền thông trong và ngoài nước.
            </p>
          </div>

          {/* Video Frames */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto">
            {[
              "dbOe2JLqApg",
              "8A97HlzWm6A",
              "Zo_LGxcBOcw"
            ].map((videoId, index) => (
              <div
                key={index}
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`TechnoHeart Reputation Video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        className="w-full"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #0A1628 50%, #0D2044 100%)", paddingTop: "96px", paddingBottom: "96px" }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
              style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}
            >
              <Quote className="h-4 w-4" style={{ color: "#FACC15" }} />
              Câu chuyện khách hàng
            </div>
            <h2 className="font-extrabold tracking-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF" }}>
              Khách Hàng <span style={{ color: "#60A5FA" }}>Nói Gì?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="th-testimonial-card">
                <Quote className="h-8 w-8 mb-4" style={{ color: "#FACC15" }} />
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" style={{ color: "#FACC15", fill: "#FACC15" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "#CBD5E1" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)", color: "#FFF" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{t.name}</p>
                    <p className="text-xs" style={{ color: "#60A5FA" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          LIÊN HỆ
      ═══════════════════════════════════════════════════ */}

    </div>
  );
}
