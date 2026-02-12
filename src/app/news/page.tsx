
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

const newsArticles = [
    {
        id: 1,
        title: "Tương lai của Smartphone: Màn hình cuộn và sự trỗi dậy của AI",
        excerpt: "Khám phá cách các ông lớn công nghệ đang tái định nghĩa thiết bị cầm tay với công nghệ màn hình linh hoạt và trí tuệ nhân tạo tích hợp sâu.",
        category: "Công nghệ",
        date: "12 Tháng 2, 2026",
        readTime: "5 phút",
        image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop",
        featured: true
    },
    {
        id: 2,
        title: "Đánh giá chi tiết Laptop Pro 2026: Sức mạnh vượt trội",
        excerpt: "Với chip xử lý thế hệ mới, dòng Laptop Pro năm nay thực sự là một con quái vật về hiệu năng cho những nhà sáng tạo chuyên nghiệp.",
        category: "Đánh giá",
        date: "10 Tháng 2, 2026",
        readTime: "8 phút",
        image: "https://images.unsplash.com/photo-1517336712461-d21f94080922?q=80&w=1000&auto=format&fit=crop",
        featured: false
    },
    {
        id: 3,
        title: "Top 5 phụ kiện không thể thiếu cho góc làm việc Minimalist",
        excerpt: "Một góc làm việc gọn gàng không chỉ giúp tăng năng xuất mà còn mang lại cảm hứng sáng tạo bất tận. Hãy cùng TechnoHeart điểm qua những món đồ này.",
        category: "Đời sống",
        date: "08 Tháng 2, 2026",
        readTime: "4 phút",
        image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop",
        featured: false
    },
    {
        id: 4,
        title: "Chương trình ưu đãi 'Xuân Công Nghệ' tại TechnoHeart",
        excerpt: "Đón Tết rực rỡ với hàng loạt ưu đãi cực khủng dành cho các dòng iPhone và Macbook đời mới nhất.",
        category: "Khuyến mãi",
        date: "05 Tháng 2, 2026",
        readTime: "3 phút",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop",
        featured: false
    },
    {
        id: 5,
        title: "Apple Vision Pro 2: Những gì chúng ta biết cho đến nay",
        excerpt: "Mọi ánh mắt đều đổ dồn về thế hệ kính thực tế tăng cường tiếp theo của Apple với những cải tiến về trọng lượng và thời lượng pin.",
        category: "Công nghệ",
        date: "02 Tháng 2, 2026",
        readTime: "6 phút",
        image: "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?q=80&w=1000&auto=format&fit=crop",
        featured: false
    },
    {
        id: 6,
        title: "Cách bảo quản pin laptop cực hiệu quả",
        excerpt: "Đừng để pin laptop của bạn 'chai' quá nhanh. Hãy áp dụng ngay những mẹo nhỏ nhưng cực kỳ hữu ích này.",
        category: "Mẹo vặt",
        date: "28 Tháng 1, 2026",
        readTime: "4 phút",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop",
        featured: false
    }
];

export default function NewsPage() {
    const featuredPost = newsArticles.find(a => a.featured);
    const regularPosts = newsArticles.filter(a => !a.featured);

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <section className="relative py-20 bg-secondary/20">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Tin tức & Sự kiện</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Cập nhật những xu hướng công nghệ mới nhất, đánh giá sản phẩm chuyên sâu và các chương trình khuyến mãi độc quyền từ TechnoHeart.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 lg:px-8">
                {/* Featured Post */}
                {featuredPost && (
                    <div className="mb-16">
                        <Link href={`/news/${featuredPost.id}`} className="group relative block overflow-hidden rounded-3xl bg-card border border-border/50 shadow-2xl">
                            <div className="grid lg:grid-cols-2 gap-0">
                                <div className="relative aspect-[16/9] lg:aspect-auto h-full overflow-hidden">
                                    <Image
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                                </div>
                                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold text-primary-foreground uppercase tracking-wider">
                                            {featuredPost.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {featuredPost.date}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 group-hover:text-primary transition-colors leading-tight">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 font-bold text-primary group/link">
                                        Đọc tiếp <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Categories Filter */}
                <div className="flex flex-wrap items-center gap-2 mb-12">
                    <span className="text-sm font-bold text-muted-foreground mr-2 uppercase tracking-widest">Lọc theo:</span>
                    {['Tất cả', 'Công nghệ', 'Đánh giá', 'Đời sống', 'Khuyến mãi'].map((cat) => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${cat === 'Tất cả' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/news/${post.id}`}
                            className="group flex flex-col bg-card rounded-2xl border border-border/40 overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-border/50">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold mb-4 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed text-balance">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold text-primary group/btn mt-auto">
                                    Xem chi tiết <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex justify-center">
                    <nav className="flex items-center gap-2">
                        <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-secondary transition-colors">1</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">2</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-secondary transition-colors">3</button>
                        <span className="px-2 text-muted-foreground">...</span>
                        <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-secondary transition-colors">10</button>
                    </nav>
                </div>
            </div>

            {/* Newsletter Section */}
            <section className="bg-primary/5 py-24 mt-20">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="max-w-4xl mx-auto rounded-3xl bg-card border border-border/40 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                        <div className="relative text-center space-y-8">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Tag className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">Đừng bỏ lỡ những tin tức mới nhất</h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                Đăng ký nhận bản tin để nhận được các bài viết đánh giá chuyên sâu và mã giảm giá độc quyền trực tiếp qua email.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
                                <input
                                    type="email"
                                    placeholder="Địa chỉ email của bạn..."
                                    className="flex-1 h-12 rounded-full border border-border/50 bg-secondary/30 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    Đăng ký ngay
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
