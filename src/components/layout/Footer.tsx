import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Send, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-card">
            <div className="container mx-auto px-4 py-12 md:py-20 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Brand & Newsletter */}
                    <div className="flex flex-col gap-8 lg:col-span-4">
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Heart className="h-5 w-5 fill-current" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">TechnoHeart</span>
                            </Link>
                            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                                Trải nghiệm thế hệ đồ điện tử cao cấp tiếp theo. Được chế tác cho những người đòi hỏi sự xuất sắc trong từng chi tiết.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider">Cập nhật tin tức</h4>
                            <div className="relative max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="w-full rounded-full border border-border/50 bg-secondary/30 py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Khám phá</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {[
                                    { name: 'Điện thoại', id: 'Phones' },
                                    { name: 'Laptop', id: 'Laptops' },
                                    { name: 'Phụ kiện', id: 'Accessories' },
                                    { name: 'Sản phẩm mới', id: 'New' }
                                ].map((item) => (
                                    <li key={item.id}><Link href={`/products?category=${item.id}`} className="transition-colors hover:text-primary">{item.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Dịch vụ</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {[
                                    { name: 'Liên hệ', href: '#' },
                                    { name: 'Hỏi đáp', href: '#' },
                                    { name: 'Giao hàng', href: '#' },
                                    { name: 'Đổi trả', href: '#' },
                                    { name: 'Bảo hành', href: '#' }
                                ].map((link) => (
                                    <li key={link.name}><Link href={link.href} className="transition-colors hover:text-primary">{link.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Công ty</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {[
                                    { name: 'Về chúng tôi', href: '#' },
                                    { name: 'Chính sách bảo mật', href: '#' },
                                    { name: 'Điều khoản dịch vụ', href: '#' },
                                    { name: 'Tuyển dụng', href: '#' }
                                ].map((link) => (
                                    <li key={link.name}><Link href={link.href} className="transition-colors hover:text-primary">{link.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} TechnoHeart Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                            <Link key={idx} href="#" className="text-muted-foreground transition-colors hover:text-primary">
                                <Icon className="h-5 w-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
