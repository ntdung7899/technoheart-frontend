import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = 'quynhquang400@gmail.com';

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            affiliate: true,
            referralsMade: {
                include: {
                    referee: {
                        include: {
                            orders: { take: 5, orderBy: { createdAt: 'desc' } },
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        console.error(`User ${email} not found`);
        process.exit(1);
    }

    if (!user.affiliate) {
        console.error(`User ${email} has no affiliate profile`);
        process.exit(1);
    }

    const affiliateId = user.affiliate.id;
    console.log(`User: ${user.name} (${user.id})`);
    console.log(`Affiliate: ${affiliateId}, Rank: ${user.affiliate.rank}`);
    console.log(`Referrals: ${user.referralsMade.length}`);

    // Get some existing orders to link commissions to, or create fake ones
    // First, try to get orders from referred users
    const refereeIds = user.referralsMade.map(r => r.refereeId);
    let orders = await prisma.order.findMany({
        where: { userId: { in: refereeIds } },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });

    // If not enough orders, get any delivered/completed orders
    if (orders.length < 20) {
        const moreOrders = await prisma.order.findMany({
            where: { userId: { not: user.id } },
            orderBy: { createdAt: 'desc' },
            take: 20 - orders.length,
        });
        orders = [...orders, ...moreOrders];
    }

    // If still not enough orders, create some dummy orders
    if (orders.length < 20) {
        // Need an address and products  
        let address = await prisma.address.findFirst({ where: { userId: user.id } });
        if (!address) {
            address = await prisma.address.create({
                data: {
                    userId: user.id,
                    street: '123 Nguyen Hue',
                    city: 'Ho Chi Minh',
                    state: 'Ho Chi Minh',
                    zip: '700000',
                    country: 'Vietnam',
                    isDefault: true,
                },
            });
        }

        const products = await prisma.product.findMany({ take: 5 });

        // Create dummy buyer users if no referees
        let buyerIds = refereeIds;
        if (buyerIds.length === 0) {
            // Create a few test buyer users
            for (let i = 0; i < 3; i++) {
                const buyer = await prisma.user.upsert({
                    where: { email: `testbuyer${i + 1}@test.com` },
                    update: {},
                    create: {
                        email: `testbuyer${i + 1}@test.com`,
                        password: '$2b$10$placeholder', 
                        name: `Test Buyer ${i + 1}`,
                    },
                });
                buyerIds.push(buyer.id);
            }
        }

        // Create enough orders
        const needed = 20 - orders.length;
        for (let i = 0; i < needed; i++) {
            const buyerId = buyerIds[i % buyerIds.length];
            let buyerAddr = await prisma.address.findFirst({ where: { userId: buyerId } });
            if (!buyerAddr) {
                buyerAddr = await prisma.address.create({
                    data: {
                        userId: buyerId,
                        street: '456 Le Loi',
                        city: 'Ho Chi Minh',
                        state: 'Ho Chi Minh',
                        zip: '700000',
                        country: 'Vietnam',
                        isDefault: true,
                    },
                });
            }

            const product = products[i % products.length];
            const total = Number(product.price) * (1 + Math.floor(Math.random() * 3));
            const order = await prisma.order.create({
                data: {
                    userId: buyerId,
                    addressId: buyerAddr.id,
                    total,
                    status: 'DELIVERED',
                    items: {
                        create: {
                            productId: product.id,
                            quantity: 1 + Math.floor(Math.random() * 3),
                            price: product.price,
                        },
                    },
                },
            });
            orders.push(order);
        }
    }

    // Delete existing test commissions for this affiliate
    await prisma.commission.deleteMany({
        where: { affiliateId },
    });

    // Create 20 commission records
    const statuses = ['PENDING', 'APPROVED', 'PAID', 'CANCELLED'] as const;
    const commissionData = [];

    for (let i = 0; i < 20; i++) {
        const order = orders[i % orders.length];
        const orderTotal = Number(order.total);
        const level = i < 14 ? 1 : 2; // 14 F1 commissions, 6 F2
        const rate = level === 1
            ? [0.05, 0.08, 0.10][Math.floor(Math.random() * 3)]
            : [0.03, 0.035][Math.floor(Math.random() * 2)];
        const amount = Math.round(orderTotal * rate);

        // Weighted status: mostly PAID and APPROVED
        let status: typeof statuses[number];
        if (i < 8) status = 'PAID';
        else if (i < 14) status = 'APPROVED';
        else if (i < 18) status = 'PENDING';
        else status = 'CANCELLED';

        const type = (i < 17 ? 'REFERRAL' : 'ACHIEVEMENT') as 'REFERRAL' | 'ACHIEVEMENT';

        // Spread dates over the last 3 months
        const daysAgo = Math.floor(Math.random() * 90);
        const createdAt = new Date(Date.now() - daysAgo * 86400000);

        commissionData.push({
            affiliateId,
            orderId: order.id,
            amount,
            rate,
            level,
            type,
            status,
            createdAt,
        });
    }

    const result = await prisma.commission.createMany({
        data: commissionData,
    });

    console.log(`\n✅ Created ${result.count} commission records for ${email}`);

    // Show summary
    const summary = {
        PAID: commissionData.filter(c => c.status === 'PAID').length,
        APPROVED: commissionData.filter(c => c.status === 'APPROVED').length,
        PENDING: commissionData.filter(c => c.status === 'PENDING').length,
        CANCELLED: commissionData.filter(c => c.status === 'CANCELLED').length,
        F1: commissionData.filter(c => c.level === 1).length,
        F2: commissionData.filter(c => c.level === 2).length,
        totalAmount: commissionData.reduce((s, c) => s + c.amount, 0),
    };
    console.log('Summary:', summary);
}

main()
    .catch(console.error)
    .finally(() => {
        pool.end();
        process.exit(0);
    });
