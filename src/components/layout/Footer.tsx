import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="text-lg font-bold">TechnoHeart</Link>
                        <p className="text-sm text-muted-foreground">
                            Premium electronics for the modern lifestyle.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Shop</h3>
                        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <li><Link href="/products?category=Phones" className="hover:text-foreground">Phones</Link></li>
                            <li><Link href="/products?category=Laptops" className="hover:text-foreground">Laptops</Link></li>
                            <li><Link href="/products?category=Accessories" className="hover:text-foreground">Accessories</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Support</h3>
                        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-foreground">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-foreground">FAQs</Link></li>
                            <li><Link href="/shipping" className="hover:text-foreground">Shipping</Link></li>
                            <li><Link href="/returns" className="hover:text-foreground">Returns</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} TechnoHeart. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
