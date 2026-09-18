import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yuxnxjvtunjdhmsxexxf.supabase.co",
        pathname: "/storage/v1/object/public/book-covers/**",
      },
    ],
  },
};

export default nextConfig;