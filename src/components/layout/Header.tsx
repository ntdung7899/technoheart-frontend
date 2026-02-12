import Link from 'next/link';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tight">TechnoHeart</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/products?category=Phones" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Phones
                        </Link>
                        <Link href="/products?category=Laptops" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Laptops
                        </Link>
                        <Link href="/products?category=Accessories" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Accessories
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-foreground/60 hover:text-foreground transition-colors">
                        <Search className="h-5 w-5" />
                    </button>
                    <Link href="/cart" className="relative text-foreground/60 hover:text-foreground transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            0
                        </span>
                    </Link>
                    <Link href="/login" className="text-foreground/60 hover:text-foreground transition-colors">
                        <User className="h-5 w-5" />
                    </Link>
                    <button className="md:hidden text-foreground/60 hover:text-foreground transition-colors">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
