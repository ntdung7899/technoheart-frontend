"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ChevronDown, Sparkles } from "lucide-react";
import { SearchModal } from "@/components/ui/SearchModal";
import { CartIcon } from "./CartIcon";
import { MobileMenu } from "./MobileMenu";
import { getCategories, type Category } from "@/lib/api/categories";
import { useEffect, useState } from "react";

export function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountHref, setAccountHref] = useState("/login");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories({ take: 6 });
        setCategories(data);
      } catch (error) {
        console.error("Cannot load header categories:", error);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("technoheart_token");
      setAccountHref(token ? "/account" : "/login");
    };

    syncAuth();

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3A5F] via-[#1a3260] to-[#1E3A5F]">
        <div className="flex items-center justify-center h-9 text-xs font-medium tracking-wide">
          <div className="flex items-center gap-2 animate-fade-in text-th-muted">
            <Sparkles className="h-3.5 w-3.5 text-th-yellow" />
            <span>Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ</span>
            <span className="mx-2 opacity-40">|</span>
            <Link
              href="/products"
              className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-80 text-th-yellow"
            >
              Mua ngay →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="th-header sticky top-0 z-50 w-full">
        <div className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="group flex items-center transition-all duration-300 group-hover:opacity-80"
            >
              <Image
                src="/logo-techno-web.png"
                alt="Technoheart Logo"
                width={400}
                height={128}
                className="h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Products Dropdown */}
            <div className="group relative">
              <Link
                href="/products"
                className="th-nav-link flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              >
                Sản phẩm
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
              </Link>

              {/* Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block pt-2 w-72 z-50">
                <div className="rounded-xl p-2 animate-scale-in bg-th-dark/95 border border-th-border backdrop-blur-2xl shadow-2xl shadow-black/40">
                  <div className="px-3 py-2 mb-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-th-yellow">
                      Danh mục
                    </p>
                  </div>

                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className="th-dropdown-item flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all group/item"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-th-blue/15 text-th-blue-lt">
                        {cat._count?.products ?? cat.productCount ?? 0}
                      </span>
                    </Link>
                  ))}

                  {categories.length === 0 && (
                    <p className="px-3 py-2.5 text-sm italic text-th-muted">
                      Chưa có danh mục
                    </p>
                  )}

                  <div className="my-1 h-px bg-th-blue/10" />

                  <Link
                    href="/products"
                    className="flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all text-th-blue-lt"
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/news"
              className="th-nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all"
            >
              Tin tức
            </Link>

            <Link
              href="/contact"
              className="th-nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <SearchModal variant="compact" />
            <SearchModal variant="icon" />

            <CartIcon />

            <Link
              href={accountHref}
              className="th-icon-btn p-2.5 rounded-xl transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            <MobileMenu />
          </div>
        </div>
      </header>
    </>
  );
}