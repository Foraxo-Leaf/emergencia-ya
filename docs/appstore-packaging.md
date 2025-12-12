## Empaquetado iOS/Android (Capacitor, offline-first)

### Estrategia propuesta
- **Capacitor** como contenedor único para iOS y Android **incluyendo el build web dentro de la app** (sin depender de una URL remota).
- La app se construye como **export estático** (`out/`) y Capacitor carga esos assets locales. Esto permite **offline desde el primer arranque**.

### Pasos iniciales
1) Instala herramientas: `npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android`
2) Inicializa: `npx cap init emergencia-ya com.susamco.emergenciaya`
3) Configura `capacitor.config.ts`:
```ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.susamco.emergenciaya",
  appName: "Emergencia Ya",
  // El export estático se genera en `out/` (ver `next.config.ts`).
  webDir: "out",
  // Sin `server.url`: cargamos el bundle local (offline-first).
  server: { cleartext: false, androidScheme: "https" },
};

export default config;
```
4) Asegurá export estático en Next (`next.config.ts`): `output: "export"` + `images.unoptimized: true`.
   - Nota: se usa `trailingSlash: false` porque el asset server de Capacitor no resuelve bien `/ruta/` → `/ruta/index.html`.
5) Plataformas: `npx cap add ios && npx cap add android`
6) Build + sync tras cada cambio web: `npm run build --webpack && npx cap sync`

### Checklist de publicación
- **Offline-first**: probar **primer arranque en modo avión** (sin internet) y navegación completa (`/`, triage, centros, educación, policía, bomberos).
- **Permisos**: declara motivo de geolocalización y llamadas telefónicas en iOS (Info.plist) y Android (Manifest). No usamos cámara/almacenamiento.
- **Assets**: icono 1024x1024 (App Store) y set Android; splash 2732x2732 seguro. Reutiliza `public/icons` como base, pero genera versiones específicas de tienda.
- **Privacidad**: política accesible desde la app y en la ficha de tienda; explicar uso de ubicación (solo para número de ambulancia local) y llamadas.
- **Firmas**: configurar keystore (Android) y certificados/Provisioning Profiles (iOS).
- **Pruebas recomendadas**: modo avión (abre desde icono instalado), reinstalación tras limpiar datos, actualización de Remote Config tras 24h y ver números actualizados.

### Consideraciones de offline/actualizaciones
- El contenedor carga el bundle local (`out/`). El fallback `/offline` sigue existiendo para la PWA web y como “pantalla segura” ante errores.
- Remote Config se cachea 24h y usa defaults embebidos si no hay red.
- Mantén `skipWaiting` activo para que las nuevas versiones de SW se apliquen al reabrir la app.

### Comandos rápidos Android (Capacitor)
1) Instalar deps (ya añadidas): `npm install`
2) Build prod: `npm run build --webpack`
3) Sincronizar: `npx cap sync android`
4) Abrir Android Studio: `npx cap open android`
5) Probar modo avión desde el APK/emu; si cambias frontend, repite pasos 2–3.

