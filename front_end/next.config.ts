/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      // Optionally, add more gateways if needed:
      // {
      //   protocol: 'https',
      //   hostname: '**.ipfs.dweb.link',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
