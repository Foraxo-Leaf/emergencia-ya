# DECISIONS.md – Registro de Decisiones

## Cambios recientes
2025-12-11 – **Parche CVEs npm (overrides)** – Se fijan versiones seguras con overrides (`axios` 1.13.2, `@modelcontextprotocol/sdk` 1.24.3 + `body-parser` 2.2.1, `glob` 10.5.0 → luego 9.3.5 por compat, `brace-expansion` 2.0.2, `@babel/runtime` 7.28.4) y se sube `patch-package` a 8.0.1 para cerrar vulnerabilidades; `npm audit` queda en 0.
2025-12-11 – **Compat glob (build Next/PWA)** – Se ajusta override de `glob` a 9.3.5 (CJS) para evitar error `pify(...).bind` al cargar `next.config.ts`; build vuelve a pasar (`npm run build`).
2025-12-11 – **Gitignore Android endurecido** – `android/.gitignore` ahora excluye keystores (`*.jks`, `*.keystore`, `*.p12`, `*.pem`) y `google-services.json` en cualquier ruta para prevenir filtrado de credenciales.
2025-12-11 – **Capacitor Android base** – Añadidos @capacitor/core/cli/android, `capacitor.config.ts` (appId `com.susamco.emergenciaya`, webDir `.next`, server `https://emergencia-ya.vercel.app`) y proyecto `android/` para empaquetar APK/AAB offline.
2025-12-11 – **Remote Config snapshot Dexie** – Dexie v4 agrega `remoteConfigSnapshots` y el hook adopta/actualiza snapshots hashados, permitiendo usar datos RC offline y actualizar solo si cambian.
2025-12-11 – **Doc comandos Android** – `docs/appstore-packaging.md` incluye pasos rápidos (build, cap sync/open) para generar/aprobar APK/AAB.
2025-12-11 – **ESLint ignora android/** – Se excluye `android/**` en la flat config para evitar falsos positivos sobre assets generados por Capacitor.
2025-12-10 – **PWA caching nav NetworkFirst y assets SWR** – Ajustado runtime caching: navegación NetworkFirst (timeout 5s, 7d) y assets StaleWhileRevalidate manteniendo fallback `/offline`.
2025-12-10 – **Fallback offline con números directos** – Página offline (React y HTML) ahora muestra botones de llamada a números críticos por defecto para uso sin datos.
2025-12-10 – **Remote Config v1 versionada** – Claves y cache de Remote Config con versión v1, TTL 24h y limpieza de storage legacy para evitar datos viejos.
2025-12-10 – **Outbox con backoff** – Dexie v3 añade attempts/nextAttemptAt y sync usa backoff exponencial con límite de intentos para evitar bucles en offline.
2025-12-10 – **Manifest webmanifest alineado** – `manifest.webmanifest` ahora usa los íconos PNG/maskable reales como `manifest.json`.
2025-12-10 – **ESLint flat config (mjs)** – Migrado a `eslint.config.mjs` (flat) para compatibilidad con ESLint 9 sin warnings.
2025-12-10 – **Guía empaquetado stores** – Creado `docs/appstore-packaging.md` con pasos Capacitor/TWA, checklist de permisos, assets y pruebas.
2025-12-10 – **Next.js 16.0.8 (CVE-2025-66478)** – Actualizados `next` y `eslint-config-next` a 16.0.8 para cumplir el requisito de seguridad de Vercel; se regeneró `package-lock.json`.
2025-12-10 – **Config PWA unificada** – Eliminado `src/next.config.ts` duplicado; se mantiene `next.config.ts` en raíz con fallback offline en `/offline` (App Router).
2025-12-10 – **Deps Genkit/ESLint compatibles Next16** – Actualizadas dependencias @genkit-ai a 1.25.0 (core, next, googleai), ESLint a v9 y zod a ^3.25.x para alinear peer deps y permitir instalaciones/builds en Next 16 (Vercel).
2025-12-10 – **Linting con ESLint CLI y typegen** – Se reemplazó `next lint` eliminado en v16 por `eslint . --max-warnings=0` usando configuración básica `eslint:recommended` + `@typescript-eslint/recommended`, ignorando artefactos generados (`public/**`, `.next`). Se añadió script `next typegen` para generar tipos en CI.
2025-12-10 – **Next.js 16.0.7 (parche React2Shell)** – Actualizado Next a 16.0.7 para mitigar CVE-2025-55182; se fuerza webpack en dev/build (`next dev --webpack`, `next build --webpack`) por compatibilidad con `next-pwa`. Se eliminó `eslint` del `next.config` (ya no soportado en v16).
2025-12-10 – **Next.js App Router + PWA** – Se usa Next.js 15 con App Router y next-pwa; navegación/estáticos en CacheFirst y fallback `/offline`.
2025-12-10 – **Caché de videos educativos** – CacheFirst para videos de Firebase Storage (20 entradas, 30 días) para disponibilidad offline.
2025-12-10 – **Remote Config con defaults embebidos** – Config por defecto en bundle; fetch/activate cada 24h (localStorage). Si RC falla, se usan defaults.
2025-12-10 – **Geofence para número de ambulancia** – Centro Armstrong (-32.7833, -61.6), radio 10 km. Dentro del área se usa número local; fuera o sin ubicación, 107.
2025-12-10 – **Contenido educativo mixto** – Tópicos y pasos en JSON local; URLs de video provistas por Remote Config por slug.
2025-12-10 – **Datos locales y sincronización** – Dexie DB para almacenamiento offline y outbox; sync a Firestore con `sync()` (sin backoff, reemplazado luego por entrada “Outbox con backoff” del mismo día).
2025-12-10 – **Build tolerante a errores** – `typescript.ignoreBuildErrors` y `eslint.ignoreDuringBuilds` activados para no bloquear builds.
2025-12-10 – **Distribución mobile-first** – PWA instalable (manifest, icons, theme_color) como base para empaquetar en tiendas a futuro.
2025-12-10 – **Banners patrocinio Fundación Nazareno Crucianelli** – Imagen estática `public/logo-fundacion-blanca.jpeg` en home (top y pie) para crédito de patrocinio sin alterar CTA principal.
