
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Strategy: Network First (for dynamic data from Firebase)
      // Tries the network first, then falls back to cache.
      // Essential for keeping phone numbers, etc., up-to-date.
      urlPattern: /^https?:\/\/(?:www\.)?firebasestorage\.googleapis\.com\/.*|https?:\/\/(?:www\.)?firebaseapp\.com\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-data',
        networkTimeoutSeconds: 3, // Fail fast if network is slow
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
      // Strategy: Cache First (for local images and icons)
      // Once cached, they are served from cache, ideal for static assets.
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-images',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
     {
      // Strategy: Cache First (for app pages and assets)
      // This is the most important rule for offline functionality.
      // It caches all navigation requests and static assets.
      urlPattern: /\.(?:css|js|png|jpg|jpeg|svg|gif|ico|webp|avif)$|^\/$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'app-assets-and-pages',
         expiration: {
          maxEntries: 200, // Increased to hold all app pages and assets
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
     {
      // Strategy: Cache First for all navigations
      urlPattern: ({request}) => request.mode === 'navigate',
      handler: 'CacheFirst',
      options: {
        cacheName: 'app-pages-navigation',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
     },
  ],
  fallbacks: {
    // Optional: a custom offline page
    // document: '/offline.html', 
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
