/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Enable trailing slashes for better compatibility
  trailingSlash: true
}

module.exports = nextConfig 