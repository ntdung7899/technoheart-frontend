
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
        excerpt: "Một góc làm việc gọn gàng không chỉ giúp tăng năng suất mà còn mang lại cảm hứng sáng tạo bất tận.",
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
        excerpt: "Mọi ánh mắt đều đổ dồn về thế hệ kính thực tế tăng cường tiếp theo của Apple với những cải tiến đáng kể.",
        category: "Công nghệ",
        date: "02 Tháng 2, 2026",
        readTime: "6 phút",
        image: "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?q=80&w=1000&auto=format&fit=crop",
        featured: false
    },
    {
        id: 6,
        title: "Cách bảo quản pin laptop cực hiệu quả",
        excerpt: "Đừng để pin laptop của bạn 'chai' quá nhanh. Áp dụng ngay những mẹo nhỏ nhưng cực hữu ích này.",
        category: "Mẹo vặt",
        date: "28 Tháng 1, 2026",
        readTime: "4 phút",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop",
        featured: false
    }
];

export const metadata = {
    title: "Tin tức | TechnoHeart",
    description: "Cập nhật xu hướng công nghệ, đánh giá sản phẩm và khuyến mãi từ TechnoHeart.",
};

export default function NewsPage() {
    const featuredPost = newsArticles.find(a => a.featured);
    const regularPosts = newsArticles.filter(a => !a.featured);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <section className="relative py-16 md:py-20 gradient-hero overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                </div>
                <div className="container mx-auto px-4 lg:px-8 text-center relative">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-fade-in-up">
                        Tin tức & Sự kiện
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Cập nhật xu hướng công nghệ, đánh giá sản phẩm chuyên sâu và khuyến mãi độc quyền từ TechnoHeart.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 lg:px-8">
                {/* Featured Post */}
                {featuredPost && (
                    <div className="mb-14 animate-fade-in-up">
                        <Link href={`/news/${featuredPost.id}`} className="group relative block overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-2xl transition-shadow duration-500">
                            <div className="grid lg:grid-cols-2 gap-0">
                                <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[360px] overflow-hidden">
                                    <Image
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
                                </div>
                                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="bg-primary px-3 py-1 rounded-lg text-xs font-bold text-primary-foreground">
                                            {featuredPost.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> {featuredPost.date}
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

                {/* Categories Filter */}
                <div className="flex flex-wrap items-center gap-2 mb-10">
                    {['Tất cả', 'Công nghệ', 'Đánh giá', 'Đời sống', 'Khuyến mãi'].map((cat) => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === 'Tất cả'
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                    {regularPosts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/news/${post.id}`}
                            className="group flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden card-hover"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-border/50">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold mb-3 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
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

                {/* Newsletter */}
                <section className="mt-20 rounded-2xl gradient-hero border border-border/40 p-8 md:p-12 relative overflow-hidden">
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
