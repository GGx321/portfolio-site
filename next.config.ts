import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Для Docker деплоя
  output: "standalone",
  
  // Оптимизация изображений
  images: {
    formats: ["image/avif", "image/webp"],
  },
  
  // Сжатие
  compress: true,
  
  // Строгий режим React
  reactStrictMode: true,
  
  // Убираем X-Powered-By header для безопасности
  poweredByHeader: false,
};

export default nextConfig;
