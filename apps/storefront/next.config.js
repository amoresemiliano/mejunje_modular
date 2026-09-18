/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['images.unsplash.com'],
  },

  async rewrites() {
    const labOrigin = process.env.LAB_ORIGIN || 'https://mejunje-lab.vercel.app';
    return [
      {
        source: '/lab',
        destination: `${labOrigin}/lab`,
      },
      {
        source: '/lab/:path*',
        destination: `${labOrigin}/lab/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
