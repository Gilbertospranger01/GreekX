import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: "pbs.twimg.com" },
      { protocol: 'https', hostname: "i.pinimg.com" },
      { protocol: 'https', hostname: "lh3.googleusercontent.com" },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: "platform-lookaside.fbsbx.com" },
      { protocol: 'https', hostname: "jjbwtwpicbtqqeldzncj.supabase.co" },
    ],
  },
};

export default nextConfig;
