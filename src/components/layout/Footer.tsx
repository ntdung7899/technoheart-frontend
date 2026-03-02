import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Youtube, MapPin, Phone } from 'lucide-react';
import HistatsCounter from '@/components/common/HistatsCounter';

const policyLinks = [
    { name: 'Chính sách bảo mật thông tin', href: '/chinh-sach-bao-mat' },
    { name: 'Chính sách thanh toán', href: '/chinh-sach-thanh-toan' },
    { name: 'Chính sách giao hàng', href: '/chinh-sach-giao-hang' },
    { name: 'Chính sách đổi trả hàng', href: '/chinh-sach-doi-tra' },
];

export async function Footer() {
    return (
        <footer
            style={{
                background: 'linear-gradient(180deg, #071020 0%, #04090F 100%)',
                borderTop: '1px solid rgba(59,130,246,0.1)',
            }}
        >
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-14 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                    {/* Brand & Company Info */}
                    <div className="flex flex-col gap-5 lg:col-span-4">
                        {/* Logo */}
                        {/* <Link href="/" className="inline-block transition-opacity hover:opacity-80">
                                <Image
                                    src="/logo-techno-web.png"
                                    alt="Technoheart Logo"
                                    width={180}
                                    height={54}
                                    className="h-12 w-auto object-contain"
                                    priority
                                />
                            </Link> */}

                        {/* Company Name */}
                        <h3 className="text-base font-bold leading-snug" style={{ color: '#FACC15' }}>
                            Công Ty Cổ Phần Tập Đoàn Technoheart G9
                        </h3>

                        {/* Legal Info */}
                        <p className="text-sm leading-relaxed" style={{ color: '#93C5FD' }}>
                            GPDKKD: 0319197544 do Sở Tài Chính TP. Hồ Chí Minh cấp ngày 02/10/2025
                        </p>

                        {/* Address */}
                        <div className="flex items-start gap-2 text-base sm:text-md" style={{ color: '#93C5FD' }}>
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#60A5FA' }} />
                            <span>Trụ sở: 410, Tòa nhà SBI-QTSC, P Trung Mỹ Tây, TP. Hồ Chí Minh, Việt Nam</span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#93C5FD' }}>
                            <Phone className="h-4 w-4 shrink-0" style={{ color: '#60A5FA' }} />
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
                        <h4
                            className="text-sm font-bold uppercase tracking-wider"
                            style={{ color: '#FACC15' }}
                        >
                            Liên Kết
                        </h4>
                        <ul className="space-y-3">
                            {policyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors duration-200 hover:text-white"
                                        style={{ color: '#93C5FD' }}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Zalo QR */}
                    <div className="flex flex-col gap-5 lg:col-span-3">
                        <h4
                            className="text-sm font-bold uppercase tracking-wider"
                            style={{ color: '#FACC15' }}
                        >
                            Cộng Đồng Zalo
                        </h4>
                        <Link href="https://zalo.me/g/technoheartvn" target="_blank" rel="noopener noreferrer">
                            <Image
                                src="/zalo_group.jpg"
                                alt="Nhóm Zalo Technoheart G9"
                                width={180}
                                height={180}
                                className="rounded-xl object-contain shadow-lg"
                                style={{ border: '1.5px solid rgba(59,130,246,0.25)' }}
                                unoptimized
                            />
                        </Link>
                    </div>

                    {/* Social & Stats */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {/* Social Icons */}
                        <div className="space-y-3">
                            <h4
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color: '#FACC15' }}
                            >
                                Kết Nối Với Chúng Tôi
                            </h4>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="https://www.facebook.com/technoheart.vn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    style={{
                                        background: 'rgba(59,130,246,0.1)',
                                        border: '1px solid rgba(59,130,246,0.2)',
                                        color: '#60A5FA',
                                    }}
                                    aria-label="Facebook Technoheart"
                                >
                                    <Facebook className="h-5 w-5" />
                                </Link>

                                {/* Zalo text icon */}
                                <Link
                                    href="https://zalo.me/technoheartvn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 text-xs font-bold"
                                    style={{
                                        background: 'rgba(59,130,246,0.1)',
                                        border: '1px solid rgba(59,130,246,0.2)',
                                        color: '#60A5FA',
                                    }}
                                    aria-label="Zalo Technoheart"
                                >
                                    ZL
                                </Link>

                                <Link
                                    href="https://www.youtube.com/@technoheart"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    style={{
                                        background: 'rgba(59,130,246,0.1)',
                                        border: '1px solid rgba(59,130,246,0.2)',
                                        color: '#60A5FA',
                                    }}
                                    aria-label="YouTube Technoheart"
                                >
                                    <Youtube className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Fanpage */}
                        <div className="space-y-2">
                            <h4
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color: '#FACC15' }}
                            >
                                Fanpage
                            </h4>
                            <Link
                                href="https://www.facebook.com/technoheart.vn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm transition-colors duration-200 hover:text-white"
                                style={{ color: '#93C5FD' }}
                            >
                                facebook.com/technoheart.vn
                            </Link>
                        </div>

                        {/* Histats */}
                        <div className="space-y-2">
                            <h4
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color: '#FACC15' }}
                            >
                                Thống Kê Truy Cập
                            </h4>
                            <HistatsCounter />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="mt-12 pt-8 flex flex-col items-center justify-between gap-3 md:flex-row"
                    style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}
                >
                    <p className="text-xs text-center md:text-left" style={{ color: '#60A5FA' }}>
                        &copy; {new Date().getFullYear()} Công Ty Cổ Phần Tập Đoàn Technoheart G9. Bảo lưu mọi quyền.
                    </p>
                    <p className="text-xs" style={{ color: '#60A5FA' }}>
                        Thiết kế bởi{' '}
                        <span className="font-semibold" style={{ color: '#FACC15' }}>Technoheart G9</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
