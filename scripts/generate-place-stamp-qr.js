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

const POIS = [
  { id: 'poi1', name: 'Palacio Municipal Huajuapan', reward: 50, category: 'culture' },
  { id: 'poi2', name: 'Catedral de Nuestra Señora de Guadalupe', reward: 50, category: 'culture' },
  { id: 'poi3', name: 'Cerro de las Minas - Zona Arqueológica', reward: 75, category: 'nature' },
  { id: 'poi4', name: 'Mirador Yukunitza', reward: 60, category: 'nature' },
  { id: 'poi5', name: 'Presa de Yosocuta', reward: 80, category: 'nature' },
  { id: 'poi6', name: 'Café Petirrojo Huajuapan', reward: 40, category: 'business' },
  { id: 'poi7', name: 'Casa del Humo Gastronomía', reward: 40, category: 'business' },
  { id: 'poi8', name: 'Fonda Julita Mixteca', reward: 40, category: 'business' },
];

async function main() {
  console.log('\n==========================================================');
  console.log('🌿 GENERADOR DE CÓDIGOS QR DE LUGARES Y ESTAMPAS HUELLAZO 🌿');
  console.log('==========================================================\n');

  const outputDir = path.join(process.cwd(), 'qrcodes', 'places');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const poi of POIS) {
    const placeUri = `huellazo:place?id=${poi.id}&name=${encodeURIComponent(poi.name)}&reward=${poi.reward}`;
    const filenameBase = poi.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
    const svgPath = path.join(outputDir, `${filenameBase}.svg`);

    console.log(`📍 Generando QR para: \x1b[33m${poi.name}\x1b[0m`);
    console.log(`   URI: \x1b[36m${placeUri}\x1b[0m`);

    if (QRCode) {
      const svgContent = await QRCode.toString(placeUri, {
        type: 'svg',
        color: { dark: '#1B1B1B', light: '#FAF9F6' },
        margin: 2,
      });
      fs.writeFileSync(svgPath, svgContent);
      console.log(`   Saved SVG: ${svgPath}\n`);
    } else {
      console.log(`   (qrcode module not loaded, URI printed above)\n`);
    }
  }

  console.log('✅ ¡Generación de QRs de lugares completada con éxito!');
}

main().catch(console.error);
