import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, MapPin, Phone } from 'lucide-react';
import HistatsCounter from '@/components/common/HistatsCounter';

const policyLinks = [
    { name: 'Chính sách bảo mật thông tin', href: '/chinh-sach-bao-mat' },
    { name: 'Chính sách thanh toán', href: '/chinh-sach-thanh-toan' },
    { name: 'Chính sách giao hàng', href: '/chinh-sach-giao-hang' },
    { name: 'Chính sách đổi hàng', href: '/chinh-sach-doi-tra' },
];

export async function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#071020] to-[#04090F] border-t border-th-blue/10">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-14 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                    {/* Brand & Company Info */}
                    <div className="flex flex-col gap-5 lg:col-span-4">
                        <h3 className="text-base font-bold leading-snug text-th-yellow">
                            Công Ty Cổ Phần Tập Đoàn Technoheart G9
                        </h3>
                        <p className="text-sm leading-relaxed text-th-muted">
                            GPDKKD: 0319197544 do Sở Tài Chính TP. Hồ Chí Minh cấp ngày 02/10/2025
                        </p>
                        <div className="flex items-start gap-2 text-base sm:text-md text-th-muted">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-th-blue-lt" />
                            <span>Trụ sở: 410, Tòa nhà SBI-QTSC, P Trung Mỹ Tây, TP. Hồ Chí Minh, Việt Nam</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-th-muted">
                            <Phone className="h-4 w-4 shrink-0 text-th-blue-lt" />
                            <span>
                                Tư Vấn Online:{' '}
                                <Link
                                    href="tel:0867891940"
                                    className="font-semibold text-white transition-colors hover:text-yellow-400"
                                >
                                    0867891940
                                </Link>
                            </span>
                        </div>
                    </div>

                    {/* Policy Links */}
                    <div className="flex flex-col gap-5 lg:col-span-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-th-yellow">
                            Liên Kết
                        </h4>
                        <ul className="space-y-3">
                            {policyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors duration-200 hover:text-white text-th-muted"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Zalo QR */}
                    <div className="flex flex-col gap-5 lg:col-span-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-th-yellow">
                            Cộng Đồng Zalo
                        </h4>
                        <Link href="https://zalo.me/g/technoheartvn" target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/zalo_group.jpg"
                                alt="Nhóm Zalo Technoheart G9"
                                width={180}
                                height={180}
                                className="rounded-xl object-contain shadow-lg border border-th-blue/25"
                                unoptimized
                            />
                        </Link>
                    </div>

                    {/* Social & Stats */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-th-yellow">
                                Kết Nối Với Chúng Tôi
                            </h4>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="https://www.facebook.com/technoheart.vn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 bg-th-blue/10 border border-th-blue/20 text-th-blue-lt"
                                    aria-label="Facebook Technoheart"
                                >
                                    <Facebook className="h-5 w-5" />
                                </Link>
                                <Link
                                    href="https://zalo.me/technoheartvn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 text-xs font-bold bg-th-blue/10 border border-th-blue/20 text-th-blue-lt"
                                    aria-label="Zalo Technoheart"
                                >
                                    ZL
                                </Link>
                                <Link
                                    href="https://www.youtube.com/@technoheart"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 bg-th-blue/10 border border-th-blue/20 text-th-blue-lt"
                                    aria-label="YouTube Technoheart"
                                >
                                    <Youtube className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-th-yellow">
                                Fanpage
                            </h4>
                            <Link
                                href="https://www.facebook.com/technoheart.vn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm transition-colors duration-200 hover:text-white text-th-muted"
                            >
                                facebook.com/technoheart.vn
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-th-yellow">
                                Thống Kê Truy Cập
                            </h4>
                            <HistatsCounter />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="mt-12 pt-8 flex flex-col items-center justify-between gap-3 md:flex-row border-t border-th-blue/10"
                >
                    <p className="text-xs text-center md:text-left text-th-blue-lt">
                        &copy; {new Date().getFullYear()} Công Ty Cổ Phần Tập Đoàn Technoheart G9. Bảo lưu mọi quyền.
                    </p>
                    <p className="text-xs text-th-blue-lt">
                        Thiết kế bởi{' '}
                        <span className="font-semibold text-th-yellow">Technoheart G9</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
