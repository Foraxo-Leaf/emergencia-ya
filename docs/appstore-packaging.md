## Empaquetado iOS/Android (PWA instalable)

### Estrategia propuesta
- **Capacitor** como contenedor único para iOS y Android cargando la PWA publicada (https://<tu-dominio>), aprovechando el SW para offline.
- Alternativa Android: **TWA** (Chrome Trusted Web Activity) si prefieres zero-code en el contenedor, pero Capacitor permite splash/permisos con más control.

### Pasos iniciales
1) Instala herramientas: `npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android`
2) Inicializa: `npx cap init emergencia-ya com.susamco.emergenciaya`
3) Configura `capacitor.config.ts`:
```ts
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.susamco.emergenciaya",
  appName: "Emergencia Ya",
  webDir: ".next", // usar build server-side; mantener SW
  bundledWebRuntime: false,
  server: {
    url: "https://<TU_DOMINIO_PROD>",
    cleartext: false,
    androidScheme: "https",
  },
};

export default config;
```
- En dev local puedes usar `server.url: "http://10.0.2.2:9002"` (Android emulador) tras `npm run dev --webpack -p 9002`.
4) Plataformas: `npx cap add ios && npx cap add android`
5) Copia assets tras cada build: `npm run build --webpack && npx cap copy`

### Checklist de publicación
- **PWA lista para offline**: `next-pwa` + fallback `/offline` ya activos; probar en modo avión antes de subir binarios.
- **Permisos**: declara motivo de geolocalización y llamadas telefónicas en iOS (Info.plist) y Android (Manifest). No usamos cámara/almacenamiento.
- **Assets**: icono 1024x1024 (App Store) y set Android; splash 2732x2732 seguro. Reutiliza `public/icons` como base, pero genera versiones específicas de tienda.
- **Privacidad**: política accesible desde la app y en la ficha de tienda; explicar uso de ubicación (solo para número de ambulancia local) y llamadas.
- **Firmas**: configurar keystore (Android) y certificados/Provisioning Profiles (iOS).
- **Pruebas recomendadas**: modo avión (abre desde icono instalado), reinstalación tras limpiar datos, actualización de Remote Config tras 24h y ver números actualizados.

### Consideraciones de offline/actualizaciones
- El contenedor carga la PWA y el SW cachea navegación/estáticos; el fallback `/offline` muestra números directos.
- Remote Config se cachea 24h y usa defaults embebidos si no hay red.
- Mantén `skipWaiting` activo para que las nuevas versiones de SW se apliquen al reabrir la app.

