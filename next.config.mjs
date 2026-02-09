/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize bundle splitting
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/drei'],
  },
}

export default nextConfig
