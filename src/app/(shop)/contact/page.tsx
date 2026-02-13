
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

export const metadata = {
    title: "Liên hệ | TechnoHeart",
    description: "Gửi tin nhắn hoặc gọi cho chúng tôi. TechnoHeart luôn sẵn sàng hỗ trợ bạn.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-16 md:py-20 gradient-hero overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-fade-in-up">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Bạn có câu hỏi hay cần hỗ trợ? Đội ngũ TechnoHeart luôn sẵn sàng hỗ trợ bạn 24/7.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-14 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-6 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-2">Thông tin liên hệ</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    icon: Mail,
                                    title: "Email",
                                    sub: "Hỗ trợ kỹ thuật & Mua hàng",
                                    value: "support@technoheart.vn",
                                    href: "mailto:support@technoheart.vn"
                                },
                                {
                                    icon: Phone,
                                    title: "Điện thoại",
                                    sub: "Thứ 2 - Chủ Nhật, 8:00 - 22:00",
                                    value: "1900 1234 (Miễn phí)",
                                    href: "tel:19001234"
                                },
                                {
                                    icon: MapPin,
                                    title: "Văn phòng",
                                    sub: "Trụ sở chính",
                                    value: "123 Đường Công Nghệ, Q.1, TP. HCM",
                                    href: null
                                }
                            ].map((item) => (
                                <div key={item.title} className="flex gap-4 p-5 rounded-xl bg-card border border-border/50 card-hover">
                                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-0.5">{item.title}</h3>
                                        <p className="text-muted-foreground text-xs mb-1">{item.sub}</p>
                                        {item.href ? (
                                            <a href={item.href} className="text-primary font-medium text-sm hover:underline">{item.value}</a>
                                        ) : (
                                            <p className="text-foreground font-medium text-sm">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <h3 className="font-bold mb-3">Mạng xã hội</h3>
                            <div className="flex gap-2">
                                {[
                                    { icon: Facebook, label: 'Facebook' },
                                    { icon: Instagram, label: 'Instagram' },
                                    { icon: Twitter, label: 'Twitter' },
                                    { icon: Globe, label: 'Website' },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href="#"
                                        className="h-10 w-10 rounded-xl border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7 animate-slide-in-right">
                        <div className="rounded-2xl border border-border/50 bg-card p-7 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold mb-1">Gửi lời nhắn</h2>
                            <p className="text-muted-foreground mb-6 text-sm">Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.</p>

                            <form className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Họ và tên</label>
                                        <input
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 px-4 text-sm placeholder:text-muted-foreground/50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-muted-foreground">Email</label>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 px-4 text-sm placeholder:text-muted-foreground/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Chủ đề</label>
                                    <input
                                        type="text"
                                        placeholder="Bạn muốn hỏi về vấn đề gì?"
                                        className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 px-4 text-sm placeholder:text-muted-foreground/50"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Nội dung</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Nhập chi tiết yêu cầu của bạn..."
                                        className="w-full rounded-xl border border-border/60 bg-secondary/30 p-4 text-sm placeholder:text-muted-foreground/50 resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    Gửi tin nhắn <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
                    {[
                        { icon: Clock, title: "Giờ làm việc", desc: "Thứ 2 - Thứ 6: 8:00 - 20:00\nThứ 7 - CN: 9:00 - 18:00" },
                        { icon: MessageSquare, title: "Chat trực tuyến", desc: "Phản hồi tức thì qua Zalo OA\nhoặc hỗ trợ trên Web.", cta: "Chat ngay →" },
                        { icon: Globe, title: "Cộng đồng", desc: "Tham gia nhóm TechnoHub để\ncập nhật thủ thuật công nghệ.", cta: "Tham gia →" }
                    ].map((item: any, idx) => (
                        <div key={idx} className="p-7 rounded-2xl bg-secondary/20 border border-border/40 text-center card-hover space-y-3">
                            <div className="h-11 w-11 bg-background rounded-xl flex items-center justify-center mx-auto shadow-sm text-primary">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{item.desc}</p>
                            {item.cta && (
                                <button className="text-primary font-semibold text-sm hover:underline">{item.cta}</button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Map */}
                <div className="mt-16 rounded-2xl overflow-hidden border border-border/40 h-[350px] relative grayscale hover:grayscale-0 transition-all duration-700 shadow-lg">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.46023242831!2d106.664402375838!3d10.77601938937307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eda16067f5b%3A0x6734c26a798f041d!2zMTIzIMSQLiBDw7RuZyBOZ2jhu4csIFBox4gMTAsIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}
