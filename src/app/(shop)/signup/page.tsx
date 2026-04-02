
"use client";

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Github, Chrome, Heart, CheckCircle2, Loader2 } from 'lucide-react';

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get('ref') || '';
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    referralCode: referralCode || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Đã có lỗi xảy ra');
                return;
            }

            setSuccess('Đăng ký thành công! Đang chuyển hướng...');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch {
            setError('Không thể kết nối đến server. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex relative overflow-hidden bg-background">
            {/* Left: Visual Panel (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative gradient-hero items-center justify-center p-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative text-center space-y-8 max-w-md animate-fade-in-up">
                    <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl mx-auto animate-float">
                        <Heart className="h-10 w-10 fill-current" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">
                        Techno<span className="text-primary">Heart</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Tham gia cộng đồng hàng ngàn khách hàng yêu công nghệ. Nhận ưu đãi độc quyền ngay hôm nay.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            2,000+ đánh giá
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            Ưu đãi thành viên
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Signup Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group lg:hidden">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Heart className="h-6 w-6 fill-current" />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Tạo tài khoản mới</h1>
                        <p className="text-muted-foreground">Bắt đầu hành trình mua sắm cùng Technoheart</p>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-card p-7 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {referralCode && (
                                <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary flex items-center gap-2 animate-fade-in">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    Bạn được giới thiệu bởi mã: <strong>{referralCode}</strong>
                                </div>
                            )}
                            {error && (
                                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2 animate-fade-in">
                                    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600 flex items-center gap-2 animate-fade-in">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    {success}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground ml-0.5">Họ và tên</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nguyễn Văn A"
                                        className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground ml-0.5">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground ml-0.5">Mật khẩu</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-10 pr-12 text-sm placeholder:text-muted-foreground/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground ml-0.5">Xác nhận mật khẩu</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>

                            <div className="pt-1">
                                <div className="flex items-start gap-2 mb-5 ml-0.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                                    <p className="text-xs text-muted-foreground">
                                        Tôi đồng ý với <Link href="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-lg"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</>
                                    ) : (
                                        <>Tạo tài khoản <ArrowRight className="h-4 w-4" /></>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="relative my-6">
                            <div className="section-divider" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-card px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Hoặc
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="h-11 rounded-xl border border-border/60 bg-background hover:bg-secondary/60 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                                <Chrome className="h-4 w-4" /> Google
                            </button>
                            {/* <button className="h-11 rounded-xl border border-border/60 bg-background hover:bg-secondary/60 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                                <Github className="h-4 w-4" /> Github
                            </button> */}
                        </div>
                    </div>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <SignupContent />
        </Suspense>
    );
}
