import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/chat/login",
        destination: "/login",
        permanent: false,
      },
      {
        source: "/chat/verify",
        destination: "/verify",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
