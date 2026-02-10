/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/drei',
      'framer-motion',
      'gsap',
    ],
  },
};

export default nextConfig;
