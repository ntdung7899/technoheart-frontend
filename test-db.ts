import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

try {
    const prisma = new PrismaClient({ adapter });
    console.log('PrismaClient instantiated successfully');
    prisma.$connect().then(() => {
        console.log('Connected to database');
        prisma.$disconnect();
    }).catch((e) => {
        console.error('Connection failed:', e);
    });
} catch (e) {
    console.error('Instantiation failed:', e);
}
