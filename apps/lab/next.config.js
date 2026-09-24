/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  basePath: '/lab',
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
