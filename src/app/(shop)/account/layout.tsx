import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
                <AccountSidebar />
                <main className="flex-1 min-w-0 pb-20 lg:pb-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
