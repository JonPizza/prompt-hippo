/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: '"lh3.googleusercontent.com"',
      },
    ],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
