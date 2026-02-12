
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Heart } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <Heart className="h-7 w-7 fill-current" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Chào mừng trở lại</h1>
                    <p className="text-muted-foreground">Đăng nhập để trải nghiệm công nghệ cùng TechnoHeart</p>
                </div>

                {/* Login Form Card */}
                <div className="rounded-3xl border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="h-12 w-full rounded-2xl border border-border/50 bg-secondary/30 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mật khẩu</label>
                                <Link href="/forgot-password" size="sm" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 w-full rounded-2xl border border-border/50 bg-secondary/30 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            Đăng nhập <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/40"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] items-center">
                            <span className="bg-card px-4 py-1 rounded-full border border-border/40 text-muted-foreground font-bold uppercase tracking-widest">
                                Hoặc tiếp tục với
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="h-12 rounded-2xl border border-border/50 bg-background hover:bg-secondary transition-all flex items-center justify-center gap-2 text-sm font-medium">
                            <Chrome className="h-4 w-4" /> Google
                        </button>
                        <button className="h-12 rounded-2xl border border-border/50 bg-background hover:bg-secondary transition-all flex items-center justify-center gap-2 text-sm font-medium">
                            <Github className="h-4 w-4" /> Github
                        </button>
                    </div>
                </div>

                {/* Footer link */}
                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Chưa có tài khoản?{' '}
                    <Link href="/signup" className="text-primary font-bold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
