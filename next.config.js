/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "imagedelivery.net",
      "customer-pqz61m3zr8qeuu63.cloudflarestream.com",
    ],
  },
};

module.exports = nextConfig;
