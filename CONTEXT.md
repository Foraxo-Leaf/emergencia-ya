# CONTEXT.md – Contexto del Proyecto

## Resumen del proyecto
Emergencia Ya es una PWA (Next.js 16 App Router) para acceso rápido a emergencias SUSAMCO: botón principal de ambulancia, triage guiado, contactos útiles (SAMCO, monitoreo, policía, bomberos), educación en primeros auxilios y soporte offline.

## Estado actual del sistema
- Frontend: Next.js 16.0.10 (App Router), React 18, Tailwind, Radix UI, lucide-react.
- PWA: next-pwa con cacheo: CacheFirst videos Firebase Storage; NetworkFirst para navegación (timeout 5s, 7 días) con fallback `/offline`; StaleWhileRevalidate para assets estáticos (CSS/JS/img/fonts); offline page muestra números directos.
- Config remota: Firebase Remote Config v1 (defaults embebidos, fetch/activate, TTL y cache local 24h, claves versionadas en `localStorage` con limpieza de legacy, y refresh forzado 1 vez por sesión al detectar conectividad) y snapshot persistido en Dexie para uso offline.
- Datos locales: Dexie DB (`contacts`, `protocols`, `incidents`, `attachments`, `outbox`, `secure`, `remoteConfigSnapshots`) + outbox hacia Firestore con backoff exponencial y reintentos limitados.
- Pantallas principales:
  - `/`: botón llamar ambulancia (elige número local vs número general `offline_ambulance_phone` por geofence) + accesos rápidos a triage, educación, policía, bomberos, centros. Incluye banner de patrocinio (Fundación Nazareno Crucianelli) **solo arriba**.
  - `/autoevaluacion`: triage rápido con recomendaciones y acciones (llamada, SMS con ubicación, WhatsApp, centros).
  - `/centros`: tarjetas SAMCO/Monitoreo/Policía/Bomberos con llamada, WhatsApp, mapas (teléfonos conmutan por geofence: local vs `offline_*`).
  - `/policia`, `/bomberos`: llamada conmutada por geofence (local vs `offline_*`) configurada por Remote Config.
  - `/educacion`: grid de temas (JSON local), detalle con pasos y link a video desde Remote Config.
  - `/offline`: fallback sin conexión (página React; muestra números `offline_*` desde Remote Config cacheado/defaults). También existe `offline.html` como respaldo estático.
- IA: carpeta `src/ai` con Genkit + GoogleAI (gemini-2.5-flash), sin flows definidos.

## Configuración relevante
- Dev server: `npm run dev --webpack -p 9002` (webpack forzado por compatibilidad con `next-pwa`).
- Firebase (frontend): projectId `emergencia-ya`, appId `1:487397458821:web:d0267ceef85c9650d87aec`, storageBucket `emergencia-ya.firebasestorage.app`, apiKey expuesta (frontend).
- Remote Config:
  - Claves: datos de SAMCO, monitoreo, policía, bomberos; números locales (`*_phone`), números generales/offline (`offline_*_phone`), geofence (lat/lon/radio km), URLs de videos `education_video_<slug_con_guiones_bajos>` (slug con `-`→`_`, ej. `education_video_rcp_adultos`) y SMS (`samco_sms_phone`, `sms_help_body_template` con placeholders `{{mapsUrl}}/{{coords}}/{{lat}}/{{lon}}`).
  - Defaults embebidos en `src/lib/config.ts`; geofence por defecto centro Armstrong (-32.7833, -61.6) radio 10 km; números por defecto 107/100/101/109; WhatsApp SAMCO 543471533033; template SMS por defecto incluye `{{mapsUrl}}`.
  - Caché local 24h (`remoteConfigData`, `remoteConfigLastFetch` en localStorage) y snapshot persistido en Dexie (`remoteConfigSnapshots`).
  - Refresh: si hay internet al iniciar (o cuando vuelve con el evento `online`), se intenta un fetch/activate **forzado** en background (1 vez por sesión) para aplicar cambios recién publicados sin esperar 24h.
- Geolocalización:
  - Home/triage/centros/policía/bomberos usan `navigator.geolocation` para determinar si está dentro del geofence; si falla/deniega o está fuera de radio, se usan números generales (`offline_*`).
- PWA / caching (next.config.ts):
  - CacheFirst videos `firebasestorage.googleapis.com` (20 entries, 30 días).
  - NetworkFirst navegación (timeout 5s, 7 días); fallback offline `/offline`.
  - StaleWhileRevalidate assets estáticos (CSS/JS/img/fonts) y Google Fonts.
