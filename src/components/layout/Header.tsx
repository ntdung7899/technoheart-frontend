import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, Heart } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/20">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            TechnoHeart
                        </span>
                    </Link>
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex items-center bg-secondary/30 backdrop-blur-md px-1 py-1 rounded-full border border-border/40">
                    <div className="group relative">
                        <Link
                            href="/products"
                            className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground hover:bg-background/80 rounded-full flex items-center gap-1.5"
                        >
                            Sản phẩm
                        </Link>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block pt-3 w-64 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="rounded-2xl border border-border/50 bg-background/95 backdrop-blur-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                                {[
                                    { name: 'Thực phẩm bảo vệ sức khoẻ', id: 'health' },
                                    { name: 'Chăm sóc cá nhân', id: 'personal-care' },
                                    { name: 'Thiết bị điện tử', id: 'electronics' }
                                ].map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={`/products?category=${sub.id}`}
                                        className="block px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-secondary/50 rounded-xl"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    {[
                        { name: 'Tin tức', id: 'news' },
                        { name: 'Liên hệ', id: 'contact' }
                    ].map((item) => (
                        <Link
                            key={item.id}
                            href={`/${item.id}`}
                            className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground hover:bg-background/80 rounded-full"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 sm:gap-4 flex-shrink-0">
                    <div className="hidden lg:flex items-center relative group">
                        <Search className="absolute left-3.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="h-10 w-48 rounded-full border border-border/40 bg-secondary/30 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:w-64 transition-all duration-300"
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                            <Search className="h-5 w-5" />
                        </button>

                        <Link href="/cart" className="group relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground shadow-lg group-hover:scale-110 transition-transform ring-2 ring-background">
                                0
                            </span>
                        </Link>

                        <Link href="/login" className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                            <User className="h-5 w-5" />
                        </Link>

                        <button className="md:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
