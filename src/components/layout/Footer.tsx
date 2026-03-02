import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Send, Code2 } from 'lucide-react';

const footerLinks = {
    services: [
        { name: 'Custom Software', href: '#services' },
        { name: 'Cloud & DevOps', href: '#services' },
        { name: 'Cybersecurity', href: '#services' },
        { name: 'AI & Machine Learning', href: '#services' },
        { name: 'Digital Transformation', href: '#services' },
    ],
    company: [
        { name: 'About Us', href: '#about' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Careers', href: '#' },
        { name: 'Blog', href: '#' },
    ],
    contact: [
        { name: 'hello@technoheart.vn', href: 'mailto:hello@technoheart.vn' },
        { name: '+84 123 456 789', href: 'tel:+84123456789' },
        { name: 'Ho Chi Minh City, Vietnam', href: '#' },
    ],
};

export async function Footer() {
    return (
        <footer
            style={{
                background: 'linear-gradient(180deg, #071020 0%, #04090F 100%)',
                borderTop: '1px solid rgba(59,130,246,0.1)',
            }}
        >
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Brand Area */}
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-md"
                                style={{
                                    background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                                    boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
                                }}
                            >
                                <Code2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white">
                                Techno<span style={{ color: '#FACC15' }}>Heart</span>
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#93C5FD' }}>
                            A premium IT solutions and software development company helping businesses
                            build, scale, and lead with technology.
                        </p>

                        {/* Newsletter */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white">Stay Updated</h4>
                            <div className="relative max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl py-3 pl-4 pr-12 text-sm"
                                    style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1.5px solid rgba(59,130,246,0.25)',
                                        color: '#FFFFFF',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg transition-transform hover:scale-110"
                                    style={{
                                        background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                                    }}
                                >
                                    <Send className="h-4 w-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
                        <div className="space-y-4">
                            <h4
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color: '#FACC15' }}
                            >
                                Services
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.services.map((link) => (
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

                        <div className="space-y-4">
                            <h4
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color: '#FACC15' }}
                            >
                                Company
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.company.map((link) => (
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

                        <div className="space-y-4">
                            <h4
                                className="text-sm font-bold uppercase tracking-wider"
                                style={{ color: '#FACC15' }}
                            >
                                Contact
                            </h4>
                            <ul className="space-y-2.5">
                                {footerLinks.contact.map((link) => (
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
                    </div>
                </div>

                {/* Bottom Bar */}
                <div
                    className="mt-12 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row"
                    style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}
                >
                    <p className="text-xs" style={{ color: '#60A5FA' }}>
                        &copy; {new Date().getFullYear()} TechnoHeart. All rights reserved.
                    </p>
                    <div className="flex items-center gap-3">
                        {[
                            { Icon: Facebook, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Linkedin, href: '#' },
                            { Icon: Instagram, href: '#' },
                        ].map(({ Icon, href }, idx) => (
                            <Link
                                key={idx}
                                href={href}
                                className="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                style={{
                                    background: 'rgba(59,130,246,0.1)',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                    color: '#60A5FA',
                                }}
                            >
                                <Icon className="h-4 w-4" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
