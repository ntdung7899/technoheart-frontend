import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Create Categories
    const phoneCategory = await prisma.category.upsert({
        where: { name: 'Phones' },
        update: {},
        create: {
            name: 'Phones',
            image: 'https://ik.imagekit.io/demo/img/phone.jpg',
        },
    });

    const laptopCategory = await prisma.category.upsert({
        where: { name: 'Laptops' },
        update: {},
        create: {
            name: 'Laptops',
            image: 'https://ik.imagekit.io/demo/img/laptop.jpg',
        },
    });

    const accessoriesCategory = await prisma.category.upsert({
        where: { name: 'Accessories' },
        update: {},
        create: {
            name: 'Accessories',
            image: 'https://ik.imagekit.io/demo/img/headphones.jpg',
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
                images: ['https://ik.imagekit.io/demo/img/iphone15.jpg'],
            },
            {
                name: 'MacBook Pro 14"',
                description: 'M3 Pro chip, 18GB Unified Memory, 512GB SSD.',
                price: 1999,
                stock: 30,
                categoryId: laptopCategory.id,
                images: ['https://ik.imagekit.io/demo/img/macbook.jpg'],
            },
            {
                name: 'AirPods Max',
                description: 'High-fidelity audio, Active Noise Cancellation.',
                price: 549,
                stock: 100,
                categoryId: accessoriesCategory.id,
                images: ['https://ik.imagekit.io/demo/img/airpodsutil.jpg'],
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Galaxy AI is here. Welcome to the era of mobile AI.',
                price: 1299,
                stock: 45,
                categoryId: phoneCategory.id,
                images: ['https://ik.imagekit.io/demo/img/s24.jpg'],
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
