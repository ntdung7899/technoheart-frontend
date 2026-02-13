import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Send, Heart, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';

export async function Footer() {
    const categories = await prisma.category.findMany({
        take: 6,
        orderBy: { name: 'asc' }
    });

    return (
        <footer className="border-t border-border/40 bg-card">
            {/* USP Banner */}
            <div className="border-b border-border/40">
                <div className="container mx-auto px-4 py-8 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 justify-center sm:justify-start">
                            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Truck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Giao hàng miễn phí</p>
                                <p className="text-xs text-muted-foreground">Đơn hàng từ 500.000đ</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 justify-center">
                            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Bảo hành chính hãng</p>
                                <p className="text-xs text-muted-foreground">Cam kết 100% chính hãng</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 justify-center sm:justify-end">
                            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Thanh toán an toàn</p>
                                <p className="text-xs text-muted-foreground">Bảo mật SSL 256-bit</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12 md:py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Brand & Newsletter */}
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <div className="space-y-3">
                            <Link href="/" className="flex items-center space-x-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                                    <Heart className="h-5 w-5 fill-current" />
                                </div>
                                <span className="text-xl font-extrabold tracking-tight">
                                    Techno<span className="text-primary">Heart</span>
                                </span>
                            </Link>
                            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                Trải nghiệm thế hệ công nghệ cao cấp tiếp theo. Được tuyển chọn cho những người đòi hỏi sự xuất sắc trong từng chi tiết.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Nhận thông tin khuyến mãi</h4>
                            <div className="relative max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="w-full rounded-xl border border-border/60 bg-secondary/40 py-3 pl-4 pr-12 text-sm placeholder:text-muted-foreground/60"
                                />
                                <button className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-110">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Danh mục</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {categories.map((cat: any) => (
                                    <li key={cat.id}>
                                        <Link href={`/products?category=${cat.id}`} className="transition-colors hover:text-primary">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/products" className="transition-colors hover:text-primary font-medium">
                                        Tất cả sản phẩm
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Hỗ trợ</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {[
                                    { name: 'Liên hệ', href: '/contact' },
                                    { name: 'Hỏi đáp', href: '#' },
                                    { name: 'Giao hàng', href: '#' },
                                    { name: 'Đổi trả', href: '#' },
                                    { name: 'Bảo hành', href: '#' }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="transition-colors hover:text-primary">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Công ty</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {[
                                    { name: 'Về chúng tôi', href: '#' },
                                    { name: 'Tin tức', href: '/news' },
                                    { name: 'Chính sách bảo mật', href: '#' },
                                    { name: 'Điều khoản dịch vụ', href: '#' },
                                    { name: 'Tuyển dụng', href: '#' }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="transition-colors hover:text-primary">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="section-divider mt-12 mb-8" />
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} TechnoHeart. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                            <Link key={idx} href="#" className="h-9 w-9 rounded-lg border border-border/50 flex items-center justify-center text-muted-foreground transition-all hover:text-primary hover:border-primary/30 hover:bg-primary/5">
                                <Icon className="h-4 w-4" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
