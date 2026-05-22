import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { getNews } from "@/lib/api/news";

export const metadata = {
    title: "Tin tức | Technoheart",
    description: "Cập nhật xu hướng công nghệ, đánh giá sản phẩm và khuyến mãi từ Technoheart.",
};

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
    const articles = await getNews();

    const featuredPost = articles.find(a => a.featured) || articles[0];
    const regularPosts = articles.filter(a => a.id !== featuredPost?.id);

    const formatDate = (date?: string | Date) => {
        if (!date) return "Đang cập nhật";

        return new Date(date).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const hasValidImage = (imageUrl?: string) => {
        return Boolean(imageUrl && imageUrl !== "/placeholder.png");
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-16 md:py-20 gradient-hero overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 lg:px-8 text-center relative">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up">
                        Tin tức &amp; Sự kiện
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Cập nhật xu hướng công nghệ, đánh giá sản phẩm chuyên sâu và khuyến mãi độc quyền từ Technoheart.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 lg:px-8">
                {articles.length === 0 ? (
                    <div className="text-center py-24 text-muted-foreground">
                        <Tag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-semibold">Chưa có bài viết nào được xuất bản.</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featuredPost && (
                            <div className="mb-14 animate-fade-in-up">
                                <Link href={`/news/${featuredPost.id}`} className="group relative block overflow-hidden rounded-xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-500">
                                    <div className="grid lg:grid-cols-2 gap-0">
                                        <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-secondary/20">
                                            {hasValidImage(featuredPost.imageUrl) ? (
                                                <Image
                                                    src={featuredPost.imageUrl}
                                                    alt={featuredPost.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Tag className="h-16 w-16 text-muted-foreground/20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                                        </div>
                                        <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-5">
                                                <span className="bg-primary px-3 py-1 rounded-lg text-xs font-semibold text-primary-foreground">
                                                    {featuredPost.category || "Tin tức"}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" /> {formatDate(featuredPost.createdAt)}
                                                </span>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 font-semibold text-primary text-sm">
                                                Đọc tiếp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Grid Posts */}
                        {regularPosts.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                                {regularPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/news/${post.id}`}
                                        className="group flex flex-col bg-card rounded-xl border border-border/50 overflow-hidden card-hover"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-secondary/20">
                                            {hasValidImage(post.imageUrl) ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Tag className="h-10 w-10 text-muted-foreground/20" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border border-border/50">
                                                    {post.category || "Tin tức"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" /> {formatDate(post.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" /> {post.readTime || "5 phút đọc"}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                                Xem chi tiết <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Newsletter */}
                <section className="mt-20 rounded-xl gradient-hero border border-border/40 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
                    </div>
                    <div className="relative text-center space-y-6 max-w-xl mx-auto">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Tag className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Đừng bỏ lỡ tin tức mới nhất</h2>
                        <p className="text-muted-foreground">
                            Đăng ký nhận bản tin để nhận bài viết đánh giá và mã giảm giá độc quyền.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                            <input
                                type="email"
                                placeholder="Địa chỉ email của bạn..."
                                className="flex-1 h-11 rounded-xl border border-border/60 bg-background px-5 text-sm placeholder:text-muted-foreground/60"
                            />
                            <button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all">
                                Đăng ký
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}