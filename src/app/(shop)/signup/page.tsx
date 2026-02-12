
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Github, Chrome, Heart, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle signup logic
        console.log('Signup attempt:', formData);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                            <Heart className="h-7 w-7 fill-current" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Tạo tài khoản mới</h1>
                    <p className="text-muted-foreground">Bắt đầu hành trình mua sắm cùng TechnoHeart ngay hôm nay</p>
                </div>

                {/* Signup Form Card */}
                <div className="rounded-3xl border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Họ và tên</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nguyễn Văn A"
                                    className="h-11 w-full rounded-2xl border border-border/50 bg-secondary/30 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="h-11 w-full rounded-2xl border border-border/50 bg-secondary/30 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mật khẩu</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="h-11 w-full rounded-2xl border border-border/50 bg-secondary/30 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
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

                        <div className="pt-2">
                            <div className="flex items-start gap-2 mb-6 ml-1">
                                <div className="mt-1">
                                    <CheckCircle2 className="h-3 w-3 text-primary" />
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Tôi đồng ý với các <Link href="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link> và <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>.
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                Tạo tài khoản <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border/40"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] items-center">
                            <span className="bg-card px-4 py-1 rounded-full border border-border/40 text-muted-foreground font-bold uppercase tracking-widest">
                                Hoặc đăng ký với
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="h-11 rounded-2xl border border-border/50 bg-background hover:bg-secondary transition-all flex items-center justify-center gap-2 text-xs font-medium">
                            <Chrome className="h-4 w-4" /> Google
                        </button>
                        <button className="h-11 rounded-2xl border border-border/50 bg-background hover:bg-secondary transition-all flex items-center justify-center gap-2 text-xs font-medium">
                            <Github className="h-4 w-4" /> Github
                        </button>
                    </div>
                </div>

                {/* Footer link */}
                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}
