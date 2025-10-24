/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client'],
  // Force port 3000 for consistency
  env: {
    PORT: '3000',
  },
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google profile images
      'yt3.ggpht.com', // YouTube channel avatars
      'i.ytimg.com', // YouTube video thumbnails
      'blob.vercel-storage.com', // Vercel Blob Storage
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
