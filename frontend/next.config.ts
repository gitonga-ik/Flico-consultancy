import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
   devIndicators: false,
   // Allow ngrok traffic for dev
   allowedDevOrigins: ["subchronically-intergroup-shante.ngrok-free.dev"],
   serverExternalPackages: ['mupdf'],
   experimental: {
      serverActions: {
         bodySizeLimit: '10mb',
      },
   },
};

export default nextConfig;
