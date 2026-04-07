/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'supabase.co' }
    ]
  }
}

module.exports = nextConfig