import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/news/[id]
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const article = await prisma.news.findUnique({
        where: { id },
        include: { author: { select: { id: true, name: true, email: true } } },
    });
    if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(article);
}

// PATCH /api/news/[id]
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authRes = await fetch(new URL('/api/auth/me', request.url).toString(), {
            headers: { cookie: request.headers.get('cookie') || '' },
        });
        const authData = await authRes.json();
        if (authData.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, excerpt, content, category, image, featured, published, readTime } = body;

        const article = await prisma.news.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(excerpt !== undefined && { excerpt }),
                ...(content !== undefined && { content }),
                ...(category !== undefined && { category }),
                ...(image !== undefined && { image }),
                ...(featured !== undefined && { featured }),
                ...(published !== undefined && { published }),
                ...(readTime !== undefined && { readTime }),
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/news/[id]
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authRes = await fetch(new URL('/api/auth/me', request.url).toString(), {
            headers: { cookie: request.headers.get('cookie') || '' },
        });
        const authData = await authRes.json();
        if (authData.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.news.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
