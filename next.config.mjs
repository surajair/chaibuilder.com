/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //NOTE: Update this list as needed
    remotePatterns: [
      { hostname: "ucarecdn.com" },
      { hostname: "placehold.co" },
      { hostname: "img.shields.io" },
      { hostname: "cdn.rareblocks.xyz" },
      { hostname: "picsum.photos" },
      { hostname: "via.placeholder.com" },
    ],
  },
};

export default nextConfig;
