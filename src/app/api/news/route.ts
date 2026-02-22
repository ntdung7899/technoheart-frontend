import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/news — list articles
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = admin ? {} : { published: true };

    const [articles, total] = await Promise.all([
        prisma.news.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: { author: { select: { id: true, name: true, email: true } } },
        }),
        prisma.news.count({ where }),
    ]);

    return NextResponse.json({ articles, total, page, limit });
}

// POST /api/news — create article (admin only)
export async function POST(request: Request) {
    try {
        // Verify admin
        const authRes = await fetch(new URL('/api/auth/me', request.url).toString(), {
            headers: { cookie: request.headers.get('cookie') || '' },
        });
        const authData = await authRes.json();
        if (authData.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, excerpt, content, category, image, featured, published, readTime } = body;

        if (!title || !excerpt || !content) {
            return NextResponse.json({ error: 'Thiếu các trường bắt buộc' }, { status: 400 });
        }

        const article = await prisma.news.create({
            data: {
                title,
                excerpt,
                content,
                category: category || 'Công nghệ',
                image: image || null,
                featured: !!featured,
                published: !!published,
                readTime: readTime || '5 phút',
                authorId: authData.user.id,
            },
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
