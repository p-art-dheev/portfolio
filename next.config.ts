import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  // public/ files aren't content-hashed, so cache them for a day (not
  // forever) and serve stale copies while revalidating for a week.
  async headers() {
    return ["/avatars", "/projects", "/artworks", "/books"].map((dir) => ({
      source: `${dir}/:path*`,
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, stale-while-revalidate=604800",
        },
      ],
    }));
  },
  experimental: {
    // Media uploads go through server actions (10 MB cap enforced there).
    serverActions: { bodySizeLimit: "12mb" },
    optimizePackageImports: ["lucide-react", "radix-ui", "react-icons"],
  },
};

export default nextConfig;
