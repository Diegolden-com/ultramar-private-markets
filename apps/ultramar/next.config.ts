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
      {
        source: "/",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/",
        permanent: true,
      },
      {
        source: "/app",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund",
        permanent: true,
      },
      {
        source: "/app/strategy/private-equities",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities",
        permanent: true,
      },
      {
        source: "/app/strategy/polymarket-synthetic-options",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund",
        permanent: true,
      },
      {
        source: "/app/strategy/lending-markets",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund/research",
        permanent: true,
      },
      {
        source: "/app/strategy/derivative-arbitrage",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund/research",
        permanent: true,
      },
      {
        source: "/info/lending-markets",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund/research",
        permanent: true,
      },
      {
        source: "/info/derivative-arbitrage",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund/research",
        permanent: true,
      },
      {
        source: "/info/polymarket-arbitrage",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund",
        permanent: true,
      },
      {
        source: "/info/private-markets",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [host("capital.ultramar.capital")],
        destination: "https://ultramar.capital/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [host("polymarket.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund",
        permanent: true,
      },
      {
        source: "/dashboard",
        has: [host("polymarket.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund/dashboard",
        permanent: true,
      },
      {
        source: "/auth/:path*",
        has: [host("polymarket.ultramar.capital")],
        destination: "https://ultramar.capital/auth/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [host("polymarket.ultramar.capital")],
        destination: "https://ultramar.capital/arbitrage-hedge-fund/:path*",
        permanent: true,
      },
      {
        source: "/",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities",
        permanent: true,
      },
      {
        source: "/api/portfolio",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/api/private-equities/portfolio",
        permanent: true,
      },
      {
        source: "/api/oracle/score",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/api/private-equities/oracle/score",
        permanent: true,
      },
      {
        source: "/equities",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/assets",
        permanent: true,
      },
      {
        source: "/equities/:ticker",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/assets/:ticker",
        permanent: true,
      },
      {
        source: "/portfolio",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/portfolio",
        permanent: true,
      },
      {
        source: "/market",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/market",
        permanent: true,
      },
      {
        source: "/oracle",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/oracle",
        permanent: true,
      },
      {
        source: "/law",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/legal",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [host("private-equities.ultramar.capital")],
        destination: "https://ultramar.capital/private-equities/:path*",
        permanent: true,
      },
      {
        source: "/equities",
        destination: "/private-equities/assets",
        permanent: true,
      },
      {
        source: "/equities/:ticker",
        destination: "/private-equities/assets/:ticker",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/arbitrage-hedge-fund/dashboard",
        permanent: true,
      },
      {
        source: "/api/portfolio",
        destination: "/api/private-equities/portfolio",
        permanent: true,
      },
      {
        source: "/api/oracle/score",
        destination: "/api/private-equities/oracle/score",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/arbitrage-hedge-fund",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
