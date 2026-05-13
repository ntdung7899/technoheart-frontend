import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'technoheartg9.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/admin/dashboard',
        destination: '/admin',
      },
    ];
  },
};

export default nextConfig;
