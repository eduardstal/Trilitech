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
      {
        protocol: 'https',
        hostname: 'ipfs.raribleuserdata.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.raribleuserdata.com',
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
