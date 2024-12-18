/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fkefljahqsmuqmudubtv.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb', // Increase the server action payload limit
    },
  },
};

export default nextConfig;
