import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",

  // 👇 THIS LINE disables turbopack conflict
  turbopack: {},

  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      const existing = Array.isArray(config.externals) ? config.externals : []
      config.externals = [
        ...existing,
        "mongoose",
        "mongodb",
        ({ request }: { request: string }, callback: Function) => {
          if (
            request &&
            (
              request.includes("kerberos") ||
              request.includes("snappy") ||
              request.includes("aws4") ||
              request.includes("mongodb-client-encryption")
            )
          ) {
            return callback(null, "commonjs " + request)
          }
          callback()
        },
      ]
    }
    return config
  },
}

export default nextConfig