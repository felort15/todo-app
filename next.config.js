/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/todo-app',
  assetPrefix: '/todo-app/'
}

module.exports = nextConfig 