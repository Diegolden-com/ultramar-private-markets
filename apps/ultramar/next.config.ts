import type { NextConfig } from "next";

const host = (value: string) => ({
  type: "host" as const,
  value,
});

const nextConfig: NextConfig = {
  transpilePackages: ["@ultramar/product-model"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [host("www.ultramar.capital")],
        destination: "https://ultramar.capital/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
