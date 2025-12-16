# SPEC.md – Especificación funcional viva

## Objetivo del sistema
Brindar acceso inmediato a servicios de emergencia SUSAMCO, con guía rápida de triage, contactos locales y educación de primeros auxilios, funcionando también offline y en móvil (PWA + Capacitor) con opción de publicación en tiendas.

## Personas / usuarios tipo
- Ciudadanos de Armstrong y alrededores que requieren asistencia médica o de seguridad.
- Familiares/cuidadores que actúan en nombre de un paciente.
- Personal de primera respuesta que necesita compartir la app.

## Casos de uso clave
- Llamar ambulancia con un tap (elige número local vs número general `offline_ambulance_phone` según geofence).
- Autoevaluación rápida que recomienda acción (llamar, SMS con ubicación, WhatsApp, ver centros).
- Acceso directo a policía y bomberos con llamada.
- Consulta de centros y teléfonos útiles (SAMCO, monitoreo, etc.) con links a Maps y WhatsApp.
- Consumo de material educativo (pasos y video) para primeros auxilios.
- Uso offline: navegación básica y videos previamente cacheados.

## Requisitos funcionales
- Botón principal: `tel:` al número de ambulancia; cambia a local si dentro del radio configurado.
- Geolocalización con timeout 10s; si falla/deniega o está fuera del radio, usar `offline_ambulance_phone` y mostrar aviso.
- Permisos de ubicación: en apps nativas (Android/iOS) se solicitan proactivamente al abrir la app mediante `@capacitor/geolocation`; en web el navegador los solicita al usar la API.
- Triage: selección de síntoma urgente/no urgente; muestra llamadas, SMS con ubicación, WhatsApp turnos, y link a centros.
- Centros: tarjetas con dirección, cómo llegar (Maps), llamadas y WhatsApp cuando aplica.
- Policía/Bomberos/Monitoreo: teléfono conmutado por geofence (dentro: `*_phone`, fuera/sin ubicación: `offline_*_phone`).
- Educación: grid de temas desde JSON; detalle muestra pasos y link a video desde Remote Config (key `education_video_<slug_con_guiones_bajos>`, ej. `education_video_rcp_adultos`); si no hay video, indicar indisponible.
- Offline: servir `/offline` en navegaciones sin red; cache de páginas/estáticos y videos de Firebase Storage.
- Offline (tiendas / Capacitor): el bundle local (`out/`) debe abrir y permitir navegación básica **sin internet desde el primer arranque**. Contenido remoto (videos/Maps) requiere conectividad o precache previo.
- Config remota: números (locales y generales `offline_*`), geofence, videos y SMS (`samco_sms_phone`, `sms_help_body_template`) se actualizan vía Remote Config con caché de 24h en localStorage; si hay conectividad al iniciar (o cuando vuelve con `online`), se intenta un refresh forzado (1 vez por sesión) para aplicar cambios publicados sin esperar 24h.
- Datos locales: Dexie DB con outbox; `sync()` sube pendientes a Firestore.

### Flujos y criterios de aceptación (según prototipo SUSAMCO)
- Inicio:
  - Botón rojo grande “LLAMAR A LA AMBULANCIA” (logo ambulancia) marca `ambulance_phone` (ej: 462111); si geofence indica fuera de cobertura o no se pudo ubicar, usar `offline_ambulance_phone` (ej: 107).
  - Accesos directos cuadrados: autoevaluación, educación comunitaria, policía, bomberos, centros de atención y teléfonos útiles (este último en franja inferior, formato rectangular).
  - Banner/Logo de patrocinio (Fundación Nazareno Crucianelli): se muestra **solo en la parte superior** de la pantalla de inicio (no se repite al pie).
- Autoevaluación:
  - Preguntas fijas: (1) Dolor de pecho, (2) Dificultad para respirar, (3) Desmayo/pérdida de conciencia, (4) Accidente tránsito/doméstico, (5) Dolor abdominal leve/diarrea, (6) Dolor leve >1 semana, (7) Tos/resfrío/garganta.
  - Respuestas 1–4: llamar al número local si está dentro del radio (`ambulance_phone`) o al general si no (`offline_ambulance_phone`); compartir ubicación por SMS usando `samco_sms_phone` y `sms_help_body_template` (placeholders `{{mapsUrl}}/{{coords}}/{{lat}}/{{lon}}`).
  - Respuestas 5–7: mostrar “parece que no es una urgencia” y ofrecer derivación a guardia/turnos (WhatsApp) o llamar ambulancia de todos modos.
- Policía: mostrar dirección y botón central para llamar (dentro geofence: `police_phone`, fuera/sin ubicación: `offline_police_phone`).
- Bomberos: botón central para llamar (dentro geofence: `firefighters_phone`, fuera/sin ubicación: `offline_firefighters_phone`).
- Educación comunitaria: lista de temas con info y video (cuando esté configurado):
  - RCP adultos, RCP niños, Atragantamiento (Heimlich), Convulsiones, Control de hemorragias, Quemaduras, Hipotensión/Desmayo, Botiquín básico domiciliario.
- Centros de atención y teléfonos útiles:
  - SAMCO Armstrong (guardia 24h) con dirección, botón “Cómo llegar” (Maps) y turno por WhatsApp.
  - Opción de incluir Centro de Monitoreo con datos equivalentes.

## Requisitos no funcionales
- Plataforma: Next.js 16 (App Router), React 18, PWA installable (manifest/theme/iconos).
- Publicación en tiendas: empaquetado con Capacitor usando export estático (`out/`) para experiencia offline-first (Android build con Gradle requiere **JDK 17**).
- iOS/App Store: el empaquetado es análogo (Capacitor + bundle local), pero la compilación/firma requiere **macOS + Xcode** (TestFlight/App Store).
- Rendimiento: carga rápida en móvil; caché estático y video para experiencia offline.
- Confiabilidad: fallback a defaults cuando falle Remote Config; usar números generales `offline_*` si no hay ubicación y usar el último snapshot cacheado cuando no haya internet.
- Accesibilidad: alto contraste (rojo primario, fondo claro) y tipografía Inter.
- Branding: icono de app personalizado (ambulancia blanca sobre fondo rojo #DC2626) visible en PWA, Android y iOS; favicon y apple-touch-icon para instalación web.
- Seguridad: claves Firebase públicas solo para servicios frontend; no almacenar secretos sensibles en cliente. Dependencias críticas fijadas con overrides y `patch-package` actualizado para mantener `npm audit` en 0.
- Compatibilidad: mobile-first; funciona en navegadores modernos y PWA en iOS/Android.
