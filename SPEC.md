# SPEC.md – Especificación funcional viva

## Objetivo del sistema
Brindar acceso inmediato a servicios de emergencia SUSAMCO, con guía rápida de triage, contactos locales y educación de primeros auxilios, funcionando también offline y en móvil (PWA) con opción futura de publicación en tiendas.

## Personas / usuarios tipo
- Ciudadanos de Armstrong y alrededores que requieren asistencia médica o de seguridad.
- Familiares/cuidadores que actúan en nombre de un paciente.
- Personal de primera respuesta que necesita compartir la app.

## Casos de uso clave
- Llamar ambulancia con un tap (elige número local vs 107 según geofence).
- Autoevaluación rápida que recomienda acción (llamar, SMS con ubicación, WhatsApp, ver centros).
- Acceso directo a policía y bomberos con llamada.
- Consulta de centros y teléfonos útiles (SAMCO, monitoreo, etc.) con links a Maps y WhatsApp.
- Consumo de material educativo (pasos y video) para primeros auxilios.
- Uso offline: navegación básica y videos previamente cacheados.

## Requisitos funcionales
- Botón principal: `tel:` al número de ambulancia; cambia a local si dentro del radio configurado.
- Geolocalización con timeout 10s; si falla/deniega, usar 107 y mostrar aviso.
- Triage: selección de síntoma urgente/no urgente; muestra llamadas, SMS con ubicación, WhatsApp turnos, y link a centros.
- Centros: tarjetas con dirección, cómo llegar (Maps), llamadas y WhatsApp cuando aplica.
- Educación: grid de temas desde JSON; detalle muestra pasos y link a video desde Remote Config; si no hay video, indicar indisponible.
- Offline: servir `/offline.html` en navegaciones sin red; cache de páginas/estáticos y videos de Firebase Storage.
- Config remota: números, geofence y videos se actualizan vía Remote Config con caché de 24h en localStorage.
- Datos locales: Dexie DB con outbox; `sync()` sube pendientes a Firestore.

### Flujos y criterios de aceptación (según prototipo SUSAMCO)
- Inicio:
  - Botón rojo grande “LLAMAR A LA AMBULANCIA” (logo ambulancia) marca 462111; si geofence indica fuera de cobertura, usar 107.
  - Accesos directos cuadrados: autoevaluación, educación comunitaria, policía, bomberos, centros de atención y teléfonos útiles (este último en franja inferior, formato rectangular).
- Autoevaluación:
  - Preguntas fijas: (1) Dolor de pecho, (2) Dificultad para respirar, (3) Desmayo/pérdida de conciencia, (4) Accidente tránsito/doméstico, (5) Dolor abdominal leve/diarrea, (6) Dolor leve >1 semana, (7) Tos/resfrío/garganta.
  - Respuestas 1–4: llamar directamente al 462111; intentar compartir ubicación en tiempo real con SUSAMCO (tel/SMS/wa link con coords).
  - Respuestas 5–7: mostrar “parece que no es una urgencia” y ofrecer derivación a guardia/turnos (WhatsApp) o llamar ambulancia de todos modos.
- Policía: mostrar dirección y botón central para llamar al número configurado.
- Bomberos: botón central para llamar al número configurado.
- Educación comunitaria: lista de temas con info y video (cuando esté configurado):
  - RCP adultos, RCP niños, Atragantamiento (Heimlich), Convulsiones, Control de hemorragias, Quemaduras, Hipotensión/Desmayo, Botiquín básico domiciliario.
- Centros de atención y teléfonos útiles:
  - SAMCO Armstrong (guardia 24h) con dirección, botón “Cómo llegar” (Maps) y turno por WhatsApp.
  - Opción de incluir Centro de Monitoreo con datos equivalentes.

## Requisitos no funcionales
- Plataforma: Next.js 16 (App Router), React 18, PWA installable (manifest/theme/iconos).
- Rendimiento: carga rápida en móvil; caché estático y video para experiencia offline.
- Confiabilidad: fallback a defaults cuando falle Remote Config; usar número nacional si no hay ubicación.
- Accesibilidad: alto contraste (rojo primario, fondo claro) y tipografía Inter.
- Seguridad: claves Firebase públicas solo para servicios frontend; no almacenar secretos sensibles en cliente. Dependencias críticas fijadas con overrides y `patch-package` actualizado para mantener `npm audit` en 0.
- Compatibilidad: mobile-first; funciona en navegadores modernos y PWA en iOS/Android.
