/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig