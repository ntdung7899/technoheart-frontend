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
                                Experience the next generation of premium electronics. Crafted for those who demand excellence in every detail.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider">Stay Updated</h4>
                            <div className="relative max-w-sm">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
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
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {['Phones', 'Laptops', 'Accessories', 'New Arrivals'].map((link) => (
                                    <li key={link}><Link href={`/products?category=${link}`} className="transition-colors hover:text-primary">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Service</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Warranty'].map((link) => (
                                    <li key={link}><Link href="#" className="transition-colors hover:text-primary">{link}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
                            <ul className="space-y-2.5 text-sm text-muted-foreground">
                                {['About Us', 'Privacy Policy', 'Terms of Service', 'Career'].map((link) => (
                                    <li key={link}><Link href="#" className="transition-colors hover:text-primary">{link}</Link></li>
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
