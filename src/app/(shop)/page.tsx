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
  { value: "5+", label: "5 năm kinh nghiệm", icon: Award },
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
    text: "Technoheart G9 đã giúp chúng tôi chuyển hóa nền tảng khoa học thành sản phẩm thực tiễn. Đội ngũ chuyên nghiệp và tận tâm, dự án hoàn thành trước tiến độ 2 tuần.",
    rating: 5,
  },
  {
    name: "Trần Minh Quân",
    role: "CEO, EduSmart Platform",
    text: "Với sự hỗ trợ của Technoheart G9, hệ thống giáo dục của chúng tôi đã phục vụ hơn 50.000 học viên. Công nghệ AI và blockchain tích hợp hoàn hảo với yêu cầu minh bạch.",
    rating: 5,
  },
  {
    name: "Phạm Thu Hương",
    role: "Trưởng phòng Công nghệ, VinaBio",
    text: "Nền tảng phân tích dựa trên khoa học mà Technoheart G9 xây dựng đã tăng tỷ lệ chuyển đổi của chúng tôi lên 34%. Đội ngũ hiểu sâu về cả khoa học lẫn công nghệ.",
    rating: 5,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col overflow-x-hidden bg-th-dark">

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        id="home"
        className="relative w-full overflow-hidden bg-linear-135 from-th-dark via-th-dark-alt to-th-dark min-h-screen"
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
            className="absolute inset-0 bg-linear-135 from-[rgba(10,22,40,0.88)] via-[rgba(13,31,60,0.72)] to-[rgba(10,22,40,0.88)]"
          />
        </div>

        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full w-[600px] h-[600px] -top-[200px] -right-[100px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-[40px]"
          />
          <div
            className="absolute rounded-full w-[500px] h-[500px] -bottom-[150px] -left-[100px] bg-[radial-gradient(circle,rgba(96,165,250,0.1)_0%,transparent_70%)] blur-[60px]"
          />
          <div
            className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(59,130,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.5)_1px,transparent_1px)] bg-[length:60px_60px]"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative pt-32 pb-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">

            {/* Left */}
            <div className="flex flex-col space-y-8 animate-fade-in-up">
              <div
                className="inline-flex items-center gap-2 rounded-full w-fit px-4 py-2 text-sm font-semibold bg-th-blue/15 border border-th-blue/30 text-th-blue-lt"
              >
                <span className="h-2 w-2 rounded-full animate-ping-slow bg-th-yellow" />
                Đối tác Công nghệ Khoa học Đáng tin cậy
              </div>

              <div className="w-[60px] h-1 bg-gradient-to-r from-th-yellow to-[#FFD700] rounded-sm" />

              <div className="space-y-4">
                <h1
                  className="font-bold leading-tight tracking-tight text-white"
                  style={{ fontSize: "clamp(1.8rem, 5vw, 3.6rem)", lineHeight: "1.1" }}
                >
                  Khoa học vì{" "}
                  <span className="bg-gradient-to-r from-th-blue to-th-blue-lt bg-clip-text text-transparent">
                    Con người
                  </span>
                  <br />Đổi mới bằng{" "}
                  <span className="text-th-yellow">Trái tim</span>
                </h1>
                <p className="sm:text-xl text-lg leading-relaxed max-w-xl text-th-muted">
                  Technoheart G9 – đơn vị trực thuộc Viện Khoa học Phát triển Tài năng Việt Nam – Bộ Khoa học & Công nghệ (ID: A‑1940). Tiên phong chuyển giao, thương mại hóa và lan tỏa các công trình khoa học Việt Nam.
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
                  { icon: Truck, text: "Giao hàng miễn phí trên 1.000.000đ" },
                  { icon: ShieldCheck, text: "Hàng chính hãng 100%" },
                  { icon: RefreshCw, text: "Đổi trong 30 ngày" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-th-muted">
                    <item.icon className="h-4 w-4 text-th-yellow" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right – hero image */}
              <div className="relative flex items-center justify-center animate-fade-in overflow-hidden" style={{ animationDelay: "0.3s" }}>
              <div className="relative w-full max-w-[520px]">
                {/* glow */}
                <div
                  className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse,rgba(59,130,246,0.28)_0%,transparent_70%)] blur-[40px] scale-110"
                />
                <div
                  className="relative animate-float rounded-2xl overflow-hidden border border-th-blue/30 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_32px_64px_rgba(0,0,0,0.5),0_0_80px_rgba(59,130,246,0.15)]"
                >
                  <Image src="/hero-dashboard.png" alt="Nền tảng Technoheart G9" width={520} height={390} className="object-cover w-full" priority />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(10,22,40,0.45)]" />
                </div>

                {/* float cards – ẩn trên mobile để tránh overflow */}
                <div className=" md:block absolute left-2 top-8 animate-float th-float-card" style={{ animationDelay: "0.5s" }}>
                  <div className="th-glass-card flex items-center gap-3 px-4 py-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-th-yellow/15">
                      <TrendingUp className="h-4 w-4 text-th-yellow" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-th-blue-lt">Sản phẩm kinh doanh</p>
                    </div>
                  </div>
                </div>

                <div className=" sm:block absolute right-2 bottom-16 animate-float th-float-card" style={{ animationDelay: "1s" }}>
                  <div className="th-glass-card flex items-center gap-3 px-4 py-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-th-blue/20">
                      <Zap className="h-4 w-4 text-th-blue-lt" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-th-blue-lt">Chương trình đào tạo kinh doanh</p>
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
      <section className="bg-th-dark-alt border-y border-th-blue/10">
        <div className="container mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-th-yellow" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-th-blue-lt">{stat.label}</div>
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
        className="w-full bg-gradient-to-b from-th-dark to-th-dark-alt pb-3"
      >
        <div className="container mx-auto px-4 md:px-6">

          {/* Badge – căn giữa toàn section */}
          <div className="flex justify-center pt-10 pb-8">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-th-blue/10 border border-th-blue/25 text-th-blue-lt"
            >
              <FlaskConical className="h-4 w-4 text-th-yellow" />
              Giới thiệu về Technoheart G9
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Logo / image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(59,130,246,0.25)_0%,transparent_70%)] blur-[30px] scale-[1.15]"
                />
                <div
                  className="relative rounded-2xl overflow-hidden flex items-center justify-center w-full max-w-[340px] mx-auto aspect-square bg-linear-135 from-th-dark-alt to-[#1E3A5F] border border-th-blue/25 shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
                >
                  {/* Logo */}
                  <div className="text-center flex flex-col items-center justify-center gap-4">
                    <Image
                      src="/logo-techno-web.png"
                      alt="Technoheart Logo"
                      width={240}
                      height={120}
                      className="object-contain w-auto max-h-40"
                    />
                    <p className="text-xs text-th-blue-lt">Science · Technology · Heart</p>
                  </div>
                </div>
                {/* deco ring */}
                <div
                  className="absolute -inset-4 rounded-full hero-ring-spin pointer-events-none border-[1.5px] border-dashed border-th-blue/20"
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-6">

              <h2 className="font-bold tracking-tight text-white" style={{ fontSize: "clamp(1.2rem, 3.5vw, 2.6rem)", lineHeight: "1.3" }}>
                Đơn vị tiên phong chuyển giao
                <br className="block sm:hidden" />
                {" "}<span className="text-th-blue-lt">Khoa học Việt Nam</span>{" "}
                ra thế giới
              </h2>


              <div className="space-y-4 text-base leading-relaxed text-th-dim">
                <p>
                  <strong className="text-white">Technoheart G9</strong> – đơn vị trực thuộc Viện Khoa học Phát triển Tài năng Việt Nam – Bộ Khoa học & Công nghệ (ID: A‑1940). Văn phòng: Phòng 410, Tòa nhà SBI, Đường số 3, Lô 6B, Khu Công viên Phần mềm Quang Trung, TP. Hồ Chí Minh.
                </p>
                <p>
                  Technoheart G9 đã tiên phong trong việc chuyển giao, thương mại hóa và lan tỏa các công trình khoa học Việt Nam, kết nối tri thức đến cộng đồng, biến khoa học thành giá trị sống phục vụ sức khỏe và hạnh phúc con người.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { icon: Target, label: "Tầm nhìn:", text: "Trở thành tập đoàn khoa học – công nghệ nhân văn toàn cầu, tiên phong trong nghiên cứu, ứng dụng và thương mại hóa các công trình khoa học đột phá." },
                  { icon: Heart, label: "Sứ mệnh:", text: "Bồi dưỡng cộng đồng những con người không chỉ sống – mà còn sống tốt. Ứng dụng và chuyển giao khoa học – công nghệ vào đời sống, biến tri thức thành giải pháp." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-9 w-9 rounded-lg shrink-0 flex items-center justify-center bg-th-yellow/10 border border-th-yellow/20">
                      <item.icon className="h-4 w-4 text-th-yellow" />
                    </div>
                    <p className="text-sm leading-relaxed text-th-dim">
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
          TẠI SAO CHỌN Technoheart G9
      ═══════════════════════════════════════════════════ */}
      <section
        id="why"
        className="w-full bg-gradient-to-b from-th-dark to-th-dark-alt pt-8 pb-3"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div className="space-y-8">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6 bg-th-blue/10 border border-th-blue/25 text-th-blue-lt"
                >
                  <Award className="h-4 w-4 text-th-yellow" />
                  Lý do lựa chọn
                </div>
                <h2 className="font-bold tracking-tight mb-4 text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: "1.2" }}>
                  Tại Sao Chọn{" "}
                  <span className="text-th-blue-lt">Technoheart G9?</span>
                </h2>
                <p className="text-lg leading-relaxed text-th-muted">
                  06 lý do chọn chúng tôi
                </p>
              </div>

              <ul className="space-y-4">
                {whyChoose.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5 bg-th-yellow/15 border border-th-yellow/30 text-th-yellow"
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm leading-relaxed text-th-dim">{item}</span>
                  </li>
                ))}
              </ul>

              <div
                  className="rounded-xl p-5 bg-th-blue/[0.06] border border-th-blue/15"
                >
                <p className="text-sm font-semibold mb-1 text-th-yellow">🏢 Văn phòng:</p>
                <p className="text-sm text-th-muted">
                  Phòng 410, Tòa nhà SBI, Đường số 3, Lô 6B, Khu Công viên Phần mềm Quang Trung, TP. Hồ Chí Minh, Việt Nam.
                </p>
              </div>
            </div>

            {/* Right – USP cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: Truck, title: "Giao Hàng Nhanh", desc: "Miễn phí toàn quốc cho đơn từ 1.000.000đ. Nhận hàng trong 1–3 ngày làm việc.", color: "#3B82F6" },
                { icon: ShieldCheck, title: "Bảo Hành Uy Tín", desc: "Cam kết 100% sản phẩm chính hãng. Bảo hành lên đến 24 tháng toàn quốc.", color: "#60A5FA" },
                { icon: RefreshCw, title: "Đổi Dễ Dàng", desc: "Hoàn tiền 100% trong 30 ngày nếu sản phẩm không đúng mô tả hoặc lỗi kỹ thuật.", color: "#FACC15" },
                { icon: Award, title: "Chứng Nhận Khoa Học", desc: "Tất cả sản phẩm được kiểm định bởi Viện Khoa học Phát triển Tài năng Việt Nam.", color: "#FACC15" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 bg-th-card border border-th-blue/15 shadow-lg shadow-black/20"
                >
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${item.color === "#FACC15" ? "bg-th-yellow/12 border border-th-yellow/25" : "bg-th-blue/12 border border-th-blue/25"}`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color === "#FACC15" ? "text-th-yellow" : "text-th-blue-lt"}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-th-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════
          GIÁ TRỊ CỐT LÕI
      ═══════════════════════════════════════════════════ */}
      <section
        id="values"
        className="w-full bg-gradient-to-b from-th-dark-alt to-th-dark pt-8 pb-3"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6 bg-th-blue/10 border border-th-blue/25 text-th-blue-lt"
            >
              <CheckCircle className="h-4 w-4 text-th-yellow" />
              Định hướng phát triển
            </div>
            <h2 className="font-bold tracking-tight mb-4 text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              Giá Trị <span className="text-th-blue-lt">Cốt Lõi</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-th-muted">
              5 nguyên tắc định hướng mọi hoạt động của Technoheart G9 – từ nghiên cứu đến sản phẩm và phụng sự cộng đồng.
            </p>
          </div>

          <div className="space-y-5">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="th-value-card flex items-center gap-6 p-6 rounded-xl bg-th-card border border-th-blue/12 transition-all duration-300"
              >
                <div
                  className="h-16 w-16 rounded-xl shrink-0 flex items-center justify-center bg-th-yellow/[0.08] border-[1.5px] border-th-yellow/35"
                >
                  <val.icon className="h-7 w-7 text-th-yellow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-white">{val.title}</h3>
                  <p className="text-sm leading-relaxed text-th-muted">{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRIẾT LÝ VẬN HÀNH
      ═══════════════════════════════════════════════════ */}
      <section
        id="philosophy"
        className="w-full bg-gradient-to-b from-th-dark-alt to-th-dark pt-8 pb-3"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6 bg-th-blue/10 border border-th-blue/25 text-th-blue-lt"
            >
              <Cpu className="h-4 w-4 text-th-yellow" />
              Triết lý vận hành
            </div>
            <h2 className="font-bold tracking-tight mb-3 text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              Triết Lý Vận Hành{" "}
              <span className="text-th-blue-lt">Technoheart G9</span>
            </h2>
            <p className="italic text-lg mb-2 text-th-muted">
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
                  className="h-10 w-10 rounded-lg flex items-center justify-center mb-4 font-bold text-lg shrink-0 bg-th-blue/15 border-[1.5px] border-th-blue/30 text-th-blue-lt"
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-semibold mb-2 text-th-yellow">{item.key}</h3>
                <p className="text-sm leading-relaxed text-th-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Leadership quote */}
          <div
            className="mt-14 rounded-xl p-8 text-center bg-th-card border border-th-blue/15 backdrop-blur-xl"
          >
            <Quote className="h-10 w-10 mx-auto mb-4 text-th-yellow" />
            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Thông điệp lãnh đạo</h3>
            <blockquote className="text-base italic leading-relaxed max-w-3xl mx-auto mb-6 text-th-dim">
              "Chúng tôi không chỉ tạo ra công nghệ – chúng tôi kiến tạo tương lai nhân văn. Mỗi bước tiến của Technoheart G9 là hành trình đưa khoa học phục vụ con người, để tri thức không còn nằm trong phòng thí nghiệm mà tỏa sáng trong cuộc sống."
            </blockquote>

            {/* Brand spirit */}
            <div
              className="inline-block rounded-lg px-6 py-4 mt-2 bg-th-yellow/[0.07] border border-th-yellow/20"
            >
              <p className="font-bold text-lg text-th-yellow">
                "Science for Humanity – Innovation with Heart – Prosperity with Purpose."
              </p>
              <p className="text-sm mt-2 text-th-muted">
                Khoa học vì Con người – Đổi mới bằng Trái tim – Hướng đến Cuộc sống Thịnh vượng và Có ý nghĩa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="reputation"
        className="w-full relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-th-dark to-th-dark-alt"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2
            className="font-bold tracking-tight mb-4 text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", lineHeight: "1.2" }}
          >
            UY TÍN <span className="text-th-blue-lt">GHI NHẬN</span>
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
                className="relative aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10 group"
              >
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Technoheart G9 Reputation Video ${index + 1}`}
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
      {/* <section
        id="testimonials"
        className="w-full"
        style={{ background: "linear-gradient(135deg, #0D1F3C 0%, #0A1628 50%, #0D2044 100%)", paddingTop: "24px", paddingBottom: "12px", }}
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
            <h2 className="font-bold tracking-tight" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#FFFFFF" }}>
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
      </section> */}

      {/* ═══════════════════════════════════════════════════
          SẢN PHẨM NỔI BẬT
      ═══════════════════════════════════════════════════ */}
      <section
        id="products"
        className="w-full bg-gradient-to-b from-th-dark via-[#0c1a30] to-th-dark py-24"
      >
        {/* Decorative blobs */}
        <div className="relative">
          <div
            className="absolute top-0 left-1/4 pointer-events-none w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.07)_0%,transparent_70%)] blur-[60px] -translate-y-1/2"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-14">
            <div className="space-y-3">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-th-blue/10 border border-th-blue/25 text-th-blue-lt"
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-th-yellow" />
                Được yêu thích nhất
              </div>
              <h2 className="font-bold tracking-tight text-white" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
                Sản Phẩm{" "}
                <span className="text-th-blue-lt">Nổi Bật</span>
              </h2>
              <p className="text-base max-w-md text-th-muted">
                Tuyển chọn những sản phẩm khoa học chất lượng cao – được chứng minh bằng dữ liệu và thực tiễn.
              </p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 border border-th-blue-lt/30 text-th-blue-lt bg-th-blue/[0.06]"
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
              <p className="text-lg text-th-blue-lt">Sản phẩm đang được cập nhật...</p>
              <Link href="/products" className="th-btn-primary inline-flex items-center gap-2 mt-6">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
