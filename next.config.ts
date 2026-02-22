import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "mongoose"];
    }
    return config;
  },
};

export default nextConfig;