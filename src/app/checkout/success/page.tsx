
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
            <h1 className="text-3xl font-bold tracking-tight mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Thank you for your purchase. We have received your order and will begin processing it shortly.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/products"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
