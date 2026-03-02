import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Technoheart | Công nghệ & Sản phẩm chăm sóc sức khỏe tiên tiến",
  description:
    "TTechnoheart G9 – Ứng dụng khoa học và công nghệ tiên tiến trong chăm sóc sức khỏe, máy lọc nước, thiết bị bảo vệ sức khỏe và giải pháp công nghệ nhân văn.",
  keywords: [
    "Technoheart G9",
    "công nghệ chăm sóc sức khỏe",
    "máy lọc nước",
    "công nghệ lượng tử",
    "thiết bị bảo vệ sức khỏe",
    "sản phẩm sức khỏe",
    "chuyển giao công nghệ",
    "Việt Nam",
  ],

  openGraph: {
    title: "Technoheart G9 – Công nghệ & Sản phẩm chăm sóc sức khỏe tiên tiến",
    description:
      "Kết nối khoa học – công nghệ – con người. Khám phá các sản phẩm và giải pháp chăm sóc sức khỏe tại Technoheart G9.",
    siteName: "Technoheart G9",
    images: [
      {
        url: "https://technoheartg9.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Technoheart G9",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
