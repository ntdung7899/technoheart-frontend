"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SearchResult {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: { name: string };
}

interface SearchModalProps {
    variant?: "compact" | "icon" | "hero";
}

export function SearchModal({ variant = "compact" }: SearchModalProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showMobileInput, setShowMobileInput] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const searchProducts = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/products/search?q=${encodeURIComponent(q.trim())}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setResults(data);
                setIsOpen(true);
            }
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleInputChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchProducts(value), 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            setShowMobileInput(false);
            router.push(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleSelect = (id: string) => {
        setIsOpen(false);
        setQuery("");
        setShowMobileInput(false);
        router.push(`/products/${id}`);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                if (variant === "icon") setShowMobileInput(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [variant]);

    // Focus input when mobile search opens
    useEffect(() => {
        if (showMobileInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showMobileInput]);

    // ===== ICON VARIANT (mobile) =====
    if (variant === "icon") {
        return (
            <div ref={containerRef} className="relative">
                {!showMobileInput ? (
                    <button
                        onClick={() => setShowMobileInput(true)}
                        className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xl transition-colors"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                ) : (
                    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl animate-fade-in">
                        <div className="container mx-auto px-4 pt-4">
                            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder="Tìm kiếm sản phẩm..."
                                        className="h-12 w-full rounded-2xl border border-border/60 bg-secondary/40 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setShowMobileInput(false); setIsOpen(false); setQuery(""); }}
                                    className="p-2.5 text-muted-foreground hover:text-foreground rounded-xl transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </form>

                            {/* Mobile Results */}
                            <div className="mt-4 max-h-[70vh] overflow-y-auto">
                                {isLoading && (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                )}
                                {!isLoading && isOpen && results.length === 0 && query.trim() && (
                                    <div className="text-center py-12">
                                        <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium">Không tìm thấy sản phẩm</p>
                                        <p className="text-sm text-muted-foreground/60 mt-1">Thử từ khóa khác</p>
                                    </div>
                                )}
                                {!isLoading && results.length > 0 && (
                                    <div className="space-y-2">
                                        {results.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleSelect(product.id)}
                                                className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-secondary/60 transition-all text-left"
                                            >
                                                <div className="relative h-14 w-14 rounded-xl bg-secondary/40 overflow-hidden flex-shrink-0">
                                                    {product.images.length > 0 ? (
                                                        <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1.5" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full"><ShoppingBag className="h-5 w-5 text-muted-foreground/30" /></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{product.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-muted-foreground">{product.category.name}</span>
                                                        <span className="text-xs text-muted-foreground/30">·</span>
                                                        <span className="text-sm font-bold text-primary">{formatPrice(Number(product.price))}</span>
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleSubmit as any}
                                            className="w-full py-3 text-center text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors"
                                        >
                                            Xem tất cả kết quả →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ===== HERO VARIANT =====
    if (variant === "hero") {
        return (
            <div ref={containerRef} className="relative w-full max-w-xl">
                {/* <form onSubmit={handleSubmit} className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 z-10" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                        placeholder="Tìm kiếm sản phẩm... (iPhone, MacBook, ...)"
                        className="h-14 w-full rounded-2xl border border-border/60 bg-background/80 backdrop-blur-lg pl-14 pr-32 text-base shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <Search className="h-4 w-4" />
                        Tìm kiếm
                    </button>
                </form> */}

                {/* Dropdown Results */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border/60 bg-background/98 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                <span className="ml-2 text-sm text-muted-foreground">Đang tìm kiếm...</span>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-center py-8">
                                <Search className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground font-medium">Không tìm thấy sản phẩm nào</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-4 py-2.5 border-b border-border/40">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                                        <Sparkles className="h-3 w-3" />
                                        Gợi ý ({results.length})
                                    </p>
                                </div>
                                <div className="max-h-[360px] overflow-y-auto py-1">
                                    {results.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleSelect(product.id)}
                                            className="flex items-center gap-4 w-full px-4 py-3 hover:bg-primary/5 transition-all text-left group"
                                        >
                                            <div className="relative h-12 w-12 rounded-xl bg-secondary/40 overflow-hidden flex-shrink-0 border border-border/30">
                                                {product.images.length > 0 ? (
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1.5" sizes="48px" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full"><ShoppingBag className="h-4 w-4 text-muted-foreground/30" /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{product.category.name}</span>
                                                    <span className="text-xs text-muted-foreground/30">·</span>
                                                    <span className="text-sm font-bold text-primary">{formatPrice(Number(product.price))}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-border/40 px-4 py-2.5">
                                    <button
                                        onClick={handleSubmit as any}
                                        className="w-full py-2 text-center text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors"
                                    >
                                        Xem tất cả kết quả cho &quot;{query}&quot; →
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ===== COMPACT VARIANT (header) =====
    return (
        <div ref={containerRef} className="hidden lg:flex items-center relative">
            <form onSubmit={handleSubmit} className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="h-10 w-52 rounded-xl border border-border/60 bg-secondary/40 pl-10 pr-4 text-sm focus:w-72 transition-all duration-300 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                />
            </form>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-96 rounded-2xl border border-border/60 bg-background/98 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="ml-2 text-sm text-muted-foreground">Đang tìm kiếm...</span>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-6">
                            <Search className="h-6 w-6 text-muted-foreground/20 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Không tìm thấy sản phẩm</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-2 border-b border-border/40">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    Gợi ý ({results.length})
                                </p>
                            </div>
                            <div className="max-h-[320px] overflow-y-auto py-1">
                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(product.id)}
                                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-primary/5 transition-all text-left group"
                                    >
                                        <div className="relative h-10 w-10 rounded-lg bg-secondary/40 overflow-hidden flex-shrink-0 border border-border/30">
                                            {product.images.length > 0 ? (
                                                <Image src={product.images[0]} alt={product.name} fill className="object-contain p-1" sizes="40px" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full"><ShoppingBag className="h-3.5 w-3.5 text-muted-foreground/30" /></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{product.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-muted-foreground/50">{product.category.name}</span>
                                                <span className="text-[10px] text-muted-foreground/20">·</span>
                                                <span className="text-xs font-bold text-primary">{formatPrice(Number(product.price))}</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/20 group-hover:text-primary transition-all flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-border/40 px-4 py-2">
                                <button
                                    onClick={handleSubmit as any}
                                    className="w-full py-1.5 text-center text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                    Xem tất cả kết quả →
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
