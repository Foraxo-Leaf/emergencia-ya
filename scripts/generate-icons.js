/**
 * Script para generar todos los iconos de la app a partir de los SVGs base.
 * Ejecutar con: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const PUBLIC_ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const ANDROID_RES_DIR = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

const BACKGROUND_COLOR = '#DC2626';

// Tamaños para Android mipmap
const ANDROID_ICON_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// Tamaños para PWA
const PWA_ICON_SIZES = [192, 512];

// Tamaños para splash screens Android
const ANDROID_SPLASH_SIZES = {
  'drawable-port-mdpi': { width: 320, height: 480 },
  'drawable-port-hdpi': { width: 480, height: 800 },
  'drawable-port-xhdpi': { width: 720, height: 1280 },
  'drawable-port-xxhdpi': { width: 1080, height: 1920 },
  'drawable-port-xxxhdpi': { width: 1440, height: 2560 },
  'drawable-land-mdpi': { width: 480, height: 320 },
  'drawable-land-hdpi': { width: 800, height: 480 },
  'drawable-land-xhdpi': { width: 1280, height: 720 },
  'drawable-land-xxhdpi': { width: 1920, height: 1080 },
  'drawable-land-xxxhdpi': { width: 2560, height: 1440 },
};

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generatePwaIcons() {
  console.log('📱 Generando iconos PWA...');
  await ensureDir(PUBLIC_ICONS_DIR);

  const iconSvg = fs.readFileSync(path.join(ASSETS_DIR, 'icon-base.svg'));

  for (const size of PWA_ICON_SIZES) {
    const outputPath = path.join(PUBLIC_ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`  ✓ ${outputPath}`);
  }

  // Generar favicon (32x32 en public/icons y copia en public/)
  const faviconPng = path.join(PUBLIC_ICONS_DIR, 'favicon.png');
  await sharp(iconSvg)
    .resize(32, 32)
    .png()
    .toFile(faviconPng);
  console.log(`  ✓ ${faviconPng}`);

  // Copiar favicon a public/ como .ico (navegadores lo esperan ahí)
  const faviconIco = path.join(__dirname, '..', 'public', 'favicon.ico');
  fs.copyFileSync(faviconPng, faviconIco);
  console.log(`  ✓ ${faviconIco}`);

  // Generar apple-touch-icon (180x180 para iOS)
  const appleTouchIcon = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
  await sharp(iconSvg)
    .resize(180, 180)
    .png()
    .toFile(appleTouchIcon);
  console.log(`  ✓ ${appleTouchIcon}`);
}

async function generateAndroidIcons() {
  console.log('🤖 Generando iconos Android...');

  const iconSvg = fs.readFileSync(path.join(ASSETS_DIR, 'icon-base.svg'));
  const foregroundSvg = fs.readFileSync(path.join(ASSETS_DIR, 'icon-foreground.svg'));

  for (const [folder, size] of Object.entries(ANDROID_ICON_SIZES)) {
    const outputDir = path.join(ANDROID_RES_DIR, folder);
    await ensureDir(outputDir);

    // Icono principal
    const iconPath = path.join(outputDir, 'ic_launcher.png');
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(iconPath);
    console.log(`  ✓ ${iconPath}`);

    // Icono redondo
    const roundPath = path.join(outputDir, 'ic_launcher_round.png');
    await sharp(iconSvg)
      .resize(size, size)
      .png()
      .toFile(roundPath);
    console.log(`  ✓ ${roundPath}`);

    // Foreground para adaptive icons (108dp con padding interno)
    const foregroundSize = Math.round(size * 1.5); // 108dp vs 72dp base
    const foregroundPath = path.join(outputDir, 'ic_launcher_foreground.png');
    await sharp(foregroundSvg)
      .resize(foregroundSize, foregroundSize)
      .extend({
        top: Math.round((foregroundSize - size) / 2),
        bottom: Math.round((foregroundSize - size) / 2),
        left: Math.round((foregroundSize - size) / 2),
        right: Math.round((foregroundSize - size) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .resize(foregroundSize, foregroundSize)
      .png()
      .toFile(foregroundPath);
    console.log(`  ✓ ${foregroundPath}`);
  }
}

async function generateCapacitorAssets() {
  console.log('📦 Generando assets para Capacitor...');

  const iconSvg = fs.readFileSync(path.join(ASSETS_DIR, 'icon-base.svg'));
  const foregroundSvg = fs.readFileSync(path.join(ASSETS_DIR, 'icon-foreground.svg'));
  const splashSvg = fs.readFileSync(path.join(ASSETS_DIR, 'splash-base.svg'));

  // icon.png (1024x1024) - requerido por @capacitor/assets
  const iconPath = path.join(ASSETS_DIR, 'icon.png');
  await sharp(iconSvg)
    .resize(1024, 1024)
    .png()
    .toFile(iconPath);
  console.log(`  ✓ ${iconPath}`);

  // icon-foreground.png (1024x1024)
  const foregroundPath = path.join(ASSETS_DIR, 'icon-foreground.png');
  await sharp(foregroundSvg)
    .resize(1024, 1024)
    .png()
    .toFile(foregroundPath);
  console.log(`  ✓ ${foregroundPath}`);

  // splash.png (2732x2732)
  const splashPath = path.join(ASSETS_DIR, 'splash.png');
  await sharp(splashSvg)
    .resize(2732, 2732)
    .png()
    .toFile(splashPath);
  console.log(`  ✓ ${splashPath}`);
}

async function generateSplashScreens() {
  console.log('🖼️ Generando splash screens Android...');

  const splashSvg = fs.readFileSync(path.join(ASSETS_DIR, 'splash-base.svg'));

  for (const [folder, dimensions] of Object.entries(ANDROID_SPLASH_SIZES)) {
    const outputDir = path.join(ANDROID_RES_DIR, folder);
    await ensureDir(outputDir);

    const splashPath = path.join(outputDir, 'splash.png');
    await sharp(splashSvg)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .png()
      .toFile(splashPath);
    console.log(`  ✓ ${splashPath}`);
  }

  // Splash en drawable/
  const drawablePath = path.join(ANDROID_RES_DIR, 'drawable', 'splash.png');
  await ensureDir(path.dirname(drawablePath));
  await sharp(splashSvg)
    .resize(480, 800, { fit: 'cover' })
    .png()
    .toFile(drawablePath);
  console.log(`  ✓ ${drawablePath}`);
}

async function main() {
  console.log('🎨 Generador de iconos para Emergencia Ya\n');

  try {
    await generateCapacitorAssets();
    await generatePwaIcons();
    await generateAndroidIcons();
    await generateSplashScreens();

    console.log('\n✅ ¡Todos los iconos generados exitosamente!');
    console.log('\nPróximos pasos:');
    console.log('  1. Revisa los iconos generados en assets/, public/icons/ y android/');
    console.log('  2. Si tienes @capacitor/assets instalado, ejecuta:');
    console.log('     npx capacitor-assets generate --iconBackgroundColor "#DC2626"');
    console.log('  3. Reconstruye la app: npm run build --webpack && npx cap sync android');
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
    process.exit(1);
  }
}

main();


