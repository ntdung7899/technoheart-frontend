
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

export const metadata = {
    title: "Liên hệ | TechnoHeart",
    description: "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn hoặc gọi cho chúng tôi ngay.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <section className="relative py-20 bg-primary/5 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Liên hệ với chúng tôi</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Bạn có câu hỏi, ý tưởng hay chỉ đơn giản là muốn trò chuyện? Đừng ngần ngại liên hệ. Đội ngũ TechnoHeart luôn sẵn sàng hỗ trợ bạn 24/7.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Contact Info - Left Column */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-8">Thông tin trực tiếp</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Email</h3>
                                        <p className="text-muted-foreground text-sm mb-1">Hỗ trợ kỹ thuật & Mua hàng</p>
                                        <a href="mailto:support@technoheart.vn" className="text-primary font-medium hover:underline">support@technoheart.vn</a>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Điện thoại</h3>
                                        <p className="text-muted-foreground text-sm mb-1">Thứ 2 - Chủ Nhật, 8:00 - 22:00</p>
                                        <a href="tel:19001234" className="text-primary font-medium hover:underline">1900 1234 (Miễn phí)</a>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/5">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Văn phòng</h3>
                                        <p className="text-muted-foreground text-sm mb-1">Trụ sở chính thiết kế</p>
                                        <p className="text-foreground font-medium">123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6">Mạng xã hội</h2>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, label: 'Facebook', href: '#' },
                                    { icon: Instagram, label: 'Instagram', href: '#' },
                                    { icon: Twitter, label: 'Twitter', href: '#' },
                                    { icon: Globe, label: 'Website', href: '#' },
                                ].map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="h-12 w-12 rounded-full border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Right Column */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl border border-border/40 bg-card p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <h2 className="text-2xl font-bold mb-2">Gửi lời nhắn</h2>
                            <p className="text-muted-foreground mb-8 text-sm">Điền vào biểu mẫu bên dưới và chúng tôi sẽ phản hồi bạn trong vòng 24 giờ làm việc.</p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Họ và tên</label>
                                        <input
                                            type="text"
                                            placeholder="Nguyễn Văn A"
                                            className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Địa chỉ Email</label>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Chủ đề</label>
                                    <input
                                        type="text"
                                        placeholder="Bạn muốn hỏi về vấn đề gì?"
                                        className="h-12 w-full rounded-xl border border-border/50 bg-secondary/30 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nội dung tin nhắn</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Nhập chi tiết yêu cầu của bạn tại đây..."
                                        className="w-full rounded-xl border border-border/50 bg-secondary/30 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    Gửi tin nhắn ngay <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ / Simple Map Placeholder Section */}
                <div className="mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-secondary/20 border border-border/40 text-center space-y-4">
                            <div className="h-12 w-12 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl">Giờ làm việc</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Thứ 2 - Thứ 6: 8:00 - 20:00<br />
                                Thứ 7 - CN: 9:00 - 18:00
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-secondary/20 border border-border/40 text-center space-y-4">
                            <div className="h-12 w-12 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl">Chat trực tuyến</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Phản hồi tức thì qua Zalo OA<br />
                                hoặc hỗ trợ trực tuyến trên Web.
                            </p>
                            <button className="text-primary font-bold text-sm hover:underline">Chat ngay &rarr;</button>
                        </div>
                        <div className="p-8 rounded-3xl bg-secondary/20 border border-border/40 text-center space-y-4">
                            <div className="h-12 w-12 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                <Globe className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-bold text-xl">Kết nối cộng đồng</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Tham gia nhóm TechnoHub để<br />
                                cập nhật thủ thuật công nghệ.
                            </p>
                            <button className="text-primary font-bold text-sm hover:underline">Tham gia &rarr;</button>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-24 rounded-3xl overflow-hidden border border-border/40 h-[400px] relative grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
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
