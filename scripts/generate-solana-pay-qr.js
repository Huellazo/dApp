const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const DEFAULT_RECIPIENT = '8XbN77QkP11111111111111111111111111111111111';
const ARTIFACTS_DIR = '/home/m4r10/.gemini/antigravity-ide/brain/0c98b43c-8fa1-4280-b2a0-edf120ed26af';

// Neo-Brutalist Business Presets & Themes
const BUSINESS_PRESETS = [
  {
    category: 'cafe',
    dark: '#2D1B14',
    light: '#F2CC8F',
    accent: '#E07A5F',
    icon: '☕',
    keywords: ['cafe', 'café', 'petirrojo', 'capuchino', 'grano'],
  },
  {
    category: 'restaurant',
    dark: '#1B1B1B',
    light: '#FAF9F6',
    accent: '#E07A5F',
    icon: '🌮',
    keywords: ['fonda', 'humo', 'julita', 'restaurante', 'comida', 'taco', 'mole'],
  },
  {
    category: 'culture',
    dark: '#1D2A44',
    light: '#F4A261',
    accent: '#2A9D8F',
    icon: '🏛️',
    keywords: ['catedral', 'palacio', 'museo', 'letras', 'cerro'],
  },
  {
    category: 'nature',
    dark: '#112211',
    light: '#81B29A',
    accent: '#F2CC8F',
    icon: '🌲',
    keywords: ['mirador', 'yukunitza', 'yosocuta', 'presa', 'parque'],
  },
  {
    category: 'default',
    dark: '#1B1B1B',
    light: '#FAF9F6',
    accent: '#F2CC8F',
    icon: '⚡',
    keywords: [],
  },
];

function selectThemeForBusiness(nameStr) {
  const lower = nameStr.toLowerCase();
  for (const preset of BUSINESS_PRESETS) {
    if (preset.keywords.some((k) => lower.includes(k))) {
      return preset;
    }
  }
  // Fallback random selection from presets if generic
  return BUSINESS_PRESETS[Math.floor(Math.random() * (BUSINESS_PRESETS.length - 1))];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function generateBrutalistQrSvg(solanaPayUri, merchantLabel, theme) {
  if (!QRCode) return null;

  // Generate base QR SVG string
  const rawSvg = await QRCode.toString(solanaPayUri, {
    type: 'svg',
    color: {
      dark: theme.dark,
      light: theme.light,
    },
    margin: 3,
  });

  // Inject Central Brutalist Badge with Merchant Icon & Neo-Brutalist Frame
  const centerBadgeSvg = `
    <!-- Neo-Brutalist Drop Shadow Frame -->
    <rect x="180" y="180" width="150" height="150" fill="#1B1B1B" rx="16" />
    <rect x="174" y="174" width="150" height="150" fill="${theme.accent}" stroke="#1B1B1B" stroke-width="6" rx="16" />
    <circle cx="249" cy="249" r="50" fill="${theme.light}" stroke="#1B1B1B" stroke-width="5" />
    <text x="249" y="263" font-size="44" font-family="sans-serif" text-anchor="middle">${theme.icon}</text>
  `;

  // Insert badge before closing </svg>
  const svgWithBadge = rawSvg.replace('</svg>', `${centerBadgeSvg}</svg>`);
  return svgWithBadge;
}

async function main() {
  console.log('\n==========================================================');
  console.log('⚡ GENERADOR DE CÓDIGOS QR PERSONALIZADOS - SOLANA PAY ⚡');
  console.log('   Estilos Neo-Brutalistas Únicos por Comercio');
  console.log('==========================================================\n');

  const args = process.argv.slice(2);

  let label = args[0];
  let amountStr = args[1];
  let message = args[2];
  let recipient = args[3];

  if (!label) {
    label = await askQuestion('1. Nombre del Comercio (ej. Café Petirrojo): ') || 'Café Petirrojo Huajuapan';
  }
  if (!amountStr) {
    amountStr = await askQuestion('2. Monto a cobrar en SOL (ej. 0.035): ') || '0.035';
  }
  if (!message) {
    message = await askQuestion('3. Concepto o Mensaje (ej. Consumo Café & Pan): ') || 'Consumo de Café y Pan de Yema';
  }
  if (!recipient) {
    recipient = await askQuestion(`4. Monedero Solana Destino [Enter para por defecto]: `) || DEFAULT_RECIPIENT;
  }

  rl.close();

  const amount = parseFloat(amountStr) || 0.035;
  const memo = `HZ-${Date.now()}`;

  const theme = selectThemeForBusiness(label);
  const solanaPayUri = `solana:${recipient}?amount=${amount}&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}&memo=${encodeURIComponent(memo)}`;

  console.log('\n----------------------------------------------------------');
  console.log(`🎨 Tema Personalizado Seleccionado: \x1b[33m${theme.category.toUpperCase()}\x1b[0m (Icono: ${theme.icon})`);
  console.log(`📄 Solana Pay URI: \x1b[36m${solanaPayUri}\x1b[0m`);
  console.log('----------------------------------------------------------\n');

  const outputDir = path.join(process.cwd(), 'qrcodes');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const safeFilename = label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
  const pngPath = path.join(outputDir, `solana_pay_${safeFilename}.png`);
  const svgPath = path.join(outputDir, `solana_pay_${safeFilename}.svg`);

  if (QRCode) {
    try {
      // 1. Generate standard PNG
      await QRCode.toFile(pngPath, solanaPayUri, {
        color: {
          dark: theme.dark,
          light: theme.light,
        },
        width: 512,
        margin: 3,
      });

      // 2. Generate Stylized Brutalist SVG with Icon Badge
      const customSvg = await generateBrutalistQrSvg(solanaPayUri, label, theme);
      if (customSvg) {
        fs.writeFileSync(svgPath, customSvg, 'utf-8');
      }

      // Copy PNG to Artifacts Directory if present
      if (fs.existsSync(ARTIFACTS_DIR)) {
        const artifactPng = path.join(ARTIFACTS_DIR, `solana_pay_${safeFilename}.png`);
        fs.copyFileSync(pngPath, artifactPng);
      }

      console.log(`✅ ¡Código QR personalizado generado con éxito!`);
      console.log(`📁 PNG: \x1b[32m${pngPath}\x1b[0m`);
      console.log(`📁 SVG con Badge: \x1b[32m${svgPath}\x1b[0m\n`);
    } catch (err) {
      console.error('❌ Error al generar las imágenes QR:', err);
    }
  }
}

main();
