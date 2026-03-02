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
  title: "TechnoHeart | IT Solutions & Custom Software Development",
  description:
    "TechnoHeart is a premium IT solutions and software development company specializing in custom software, cloud infrastructure, cybersecurity, and AI-powered solutions.",
  keywords: [
    "IT solutions",
    "software development",
    "custom software",
    "cloud infrastructure",
    "digital transformation",
    "AI solutions",
    "TechnoHeart",
  ],
  openGraph: {
    title: "TechnoHeart | IT Solutions & Custom Software Development",
    description:
      "Premium IT solutions and software development. Build, scale, and lead with technology.",
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
