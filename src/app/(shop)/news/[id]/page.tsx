
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const article = await prisma.news.findUnique({
        where: { id },
        include: { author: { select: { name: true, email: true } } },
    });

    if (!article || !article.published) notFound();

    // Related articles (same category, exclude current)
    const related = await prisma.news.findMany({
        where: { published: true, category: article.category, id: { not: article.id } },
        take: 2,
        orderBy: { createdAt: 'desc' },
    });

    const formatDate = (date: Date) =>
        new Date(date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 lg:px-8 max-w-4xl">
                {/* Back Button */}
                <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Quay lại Tin tức
                </Link>

                {/* Article Header */}
                <div className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {article.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-y border-border/40 py-4 font-medium">
                        <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {article.author.name || article.author.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(article.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                        </span>
                    </div>
                </div>

                {/* Feature Image */}
                {article.image && (
                    <div className="relative aspect-[16/9] mb-12 rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Share button */}
                    <div className="lg:w-16 flex lg:flex-col items-center gap-4 py-4">
                        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <article className="flex-1 prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-3xl">
                        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
                    </article>
                </div>

                {/* Related articles */}
                <div className="mt-20 pt-10 border-t border-border/40">
                    <h4 className="text-xl font-bold mb-8">Có thể bạn quan tâm</h4>
                    {related.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {related.map(r => (
                                <Link key={r.id} href={`/news/${r.id}`} className="p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:bg-secondary/30 hover:border-primary/30 transition-all group">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">{r.category}</span>
                                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                                    <span className="text-xs font-bold text-muted-foreground">Xem thêm →</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40 text-center">
                            <Tag className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                            <p className="text-sm text-muted-foreground">Chưa có bài viết liên quan.</p>
                            <Link href="/news" className="text-xs font-bold text-primary mt-2 block">Xem tất cả tin tức →</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
