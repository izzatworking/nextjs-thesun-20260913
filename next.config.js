const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'export',
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'sunmedia-local.local',
      '190.254.4.127',
      '190.254.2.223',
      'thesun.my',
      'www.thesun.my',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig