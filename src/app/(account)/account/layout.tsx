import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AccountHeader } from "@/components/account/AccountHeader";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <AccountSidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-slate-50">
                <AccountHeader />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