- Config PWA centralizada en `next.config.ts` (raíz); duplicado en `src/next.config.ts` eliminado.
- Assets estáticos relevantes: `public/logo.svg` (app) y `public/logo-fundacion-blanca.jpeg` (banner patrocinio).
- Iconos de app:
  - Imagen fuente: `assets/ambulancia.png` (PNG negro sobre transparente); se procesa con sharp para invertir colores (blanco) y componer sobre fondo rojo (#DC2626).
  - Generados en `assets/`: `icon.png` (1024x1024, ambulancia blanca sobre círculo rojo), `icon-foreground.png` (ambulancia blanca, fondo transparente), `splash.png` (2732x2732).
  - PWA: `public/icons/icon-192x192.png`, `icon-512x512.png`, `favicon.png`; además `public/favicon.ico` y `public/apple-touch-icon.png` (180x180 para iOS).
  - Android: `android/app/src/main/res/mipmap-*/ic_launcher*.png` (incluye Adaptive Icons con foreground/background) y splash screens en `drawable-*/`.
  - Para cambiar el icono: reemplazar `assets/ambulancia.png` con nueva imagen (negro sobre transparente) y ejecutar los scripts.
  - Regenerar: primero crear `icon.png` manualmente o con script ad-hoc, luego `npm run generate:assets` para Android.
  - Favicon en layout.tsx apunta a `/icons/favicon.png`; si el navegador cachea el viejo, hacer hard refresh (Ctrl+Shift+R).
- Manifest (`public/manifest.json` y `manifest.webmanifest`): name/short_name "Emergencia Ya", theme_color `#DC2626`, icons PNG 192/512 (maskable) en `public/icons/`.
- Build: `npm run build --webpack` (genera `out/` por export estático).
- Lint/TS: `ignoreBuildErrors: true`; lint con ESLint 9 flat config (`eslint.config.mjs`, presets js/ts recomendados) vía `eslint . --max-warnings=0` (ignorando `.next/**`, `android/**`, `out/**` y `scripts/**`); script `next typegen` disponible.
- Seguridad de dependencias: `package.json` usa `overrides` para fijar versiones seguras (`axios` 1.13.2, `@modelcontextprotocol/sdk` 1.24.3 con `body-parser` 2.2.1, `glob` 9.3.5 para compat CJS, `brace-expansion` 1.1.12/2.0.2, `@babel.runtime` 7.28.4) y `patch-package` 8.0.1; Next actualizado a **16.0.10**; `npm audit` en 0 al 2025-12-12.
- Empaquetado móvil: Capacitor configurado para **offline-first** (`capacitor.config.ts`, appId `com.susamco.emergenciaya`, webDir `out`, sin `server.url`) con proyecto Android generado (`android/`); flujo: `npm run build --webpack` (export estático a `out/`) + `npx cap sync android`. Nota: `trailingSlash: false` en `next.config.ts` por compatibilidad con el asset server de Capacitor y se requiere que rutas dinámicas sean exportables (p.ej. `generateStaticParams`). Para generar APK se usa Gradle (`./gradlew assembleDebug`) y requiere **JDK 17** (si falla por Java 11, setear `JAVA_HOME` a un JDK 17). Si `npx cap open android` falla en WSL por no tener Android Studio instalado, el build por consola + `adb` es suficiente. Si compilás desde WSL y el emulador corre en Windows, para instalar/ejecutar en el AVD usá el `adb.exe` del SDK de Windows (p.ej. `/mnt/c/Users/efarias/AppData/Local/Android/Sdk/platform-tools/adb.exe`) porque el `adb` de Linux puede no ver el emulador; para rutas WSL usar `wslpath -w <ruta>` para convertir a formato Windows (ej: `adb.exe install -r "$(wslpath -w /ruta/al.apk)"`). iOS queda preparado para el mismo enfoque (bundle local), pero **para compilar/firmar y publicar** se requiere **macOS + Xcode**. Guía de empaquetado: `docs/appstore-packaging.md`. Emulador recomendado: lanzar por consola sin snapshots y con DNS fijo: `emulator.exe -avd <AVD> -dns-server 8.8.8.8,1.1.1.1 -no-snapshot-load -no-snapshot-save`; si se usa Device Manager, hacer Wipe Data y Cold Boot para evitar estados de red rotos.

## Deuda técnica
- TS y ESLint ignorados en build: riesgo de acumular errores no detectados.
- SeedDB llamado pero vacío; confundir expectativas de datos iniciales.
- Outbox/sync ahora tiene backoff y límite de intentos, pero sin reconciliación de conflictos ni consolidación server.
- Geolocalización crítica para UX: sin fallback visual avanzado; timeout 10s.
- Remote Config v1 con versión/TTL y snapshot local; falta validación de esquema/compatibilidad futura y manejo de defaults en servidor.

## Notas de interoperabilidad
- Si Remote Config no está soportado (Firebase no inicializa), se usan defaults embebidos.
- Geofence/ubicación requiere `navigator.geolocation`; en desktop o permisos denegados se fuerza el número general configurado (`offline_*`).
- PWA usa `skipWaiting`; actualizaciones pueden activar SW sin reabrir (vigilar cambios de caché).
- Claves de Firebase están en el cliente (solo servicios públicos); no colocar secretos.
- Emulador Android: conectividad puede fallar si se arranca desde Device Manager con snapshots antiguos; iniciar por consola con `emulator.exe -avd <AVD> -dns-server 8.8.8.8,1.1.1.1 -no-snapshot-load -no-snapshot-save` evita el estado roto de red.
