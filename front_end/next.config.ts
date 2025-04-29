/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/ipfs/**',
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
