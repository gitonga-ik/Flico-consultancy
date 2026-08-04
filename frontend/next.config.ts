import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
