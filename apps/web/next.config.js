/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ['@gomath/shared', '@gomath/ui'],
  },
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    // GraphQL 파일 로더 설정
    config.module.rules.push({
      test: /\.graphql$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-tag/loader' }],
    });

    // Three.js 최적화
    config.resolve.alias = {
      ...config.resolve.alias,
      three: 'three/build/three.module.js',
    };

    return config;
  },
  // PWA 설정을 위한 설정 (추후 추가)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;