import type { NextConfig } from "next";

const KALAO_DASHBOARD = "/dashboard";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/sales-dashboard", destination: KALAO_DASHBOARD, permanent: false },
      { source: "/executive-dashboard", destination: KALAO_DASHBOARD, permanent: false },
      { source: "/deals-dashboard", destination: KALAO_DASHBOARD, permanent: false },
      { source: "/leads-dashboard", destination: KALAO_DASHBOARD, permanent: false },
      { source: "/project-dashboard", destination: KALAO_DASHBOARD, permanent: false },
      { source: "/revenue-summary-dashboard", destination: KALAO_DASHBOARD, permanent: false },
      { source: "/growth-dashboard", destination: KALAO_DASHBOARD, permanent: false },
    ];
  },
};

export default nextConfig;
