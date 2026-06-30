const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE_ICON = path.join(__dirname, 'public', 'gambar', 'Ikon masjid2.png');
const ANDROID_RES = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

// Android adaptive icon sizes (foreground needs to be 108dp based)
const ICON_SIZES = {
  'mipmap-mdpi': { icon: 48, foreground: 108 },
  'mipmap-hdpi': { icon: 72, foreground: 162 },
  'mipmap-xhdpi': { icon: 96, foreground: 216 },
  'mipmap-xxhdpi': { icon: 144, foreground: 324 },
  'mipmap-xxxhdpi': { icon: 192, foreground: 432 },
};

// Splash screen sizes
const SPLASH_SIZES = {
  'drawable': { width: 480, height: 480 },
  'drawable-port-hdpi': { width: 480, height: 800 },
  'drawable-port-mdpi': { width: 320, height: 480 },
  'drawable-port-xhdpi': { width: 720, height: 1280 },
  'drawable-port-xxhdpi': { width: 960, height: 1600 },
  'drawable-port-xxxhdpi': { width: 1280, height: 1920 },
  'drawable-land-hdpi': { width: 800, height: 480 },
  'drawable-land-mdpi': { width: 480, height: 320 },
  'drawable-land-xhdpi': { width: 1280, height: 720 },
  'drawable-land-xxhdpi': { width: 1600, height: 960 },
  'drawable-land-xxxhdpi': { width: 1920, height: 1280 },
};

async function generateIcons() {
  console.log('🎨 Generating Android icons from:', SOURCE_ICON);

  for (const [folder, sizes] of Object.entries(ICON_SIZES)) {
    const dir = path.join(ANDROID_RES, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // ic_launcher.png — standard icon
    await sharp(SOURCE_ICON)
      .resize(sizes.icon, sizes.icon, { fit: 'contain', background: { r: 6, g: 78, b: 59, alpha: 1 } })
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // ic_launcher_round.png — round icon
    const roundMask = Buffer.from(
      `<svg width="${sizes.icon}" height="${sizes.icon}">
        <circle cx="${sizes.icon / 2}" cy="${sizes.icon / 2}" r="${sizes.icon / 2}" fill="white"/>
      </svg>`
    );
    await sharp(SOURCE_ICON)
      .resize(sizes.icon, sizes.icon, { fit: 'contain', background: { r: 6, g: 78, b: 59, alpha: 1 } })
      .composite([{ input: roundMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // ic_launcher_foreground.png — adaptive icon foreground
    // Logo centered with padding on transparent bg, at foreground size
    const padding = Math.round(sizes.foreground * 0.25);
    const logoSize = sizes.foreground - (padding * 2);
    const logoBuffer = await sharp(SOURCE_ICON)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: sizes.foreground,
        height: sizes.foreground,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: logoBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`  ✅ ${folder}: ${sizes.icon}px icon, ${sizes.foreground}px foreground`);
  }
}

async function generateSplashScreens() {
  console.log('\n🌊 Generating splash screens...');
  const EMERALD = { r: 6, g: 78, b: 59, alpha: 1 }; // #064E3B

  for (const [folder, size] of Object.entries(SPLASH_SIZES)) {
    const dir = path.join(ANDROID_RES, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Logo size = 30% of the smallest dimension
    const minDim = Math.min(size.width, size.height);
    const logoSize = Math.round(minDim * 0.3);

    const logoBuffer = await sharp(SOURCE_ICON)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size.width,
        height: size.height,
        channels: 4,
        background: EMERALD,
      },
    })
      .composite([{ input: logoBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(dir, 'splash.png'));

    console.log(`  ✅ ${folder}: ${size.width}x${size.height}`);
  }
}

async function main() {
  try {
    await generateIcons();
    await generateSplashScreens();
    console.log('\n🎉 All icons and splash screens generated successfully!');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

main();
