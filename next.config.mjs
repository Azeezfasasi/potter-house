/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Turbopack configuration for development
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  /* config options here */
};

export default nextConfig;
