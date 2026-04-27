/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow the Emergent preview host to connect to the Next.js dev server.
  // In production (Vercel), this has no effect.
  experimental: {
    // nothing special; keep defaults
  },
};

export default nextConfig;
