import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Clear existing products to avoid duplicates and broken links
    await prisma.orderItem.deleteMany({}); // Delete order items first due to FK
    await prisma.order.deleteMany({});     // Delete orders
    await prisma.product.deleteMany({});   // Delete products

    // Create Categories
    const phoneCategory = await prisma.category.upsert({
        where: { name: 'Phones' },
        update: { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' },
        create: {
            name: 'Phones',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
        },
    });

    const laptopCategory = await prisma.category.upsert({
        where: { name: 'Laptops' },
        update: { image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop' },
        create: {
            name: 'Laptops',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
        },
    });

    const accessoriesCategory = await prisma.category.upsert({
        where: { name: 'Accessories' },
        update: { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
        create: {
            name: 'Accessories',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
        },
    });

    // Create Products
    await prisma.product.createMany({
        data: [
            {
                name: 'iPhone 15 Pro',
                description: 'Titanium design, A17 Pro chip, 48MP Main camera.',
                price: 999,
                stock: 50,
                categoryId: phoneCategory.id,
                images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop'],
                warranty: 'Bảo hành 12 tháng chính hãng',
                shippingInfo: 'Giao hàng nhanh 1-2 ngày',
                returnPolicy: 'Hỗ trợ đổi trong 7 ngày',
                origin: 'Apple VN',
            },
            {
                name: 'MacBook Pro 14"',
                description: 'M3 Pro chip, 18GB Unified Memory, 512GB SSD.',
                price: 1999,
                stock: 30,
                categoryId: laptopCategory.id,
                images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800&auto=format&fit=crop'],
                warranty: 'Bảo hành 12 tháng chính hãng',
                shippingInfo: 'Giao hàng nhanh 1-2 ngày',
                returnPolicy: 'Hỗ trợ đổi trong 7 ngày',
                origin: 'Apple VN',
            },
            {
                name: 'AirPods Max',
                description: 'High-fidelity audio, Active Noise Cancellation.',
                price: 549,
                stock: 100,
                categoryId: accessoriesCategory.id,
                images: ['https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=800&auto=format&fit=crop'],
                warranty: 'Bảo hành 12 tháng chính hãng',
                shippingInfo: 'Giao hàng nhanh 1-2 ngày',
                returnPolicy: 'Hỗ trợ đổi trong 7 ngày',
                origin: 'Apple VN',
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Galaxy AI is here. Welcome to the era of mobile AI.',
                price: 1299,
                stock: 45,
                categoryId: phoneCategory.id,
                images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'],
                warranty: 'Bảo hành 12 tháng chính hãng',
                shippingInfo: 'Giao hàng nhanh 2-3 ngày',
                returnPolicy: 'Hỗ trợ đổi trong 7 ngày',
                origin: 'Samsung Việt Nam',
            },
        ],
    });

    console.log('Seed data inserted');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
