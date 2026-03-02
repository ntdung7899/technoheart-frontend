'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Home, Package, Newspaper, Phone } from 'lucide-react';

const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/products', label: 'Sản phẩm', icon: Package },
    { href: '/news', label: 'Tin tức', icon: Newspaper },
    { href: '/contact', label: 'Liên hệ', icon: Phone },
];

export function MobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Hamburger Button */}
            <button
                className="md:hidden th-icon-btn p-2.5 rounded-xl transition-colors"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? 'Đóng menu' : 'Mở menu'}
            >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 md:hidden flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    background: 'linear-gradient(180deg, #071020 0%, #04090F 100%)',
                    borderLeft: '1px solid rgba(59,130,246,0.15)',
                    boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
                }}
            >
                {/* Drawer Header */}
                <div
                    className="flex items-center justify-between px-5 py-4"
                    style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}
                >
                    <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#FACC15' }}>
                        Menu
                    </span>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-lg transition-colors hover:bg-white/5"
                        aria-label="Đóng menu"
                    >
                        <X className="h-5 w-5" style={{ color: '#93C5FD' }} />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5 group"
                            style={{ color: '#93C5FD' }}
                        >
                            <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-500/20"
                                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                            >
                                <item.icon className="h-4 w-4" style={{ color: '#60A5FA' }} />
                            </div>
                            <span className="flex-1 group-hover:text-white transition-colors">{item.label}</span>
                            <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </nav>

                {/* Footer CTA */}
                <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                    <Link
                        href="/products"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90"
                        style={{
                            background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                            color: '#fff',
                        }}
                    >
                        Xem Sản Phẩm →
                    </Link>
                </div>
            </div>
        </>
    );
}
