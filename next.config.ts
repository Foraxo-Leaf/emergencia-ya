
import path from 'path';
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
      // Strategy: Network First (for navigation requests)
      // Prioritizes fresh HTML while still allowing offline fallback.
      urlPattern: ({request}: {request: {mode?: string}}) =>
        request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-pages',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Strategy: Stale-While-Revalidate (for static assets)
      // Serves cached CSS/JS/fonts/images immediately and refreshes in background.
      urlPattern: ({request}: {request: {destination?: string}}) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'app-static-assets',
         expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  fallbacks: {
    // Página offline servida desde App Router
    document: '/offline',
  }
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: path.join(__dirname),
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
