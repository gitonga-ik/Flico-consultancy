import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   devIndicators: false,
   // Allow ngrok traffic for dev
   allowedDevOrigins: ["subchronically-intergroup-shante.ngrok-free.dev"]
};

export default nextConfig;
