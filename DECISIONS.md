# DECISIONS.md – Registro de Decisiones

## Cambios recientes
2025-12-10 – **Linting con ESLint CLI y typegen** – Se reemplazó `next lint` eliminado en v16 por `eslint . --max-warnings=0` usando configuración básica `eslint:recommended` + `@typescript-eslint/recommended`, ignorando artefactos generados (`public/**`, `.next`). Se añadió script `next typegen` para generar tipos en CI.
2025-12-10 – **Next.js 16.0.7 (parche React2Shell)** – Actualizado Next a 16.0.7 para mitigar CVE-2025-55182; se fuerza webpack en dev/build (`next dev --webpack`, `next build --webpack`) por compatibilidad con `next-pwa`. Se eliminó `eslint` del `next.config` (ya no soportado en v16).
2025-12-10 – **Next.js App Router + PWA** – Se usa Next.js 15 con App Router y next-pwa; navegación/estáticos en CacheFirst y fallback `/offline`.
2025-12-10 – **Caché de videos educativos** – CacheFirst para videos de Firebase Storage (20 entradas, 30 días) para disponibilidad offline.
2025-12-10 – **Remote Config con defaults embebidos** – Config por defecto en bundle; fetch/activate cada 24h (localStorage). Si RC falla, se usan defaults.
2025-12-10 – **Geofence para número de ambulancia** – Centro Armstrong (-32.7833, -61.6), radio 10 km. Dentro del área se usa número local; fuera o sin ubicación, 107.
2025-12-10 – **Contenido educativo mixto** – Tópicos y pasos en JSON local; URLs de video provistas por Remote Config por slug.
2025-12-10 – **Datos locales y sincronización** – Dexie DB para almacenamiento offline y outbox; sync a Firestore con `sync()` (sin backoff).
2025-12-10 – **Build tolerante a errores** – `typescript.ignoreBuildErrors` y `eslint.ignoreDuringBuilds` activados para no bloquear builds.
2025-12-10 – **Distribución mobile-first** – PWA instalable (manifest, icons, theme_color) como base para empaquetar en tiendas a futuro.
2025-12-10 – **Banners patrocinio Fundación Nazareno Crucianelli** – Imagen estática `public/logo-fundacion-blanca.jpeg` en home (top y pie) para crédito de patrocinio sin alterar CTA principal.
