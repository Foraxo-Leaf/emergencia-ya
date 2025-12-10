# CONTEXT.md – Contexto del Proyecto

## Resumen del proyecto
Emergencia Ya es una PWA (Next.js 16 App Router) para acceso rápido a emergencias SUSAMCO: botón principal de ambulancia, triage guiado, contactos útiles (SAMCO, monitoreo, policía, bomberos), educación en primeros auxilios y soporte offline.

## Estado actual del sistema
- Frontend: Next.js 16.0.8 (App Router), React 18, Tailwind, Radix UI, lucide-react.
- PWA: next-pwa con cacheo: CacheFirst videos Firebase Storage; NetworkFirst para navegación (timeout 5s, 7 días) con fallback `/offline`; StaleWhileRevalidate para assets estáticos (CSS/JS/img/fonts); offline page muestra números directos.
- Config remota: Firebase Remote Config v1 (defaults embebidos, fetch/activate, TTL y cache local 24h, claves versionadas en `localStorage` con limpieza de legacy).
- Datos locales: Dexie DB (`contacts`, `protocols`, `incidents`, `attachments`, `outbox`, `secure`) + outbox hacia Firestore con backoff exponencial y reintentos limitados.
- Pantallas principales:
  - `/`: botón llamar ambulancia (elige número local vs 107 por geofence) + accesos rápidos a triage, educación, policía, bomberos, centros. Incluye banners de patrocinio (Fundación Nazareno Crucianelli) arriba y en el pie.
  - `/autoevaluacion`: triage rápido con recomendaciones y acciones (llamada, SMS con ubicación, WhatsApp, centros).
  - `/centros`: tarjetas SAMCO/Monitoreo/Policía/Bomberos con llamada, WhatsApp, mapas.
  - `/policia`, `/bomberos`: llamada directa al número remoto configurado.
  - `/educacion`: grid de temas (JSON local), detalle con pasos y link a video desde Remote Config.
  - `/offline`: fallback sin conexión (HTML y página React).
- IA: carpeta `src/ai` con Genkit + GoogleAI (gemini-2.5-flash), sin flows definidos.

## Configuración relevante
- Dev server: `npm run dev --webpack -p 9002` (webpack forzado por compatibilidad con `next-pwa`).
- Firebase (frontend): projectId `emergencia-ya`, appId `1:487397458821:web:d0267ceef85c9650d87aec`, storageBucket `emergencia-ya.firebasestorage.app`, apiKey expuesta (frontend).
- Remote Config:
  - Claves: datos de SAMCO, monitoreo, policía, bomberos, ambulancia, geofence (lat/lon/radio km), URLs de videos `education_video_<slug>`.
  - Defaults embebidos en `src/lib/config.ts`; geofence por defecto centro Armstrong (-32.7833, -61.6) radio 10 km; números por defecto 107/100/101/109; WhatsApp SAMCO 543471533033.
  - Caché local 24h (`remoteConfigData`, `remoteConfigLastFetch` en localStorage).
- Geolocalización:
  - Home y triage usan `navigator.geolocation`; si falla/deniega, se usa 107; si fuera de radio, también 107.
- PWA / caching (next.config.ts):
  - CacheFirst videos `firebasestorage.googleapis.com` (20 entries, 30 días).
  - NetworkFirst navegación (timeout 5s, 7 días); fallback offline `/offline`.
  - StaleWhileRevalidate assets estáticos (CSS/JS/img/fonts) y Google Fonts.
- Config PWA centralizada en `next.config.ts` (raíz); duplicado en `src/next.config.ts` eliminado.
- Assets estáticos relevantes: `public/logo.svg` (app) y `public/logo-fundacion-blanca.jpeg` (banner patrocinio).
- Manifest (`public/manifest.json` y `manifest.webmanifest`): name/short_name “Emergencia Ya”, theme_color `#DC2626`, icons PNG 192/512 (maskable).
- Build: `npm run build --webpack`.
- Lint/TS: `ignoreBuildErrors: true`; lint con ESLint 9 flat config (`eslint.config.mjs`, presets js/ts recomendados) vía `eslint . --max-warnings=0`; script `next typegen` disponible.

## Deuda técnica
- TS y ESLint ignorados en build: riesgo de acumular errores no detectados.
- SeedDB llamado pero vacío; confundir expectativas de datos iniciales.
- Outbox/sync ahora tiene backoff y límite de intentos, pero sin reconciliación de conflictos ni consolidación server.
- Geolocalización crítica para UX: sin fallback visual avanzado; timeout 10s.
- Remote Config v1 con versión/TTL; falta validación de esquema/compatibilidad futura y manejo de defaults en servidor.

## Notas de interoperabilidad
- Si Remote Config no está soportado (Firebase no inicializa), se usan defaults embebidos.
- Geofence/ubicación requiere `navigator.geolocation`; en desktop o permisos denegados se fuerza número nacional.
- PWA usa `skipWaiting`; actualizaciones pueden activar SW sin reabrir (vigilar cambios de caché).
- Claves de Firebase están en el cliente (solo servicios públicos); no colocar secretos.
