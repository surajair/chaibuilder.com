/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "ucarecdn.com" },
      { hostname: "img.shields.io" },
      { hostname: "cdn.rareblocks.xyz" },
      { hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
