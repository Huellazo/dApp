/**
 * BlinkService — SOLID Single Responsibility Service for Serverless Solana Blinks & Actions
 * Works 100% Client-Side without requiring a live remote backend server.
 * Uses GitHub CDN static action metadata fallbacks for Dialect/Twitter inspectors and
 * handles direct Web3 execution inside the Mobile App.
 */

export interface BlinkMetadata {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  staticActionUrl: string;
  poiId: string;
  rewardPoints: number;
}

// Open/Closed Catalog: Static Action URLs hosted on GitHub CDN for 100% uptime & zero backend dependency
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Huellazo/dApp/main/mobile';

const POI_BLINK_CATALOG: Record<string, BlinkMetadata> = {
  poi1: {
    id: 'palacio_municipal',
    title: 'Palacio Municipal de Huajuapan',
    description: 'Estampa Digital del Palacio Municipal en el corazón de Huajuapan de León.',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_palacio_municipal.png`,
    staticActionUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'poi1',
    rewardPoints: 50,
  },
  poi3: {
    id: 'cerro_minas',
    title: 'Zona Arqueológica Cerro de las Minas',
    description: 'Estampa Digital del antiguo centro rector prehispánico de la cultura Ñuiñe.',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    staticActionUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'poi3',
    rewardPoints: 100,
  },
  poi4: {
    id: 'yukunitza',
    title: 'Mirador de Cristal Yukunitzá',
    description: 'Estampa Digital ecoturística del espectacular Mirador Yukunitzá.',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_mirador_yukunitza.png`,
    staticActionUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_yukunitza.json`,
    poiId: 'poi4',
    rewardPoints: 90,
  },
  jaguarcito_nuine: {
    id: 'jaguarcito_nuine',
    title: 'Jaguarcito Ñuiñe Legendario',
    description: 'Gran guardián místico felino tallado en piedra de la cultura Ñuiñe.',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/nfts/nft_jaguarcito_nuine.png`,
    staticActionUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_jaguarcito_nuine.json`,
    poiId: 'jaguarcito_nuine',
    rewardPoints: 150,
  },
  cafe_petirrojo: {
    id: 'cafe_petirrojo',
    title: 'Café de Especialidad Petirrojo',
    description: 'Cafetería y bistro artesanal registrada en Huellazo.',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_cafe_petirrojo.png`,
    staticActionUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cafe_petirrojo.json`,
    poiId: 'cafe_petirrojo',
    rewardPoints: 55,
  },
};

export class BlinkService {
  /**
   * Retrieves Blink metadata for a specific POI ID
   */
  static getBlinkMetadata(poiId?: string): BlinkMetadata {
    const key = poiId && POI_BLINK_CATALOG[poiId] ? poiId : 'poi3';
    return POI_BLINK_CATALOG[key];
  }

  /**
   * Constructs the Dialect Blink URL pointing to GitHub CDN static action manifest
   * No backend server required! (100% Client-side / Serverless Architecture)
   */
  static getDialectBlinkUrl(poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    return `https://dial.to/devnet?action=solana-action:${encodeURIComponent(meta.staticActionUrl)}`;
  }

  /**
   * Generates a Twitter/X intent URL with direct image preview for social sharing
   */
  static getTwitterShareUrl(stampTitle: string, poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    const dialectUrl = this.getDialectBlinkUrl(poiId);
    
    const tweetText = `¡Obtuve mi estampa digital de pasaporte "${stampTitle}" en Huellazo! ☀️\n\n🖼️ Imagen: ${meta.imageUrl}\n\nReclama la tuya con 1-clic:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(dialectUrl)}`;
  }

  /**
   * Generates direct Mobile App deep link URI for scanning without server
   */
  static getDirectAppClaimUri(poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    return `huellazo:place?id=${meta.poiId}&name=${encodeURIComponent(meta.title)}&reward=${meta.rewardPoints}`;
  }
}
