
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from 'lucide-react';

const newsArticles = [
    {
        id: 1,
        title: "Tương lai của Smartphone: Màn hình cuộn và sự trỗi dậy của AI",
        content: `
            <p>Trí tuệ nhân tạo (AI) đang dần trở thành trái tim của mọi thiết bị công nghệ, đặc biệt là smartphone. Không còn chỉ là những trợ lý ảo đơn thuần, AI thế hệ mới tích hợp sâu vào hệ điều hành, giúp tối ưu hóa hiệu năng, xử lý hình ảnh chuyên nghiệp và thậm chí là dự đoán thói quen người dùng.</p>
            <p>Bên cạnh đó, công nghệ màn hình cũng đang bước sang một trang mới. Sau màn hình gập, màn hình cuộn (rollable) đang được LG, Samsung và nhiều hãng khác trình làng bản thử nghiệm. Màn hình cuộn giải quyết được vấn đề độ dày của máy, cho phép người dùng mở rộng không gian hiển thị một cách linh hoạt mà vẫn giữ được sự mỏng nhẹ.</p>
            <h3>Sự kết hợp hoàn hảo giữa Phần cứng và Phần mềm</h3>
            <p>Khi màn hình cuộn kết hợp cùng AI, chúng ta sẽ có những giao diện người dùng tự động thay đổi dựa trên kích thước màn hình và tác vụ đang thực hiện. Hãy tưởng tượng bạn đang xem video ở dạng thu nhỏ, nhưng khi máy cuộn ra, AI sẽ tự động điều chỉnh độ phân giải và bố cục để tối ưu cho trải nghiệm xem phim.</p>
        `,
        category: "Công nghệ",
        date: "12 Tháng 2, 2026",
        author: "Minh Quân",
        readTime: "5 phút",
        image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop"
    }
    // Add other articles if needed for consistency
];

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = newsArticles.find(a => a.id === parseInt(id)) || newsArticles[0];

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
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground border-y border-border/40 py-4 font-medium">
                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {article.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {article.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.readTime}</span>
                    </div>
                </div>

                {/* Feature Image */}
                <div className="relative aspect-[16/9] mb-12 rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Floating Social Icons */}
                    <div className="lg:w-16 flex lg:flex-col items-center gap-4 py-4">
                        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <article className="flex-1 prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-img:rounded-3xl">
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>
                </div>

                {/* Footer Navigation */}
                <div className="mt-20 pt-10 border-t border-border/40">
                    <h4 className="text-xl font-bold mb-8">Có thể bạn quan tâm</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Placeholder for related news */}
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:bg-secondary/30 transition-colors">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">Cùng chuyên mục</span>
                            <h3 className="font-bold mb-2">Đánh giá chi tiết Laptop Pro 2026: Sức mạnh vượt trội</h3>
                            <Link href="/news" className="text-xs font-bold text-muted-foreground hover:text-primary">Xem thêm &rarr;</Link>
                        </div>
                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:bg-secondary/30 transition-colors">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">XU HƯỚNG</span>
                            <h3 className="font-bold mb-2">Apple Vision Pro 2: Những gì chúng ta biết cho đến nay</h3>
                            <Link href="/news" className="text-xs font-bold text-muted-foreground hover:text-primary">Xem thêm &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
