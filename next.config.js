/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/prisma/**',
          '**/dev.db',
          '**/*.txtSync',
          '**/reports/**',
          '**/.next/**'
        ],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
