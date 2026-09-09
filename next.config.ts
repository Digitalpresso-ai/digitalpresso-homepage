import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/api/mcp': ['./content/**/*.md'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 82, 88],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'jgjxmewzandjsorsnjbu.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'arscjccjgcbvbudoaiug.supabase.co',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: { exportType: 'default' } }],
        as: '*.js',
      },
    },
  },
};

export default withNextIntl(nextConfig);
