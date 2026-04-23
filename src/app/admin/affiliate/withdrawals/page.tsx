import prisma from "@/lib/prisma";
import WithdrawalsClient from "../_components/WithdrawalsClient";

export const dynamic = 'force-dynamic';

export default async function AdminWithdrawalsPage() {
    const requests = await prisma.withdrawalRequest.findMany({
        include: {
            affiliate: {
                include: { user: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const serialized = requests.map(r => ({
        id: r.id,
        amount: Number(r.amount),
        bankName: r.bankName,
        accountNumber: r.accountNumber,
        accountName: r.accountName,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        user: {
            name: r.affiliate.user.name,
            email: r.affiliate.user.email,
            referralCode: r.affiliate.referralCode
        }
    }));

    return <WithdrawalsClient initialData={serialized} />;
}