/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Add ngrok domain for Strapi
      {
        protocol: "https",
        hostname: "f184-102-89-33-149.ngrok-free.app",
        port: "",
        pathname: "/uploads/**",
      },
      // If you have a production Strapi server, add it here too
      // {
      //   protocol: 'https',
      //   hostname: 'your-production-strapi-domain.com',
      //   pathname: '/uploads/**',
      // },
    ],
  },
};

export default nextConfig;
