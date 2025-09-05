
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif|ico|webp|avif)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
    {
      urlPattern: /^https?:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts',
      },
    },
    {
      // Cache Firebase SDK and other external scripts
      urlPattern: /^https?:\/\/(?:www\.)?firebasestorage\.googleapis\.com\/.*|https?:\/\/(?:www\.)?firebaseapp\.com\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-libs',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // For app pages and assets
      urlPattern: /\/_next\/static\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-static',
      },
    },
    {
      // Runtime data (Firebase config, etc.)
      urlPattern: /.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'runtime-data',
        networkTimeoutSeconds: 5,
        expiration: {
            maxEntries: 30,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
            statuses: [0, 200]
        }
      },
    },
  ],
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
