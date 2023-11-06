/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    deviceSizes: [640, 768, 1024, 1280],
  },
}

module.exports = nextConfig
