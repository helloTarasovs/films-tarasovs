/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Inline the (small, Tailwind) CSS so it is not render-blocking on first visit.
  experimental: {
    inlineCss: true,
  },
  // Removed template pages; the content lives on the homepage.
  async redirects() {
    return [
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/projects', destination: '/#work', permanent: true },
    ]
  },
}

export default nextConfig
