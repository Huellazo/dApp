const fs = require('fs');
const path = require('path');

let QRCode;
try {
  QRCode = require('qrcode');
} catch (e) {
  try {
    QRCode = require(path.join(__dirname, '../mobile/node_modules/qrcode'));
  } catch (err) {
    QRCode = null;
  }
}

const ARTIFACTS_DIR = '/home/m4r10/.gemini/antigravity-ide/brain/0c98b43c-8fa1-4280-b2a0-edf120ed26af';

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata';

// Presets for Solana Blink & Piñata Recompensa QR Codes (100% Serverless)
const BLINK_PRESETS = [
  {
    id: 'cerro_minas',
    name: 'Zona Arqueológica Cerro de las Minas',
    poiId: 'poi3',
    reward: 100,
    category: 'culture',
    dark: '#1D2A44',
    light: '#FAF9F6',
    accent: '#E07A5F',
    description: 'Piñata Recompensa (+100 HZ) y Reclamo vía Solana Blink',
    blinkUrl: `https://dial.to/devnet?action=solana-action:${encodeURIComponent(GITHUB_RAW_BASE + '/blink_action_cerro_minas.json')}`,
    placeUri: 'huellazo:pinata?id=poi3&reward=100',
  },
  {
    id: 'yukunitza',
    name: 'Mirador de Cristal Yukunitzá',
    poiId: 'poi4',
    reward: 90,
    category: 'nature',
    dark: '#112211',
    light: '#81B29A',
    accent: '#F2CC8F',
    description: 'Piñata Ecoturística (+90 HZ) y Solana Blink en Redes Sociales',
    blinkUrl: `https://dial.to/devnet?action=solana-action:${encodeURIComponent(GITHUB_RAW_BASE + '/blink_action_yukunitza.json')}`,
    placeUri: 'huellazo:pinata?id=poi4&reward=90',
  },
  {
    id: 'jaguarcito_nuine',
    name: 'Jaguarcito Ñuiñe Legendario',
    poiId: 'poi101',
    reward: 150,
    category: 'legendary',
    dark: '#2A0845',
    light: '#F2CC8F',
    accent: '#E07A5F',
    description: 'Piñata Mística Legendaria (+150 HZ)',
    blinkUrl: `https://dial.to/devnet?action=solana-action:${encodeURIComponent(GITHUB_RAW_BASE + '/blink_action_jaguarcito_nuine.json')}`,
    placeUri: 'huellazo:pinata?id=poi101&reward=150',
  },
  {
    id: 'cafe_petirrojo_craft',
    name: 'Café Petirrojo (Blink Comercial)',
    poiId: 'craft_cafe',
    reward: 55,
    category: 'gastronomy',
    dark: '#3D405B',
    light: '#FAF9F6',
    accent: '#81B29A',
    description: 'Blink Comercial para Compra de Café Artesanal en Solana',
    blinkUrl: `https://dial.to/devnet?action=solana-action:${encodeURIComponent(GITHUB_RAW_BASE + '/blink_action_cafe_petirrojo.json')}`,
    placeUri: 'solana:KLVFn69o3w9pvKNsza3YJtyszf8e1E5GCDByxeRhVzg?amount=0.025&label=Caf%C3%A9%20Petirrojo&message=Pago%20de%20Consumo',
  },
];

async function main() {
  console.log('\n================================================================');
  console.log('☀️ GENERADOR DE QRs PARA RECLAMO cNFT Y SOLANA BLINKS HUELLAZO ☀️');
  console.log('================================================================\n');

  const outputDir = path.join(process.cwd(), 'qrcodes', 'blinks');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const preset of BLINK_PRESETS) {
    console.log(`📍 Procesando: \x1b[33m${preset.name}\x1b[0m`);
    console.log(`   🔗 Enlace Solana Blink: \x1b[36m${preset.blinkUrl}\x1b[0m`);
    console.log(`   🏷️ URI de Reclamo Directo: \x1b[35m${preset.placeUri}\x1b[0m`);

    const filenameBase = `blink_${preset.id}`;
    const svgBlinkPath = path.join(outputDir, `${filenameBase}_social.svg`);
    const pngBlinkPath = path.join(outputDir, `${filenameBase}_social.png`);
    const artifactPath = path.join(ARTIFACTS_DIR, `${filenameBase}_qr.png`);

    if (QRCode) {
      // 1. Generate SVG for Social Blink Share
      const svgContent = await QRCode.toString(preset.blinkUrl, {
        type: 'svg',
        color: { dark: preset.dark, light: preset.light },
        margin: 3,
      });
      fs.writeFileSync(svgBlinkPath, svgContent);

      // 2. Generate PNG for local preview & Artifact
      await QRCode.toFile(pngBlinkPath, preset.blinkUrl, {
        color: { dark: preset.dark, light: preset.light },
        margin: 3,
        width: 600,
      });

      // Copy PNG to artifacts directory for visual preview
      if (fs.existsSync(ARTIFACTS_DIR)) {
        fs.copyFileSync(pngBlinkPath, artifactPath);
      }

      console.log(`   ✅ Guardado SVG: ${svgBlinkPath}`);
      console.log(`   ✅ Guardado PNG: ${pngBlinkPath}\n`);
    } else {
      console.log(`   ⚠️ Módulo 'qrcode' no cargado, revisa las URIs arriba.\n`);
    }
  }

  console.log('✨ ¡Generación de QRs de Solana Blinks y Reclamos cNFT completada!');
}

main().catch(console.error);
