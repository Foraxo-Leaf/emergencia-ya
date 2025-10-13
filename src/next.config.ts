
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Strategy: Cache First (for Firebase-hosted videos)
      // Stores tutorial videos for offline replay when available.
      urlPattern: /^https?:\/\/firebasestorage\.googleapis\.com\/.*\.(?:mp4|webm|ogg)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'video-cache',
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
      // Strategy: Network First (for dynamic data from Firebase Remote Config)
      // Tries the network first, then falls back to cache.
      // Essential for keeping phone numbers, etc., up-to-date.
      urlPattern: /^https?:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-remote-config',
        networkTimeoutSeconds: 3, // Fail fast if network is slow
        expiration: {
          maxAgeSeconds: 24 * 60 * 60, // 1 Day
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Strategy: Stale-While-Revalidate (for Google Fonts)
      // Serves from cache immediately, then updates in the background.
      urlPattern: /^https?:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
        },
      },
    },
     {
      // Strategy: Cache First (for app pages and assets)
      // This is the most important rule for offline functionality.
      // It caches all navigation requests and static assets.
      urlPattern: ({request}) =>
        request.mode === 'navigate' ||
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'app-assets-and-pages',
         expiration: {
          maxEntries: 200, // Increased to hold all app pages and assets
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
  fallbacks: {
    // Use Next.js page for a better offline experience
    document: '/offline',
  }
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
