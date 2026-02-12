import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, Heart } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="group flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            TechnoHeart
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {['Phones', 'Laptops', 'Accessories'].map((item) => (
                            <Link
                                key={item}
                                href={`/products?category=${item}`}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-secondary/50 rounded-full"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center relative mr-2">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="h-9 w-40 lg:w-64 rounded-full border border-border/50 bg-secondary/30 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button className="sm:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                            <Search className="h-5 w-5" />
                        </button>

                        <Link href="/cart" className="group relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                                0
                            </span>
                        </Link>

                        <Link href="/login" className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                            <User className="h-5 w-5" />
                        </Link>

                        <button className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
