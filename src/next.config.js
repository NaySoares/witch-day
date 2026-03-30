/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Para build Docker otimizado
  transpilePackages: ['@axioslab-city/shared'],
  // Phaser requires client-side rendering
  webpack: (config, { isServer }) => {
    // Phaser dependencies that need to be excluded from server-side
    if (isServer) {
      config.externals.push('phaser');
    }
    return config;
  },
}

module.exports = nextConfig;
