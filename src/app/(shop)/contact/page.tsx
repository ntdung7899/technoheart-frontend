"use client";

import { useState, useEffect } from "react";
import {
    Mail, Phone, MapPin, MessageSquare, Clock, Send,
    Globe, Facebook, Instagram, Twitter, CheckCircle2,
    Loader2, ArrowRight, Sparkles, Headphones, Users
} from "lucide-react";
import {
  getContactInfo,
  sendContactMessage,
  type ContactInfo as ApiContactInfo,
} from "@/lib/api/contact";

interface ContactInfo {
    email: string; emailSub: string;
    phone: string; phoneSub: string;
    address: string; addressSub: string;
    facebook: string; instagram: string; twitter: string; website: string;
    mapEmbed: string;
}

const DEFAULT_INFO: ContactInfo = {
    email: "support@technoheart.vn", emailSub: "Hỗ trợ kỹ thuật & Mua hàng",
    phone: "1900 1234 (Miễn phí)", phoneSub: "Thứ 2 - Chủ Nhật, 8:00 - 22:00",
    address: "123 Đường Công Nghệ, Q.1, TP. HCM", addressSub: "Trụ sở chính",
    facebook: "#", instagram: "#", twitter: "#", website: "#",
    mapEmbed: "",
};

export default function ContactPage() {
    const [info, setInfo] = useState<ContactInfo>(DEFAULT_INFO);
    const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
    getContactInfo()
        .then((data) => {
            if (data?.email) {
                setInfo({
                    ...DEFAULT_INFO,
                    ...data,
                });
            }
        })
        .catch(() => {});
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const name = form.name.trim();
        const email = form.email.trim();
        const subject = form.subject.trim();
        const body = form.body.trim();

        if (!name || !email || !subject || !body) {
            setError("Vui lòng nhập đầy đủ thông tin liên hệ.");
            return;
        }

        setSending(true);

        try {
            await sendContactMessage({
                name,
                email,
                subject,
                body,
            });

            setSent(true);
            setForm({
                name: "",
                email: "",
                subject: "",
                body: "",
            });
        } catch (error) {
            console.error("SEND_CONTACT_MESSAGE_ERROR:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Không thể gửi tin nhắn, vui lòng thử lại."
            );
        } finally {
            setSending(false);
        }
    };

    const contactCards = [
        {
            icon: Mail,
            title: "Email",
            sub: info.emailSub,
            value: info.email,
            href: `mailto:${info.email}`,
            gradient: "from-blue-500/10 to-indigo-500/10",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-500/10",
        },
        {
            icon: Phone,
            title: "Điện thoại",
            sub: info.phoneSub,
            value: info.phone,
            href: `tel:${info.phone.replace(/\D/g, "")}`,
            gradient: "from-emerald-500/10 to-teal-500/10",
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-500/10",
        },
        {
            icon: MapPin,
            title: "Văn phòng",
            sub: info.addressSub || "Địa chỉ liên hệ",
            value: info.address || "Đang cập nhật địa chỉ",
            href: null,
            gradient: "from-orange-500/10 to-amber-500/10",
            iconColor: "text-orange-600",
            iconBg: "bg-orange-500/10",
        },
    ];

    const socials = [
        { icon: Facebook, label: "Facebook", href: info.facebook, color: "hover:bg-[#1877F2] hover:text-white" },
        { icon: Instagram, label: "Instagram", href: info.instagram, color: "hover:bg-gradient-to-br hover:from-[#E1306C] hover:to-[#F77737] hover:text-white" },
        { icon: Twitter, label: "Twitter", href: info.twitter, color: "hover:bg-[#1DA1F2] hover:text-white" },
        { icon: Globe, label: "Website", href: info.website, color: "hover:bg-primary hover:text-white" },
    ];

    const features = [
        {
            icon: Clock,
            title: "Phản hồi nhanh",
            desc: "Chúng tôi cam kết phản hồi trong vòng 2 giờ làm việc.",
            accent: "text-blue-600 bg-blue-50",
        },
        {
            icon: Headphones,
            title: "Hỗ trợ đa kênh",
            desc: "Liên hệ qua email, điện thoại, Zalo hoặc trực tiếp tại cửa hàng.",
            accent: "text-purple-600 bg-purple-50",
        },
        {
            icon: Users,
            title: "Đội ngũ chuyên nghiệp",
            desc: "Nhân viên được đào tạo bài bản, sẵn sàng giải đáp mọi thắc mắc.",
            accent: "text-emerald-600 bg-emerald-50",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* ── Hero Section ── */}
            <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/[0.03] via-background to-background">
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 right-[15%] w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/[0.04]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/[0.02]" />
                </div>

                <div className="container mx-auto px-4 lg:px-8 relative text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold mb-6">
                        <Sparkles className="h-3.5 w-3.5" />
                        Luôn sẵn sàng hỗ trợ bạn 24/7
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Bạn có câu hỏi hoặc cần hỗ trợ? Đội ngũ Technoheart luôn lắng nghe và phản hồi nhanh chóng.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 lg:px-8">
                {/* ── Contact Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 -mt-8 relative z-10 mb-16">
                    {contactCards.map((item) => (
                        <div
                            key={item.title}
                            className={`group relative p-6 rounded-xl bg-card border border-border/50 shadow-lg shadow-black/[0.03] hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1 transition-all duration-300`}
                        >
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                            <div className="relative">
                                <div className={`h-12 w-12 rounded-xl ${item.iconBg} flex items-center justify-center ${item.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-foreground mb-0.5">{item.title}</h3>
                                <p className="text-muted-foreground text-xs mb-2">{item.sub}</p>
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-1 group/link break-words"
                                    >
                                        {item.value}
                                        <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all shrink-0" />
                                    </a>
                                ) : item.title === "Văn phòng" ? (
                                        <p className="text-foreground font-semibold text-sm leading-relaxed break-words whitespace-normal">
                                            {(() => {
                                                const value = item.value || "Đang cập nhật";

                                                const company = value.match(/^(.+?)(?:,\s*Trụ sở:|Trụ sở:)/i)?.[1]?.trim();
                                                const office = value.match(/Trụ sở:\s*(.+?)(?:,\s*Email:|Email:|$)/i)?.[1]?.trim();
                                                const email = value.match(/Email:\s*(.+?)(?:,\s*Web:|Web:|$)/i)?.[1]?.trim();
                                                const web = value.match(/Web:\s*(.+)$/i)?.[1]?.trim();

                                                if (!company && !office && !email && !web) {
                                                    return value;
                                                }

                                                return (
                                                    <>
                                                        {company && <span className="block">{company}</span>}

                                                        {office && (
                                                            <span className="block">
                                                                Trụ sở: {office}
                                                            </span>
                                                        )}

                                                        {email && (
                                                            <span className="block">
                                                                Email: {email}
                                                            </span>
                                                        )}

                                                        {web && (
                                                            <span className="block">
                                                                Web: {web}
                                                            </span>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </p>
                                    ) : (
                                    <p className="text-foreground font-semibold text-sm leading-relaxed break-words whitespace-normal">
                                        {item.value || "Đang cập nhật"}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Main Content: Form + Sidebar ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
                    {/* Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-xl border border-border/50 bg-card shadow-xl shadow-black/[0.04] overflow-hidden">
                            {/* Form header */}
                            <div className="relative px-8 pt-8 pb-6 border-b border-border/50 bg-gradient-to-r from-primary/[0.03] to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Gửi lời nhắn</h2>
                                        <p className="text-muted-foreground text-xs">Chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form body */}
                            <div className="p-8">
                                {sent ? (
                                    <div className="flex flex-col items-center justify-center py-10 gap-5 text-center">
                                        <div className="relative">
                                            <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
                                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                            </div>
                                            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold text-foreground">Gửi thành công!</h3>
                                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                                Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSent(false)}
                                            className="mt-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Gửi tin nhắn khác
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-muted-foreground">Họ và tên <span className="text-red-400">*</span></label>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                                    placeholder="Nguyễn Văn A"
                                                    className="h-12 w-full rounded-xl border border-border/60 bg-secondary/20 px-4 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-muted-foreground">Email <span className="text-red-400">*</span></label>
                                                <input
                                                    type="email"
                                                    value={form.email}
                                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                                    placeholder="name@example.com"
                                                    className="h-12 w-full rounded-xl border border-border/60 bg-secondary/20 px-4 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-muted-foreground">Chủ đề <span className="text-red-400">*</span></label>
                                            <input
                                                type="text"
                                                value={form.subject}
                                                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                                                placeholder="Bạn muốn hỏi về vấn đề gì?"
                                                className="h-12 w-full rounded-xl border border-border/60 bg-secondary/20 px-4 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-muted-foreground">Nội dung <span className="text-red-400">*</span></label>
                                            <textarea
                                                rows={5}
                                                value={form.body}
                                                onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                                                placeholder="Nhập chi tiết yêu cầu của bạn..."
                                                className="w-full rounded-xl border border-border/60 bg-secondary/20 p-4 text-sm placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                                required
                                            />
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="w-full h-13 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
                                        >
                                            {sending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            )}
                                            {sending ? "Đang gửi..." : "Gửi tin nhắn"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Features */}
                        <div className="space-y-4">
                            {features.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group flex gap-4 p-5 rounded-xl bg-card border border-border/50 hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <div className={`h-11 w-11 rounded-xl ${item.accent} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="p-6 rounded-xl bg-card border border-border/50">
                            <h3 className="font-semibold text-foreground mb-4">Kết nối với chúng tôi</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {socials.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href || "#"}
                                        target={social.href && social.href !== "#" ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className={`h-14 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${social.color}`}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-5 w-5" />
                                        <span className="text-xs font-medium">{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Working hours */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/10">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-foreground text-sm">Giờ làm việc</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Thứ 2 - Thứ 6</span>
                                    <span className="font-semibold text-foreground">8:00 - 20:00</span>
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Thứ 7 - Chủ nhật</span>
                                    <span className="font-semibold text-foreground">9:00 - 18:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Map Section ── */}
                {info.mapEmbed && (
                    <div className="mb-16">
                        <div className="flex items-center gap-2 mb-5">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">Vị trí của chúng tôi</h2>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-border/40 h-[380px] relative grayscale hover:grayscale-0 transition-all duration-700 shadow-lg group">
                            <iframe
                                src={info.mapEmbed}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
