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
};

export default nextConfig;
