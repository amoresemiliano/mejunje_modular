/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['images.unsplash.com'],
  },

  async rewrites() {
    return [
      {
        source: '/lab',
        destination: 'https://kamelo.vercel.app/lab',
      },
      {
        source: '/lab/:path*',
        destination: 'https://kamelo.vercel.app/lab/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
