"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Heart,
  Loader2,
} from "lucide-react";
import { login, getCurrentUser } from "@/lib/api/auth";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login({
                email,
                password,
            });

            const currentUser = await getCurrentUser();

            const role = String(currentUser?.role || "").toUpperCase();

            const roles = Array.isArray(currentUser?.roles)
                ? currentUser.roles.map((item) => String(item).toUpperCase())
                : [];

            const isAdmin =
                role === "ADMIN" ||
                role === "OWNER" ||
                role === "SUPER_ADMIN" ||
                roles.includes("ADMIN") ||
                roles.includes("OWNER") ||
                roles.includes("SUPER_ADMIN");

            if (isAdmin) {
                router.replace("/admin");
            } else {
                router.replace("/account");
            }

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Không thể kết nối đến máy chủ. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-[calc(100vh-4rem)] flex relative overflow-hidden bg-background">
            {/* Left: Visual Panel (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative gradient-hero items-center justify-center p-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative text-center space-y-8 max-w-md animate-fade-in-up">
                    <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl mx-auto animate-float">
                        <Heart className="h-10 w-10 fill-current" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">
                        Techno<span className="text-primary">Heart</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Trải nghiệm công nghệ cao cấp, được tuyển chọn cho những người đòi hỏi sự xuất sắc.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                            100% Chính hãng
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            Bảo hành uy tín
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md animate-fade-in-up">
                    {/* Logo (mobile) */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group lg:hidden">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                                <Heart className="h-6 w-6 fill-current" />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Chào mừng trở lại</h1>
                        <p className="text-muted-foreground">Đăng nhập để trải nghiệm công nghệ cùng Technoheart</p>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-card p-7 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive flex items-center gap-2 animate-fade-in">
                                    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground ml-0.5">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="h-11 w-full rounded-xl border border-border/60 bg-secondary/30 pl-10 pr-4 text-sm placeholder:text-muted-foreground/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-0.5">
                                    <label className="text-xs font-semibold text-muted-foreground">Mật khẩu</label>
                                    <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-lg"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>Đăng nhập <ArrowRight className="h-4 w-4" /></>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="section-divider" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-card px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Hoặc
                                </span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <button className="w-full h-11 rounded-xl border border-border/60 bg-background hover:bg-secondary/60 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                            <Chrome className="h-4 w-4" /> Google
                        </button>
                    </div>

                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        Chưa có tài khoản?{' '}
                        <Link href="/signup" className="text-primary font-semibold hover:underline">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
