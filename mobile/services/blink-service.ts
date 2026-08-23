/**
 * BlinkService — SOLID Single Responsibility Service for Solana Blinks & Piñata Rewards
 * Manages Piñata Mystery Rewards (+HZ Points) and GitHub-hosted media attachments.
 */

export interface BlinkMetadata {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  actionJsonUrl: string;
  poiId: string;
  rewardPoints: number;
}

// GitHub CDN Base URL for raw assets
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Huellazo/dApp/main/mobile';

export const ALL_HUELLAZO_BLINK_CATALOG: Record<string, BlinkMetadata> = {
  // --- LUGARES HISTÓRICOS Y TURÍSTICOS ---
  cerro_minas: {
    id: 'cerro_minas',
    title: 'Piñata Recompensa — Cerro de las Minas',
    description: '¡Rompe la Piñata mística prehispánica de la cultura Ñuiñe y reclama +100 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'cerro_minas',
    rewardPoints: 100,
  },
  poi3: {
    id: 'cerro_minas',
    title: 'Piñata Recompensa — Cerro de las Minas',
    description: '¡Rompe la Piñata mística prehispánica de la cultura Ñuiñe y reclama +100 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'poi3',
    rewardPoints: 100,
  },
  mirador_yukunitza: {
    id: 'mirador_yukunitza',
    title: 'Piñata Ecoturística — Mirador Yukunitzá',
    description: '¡Rompe la Piñata del Mirador de Cristal y gana +90 Puntos Huellazos ($HZ)!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_mirador_yukunitza.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_yukunitza.json`,
    poiId: 'mirador_yukunitza',
    rewardPoints: 90,
  },
  poi4: {
    id: 'mirador_yukunitza',
    title: 'Piñata Ecoturística — Mirador Yukunitzá',
    description: '¡Rompe la Piñata del Mirador de Cristal y gana +90 Puntos Huellazos ($HZ)!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_mirador_yukunitza.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_yukunitza.json`,
    poiId: 'poi4',
    rewardPoints: 90,
  },
  catedral_huajuapan: {
    id: 'catedral_huajuapan',
    title: 'Piñata Tradicional — Catedral de Huajuapan',
    description: '¡Rompe la Piñata del templo histórico de Huajuapan y reclama +80 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_catedral.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/catedral_huajuapan.json`,
    poiId: 'catedral_huajuapan',
    rewardPoints: 80,
  },
  poi2: {
    id: 'catedral_huajuapan',
    title: 'Piñata Tradicional — Catedral de Huajuapan',
    description: '¡Rompe la Piñata del templo histórico de Huajuapan y reclama +80 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_catedral.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/catedral_huajuapan.json`,
    poiId: 'poi2',
    rewardPoints: 80,
  },
  palacio_municipal: {
    id: 'palacio_municipal',
    title: 'Piñata Cívica — Palacio Municipal',
    description: '¡Rompe la Piñata en el corazón de Huajuapan de León y suma +50 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_palacio_municipal.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'palacio_municipal',
    rewardPoints: 50,
  },
  poi1: {
    id: 'palacio_municipal',
    title: 'Piñata Cívica — Palacio Municipal',
    description: '¡Rompe la Piñata en el corazón de Huajuapan de León y suma +50 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_palacio_municipal.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'poi1',
    rewardPoints: 50,
  },

  // --- RECOMPENSAS LEGENDARIAS Y SIMBÓLICAS ---
  jaguarcito_nuine: {
    id: 'jaguarcito_nuine',
    title: 'Piñata Mística — Jaguarcito Ñuiñe Legendario',
    description: '¡Libera la energía del guardián de piedra prehispánico y gana +150 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/nfts/nft_jaguarcito_nuine.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_jaguarcito_nuine.json`,
    poiId: 'jaguarcito_nuine',
    rewardPoints: 150,
  },
  poi101: {
    id: 'jaguarcito_nuine',
    title: 'Piñata Mística — Jaguarcito Ñuiñe Legendario',
    description: '¡Libera la energía del guardián de piedra prehispánico y gana +150 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/nfts/nft_jaguarcito_nuine.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_jaguarcito_nuine.json`,
    poiId: 'poi101',
    rewardPoints: 150,
  },
  sol_mixteca: {
    id: 'sol_mixteca',
    title: 'Piñata Solar — Sol de la Mixteca',
    description: '¡Resplandor ancestral con +120 Puntos Huellazos ($HZ)!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/nfts/nft_sol_mixteca.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/sol_mixteca.json`,
    poiId: 'sol_mixteca',
    rewardPoints: 120,
  },
  jarabe_mixteco: {
    id: 'jarabe_mixteco',
    title: 'Piñata Folclórica — Jarabe Mixteco',
    description: '¡Danza y festeja rompiendo la Piñata del Jarabe Mixteco con +110 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/nfts/nft_jarabe_mixteco.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/jarabe_mixteco.json`,
    poiId: 'jarabe_mixteco',
    rewardPoints: 110,
  },
  guaje_oro: {
    id: 'guaje_oro',
    title: 'Piñata Sagrada — Guaje de Oro',
    description: '¡Tesoro dorado ancestral con +130 $HZ de recompensa!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/nfts/nft_guaje_oro.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/guaje_oro.json`,
    poiId: 'guaje_oro',
    rewardPoints: 130,
  },

  // --- GASTRONOMÍA Y COMERCIOS ---
  cafe_petirrojo: {
    id: 'cafe_petirrojo',
    title: 'Blink Comercial — Café Petirrojo',
    description: 'Apoya al comercio artesanal comprando café de especialidad mixteco.',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_cafe_petirrojo.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cafe_petirrojo.json`,
    poiId: 'cafe_petirrojo',
    rewardPoints: 55,
  },
  casa_humo: {
    id: 'casa_humo',
    title: 'Piñata Gastronómica — Casa de Humo',
    description: '¡Rompe la Piñata del sabor tradicional y gana +60 $HZ!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_casa_humo.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/casa_humo.json`,
    poiId: 'casa_humo',
    rewardPoints: 60,
  },
  fonda_julita: {
    id: 'fonda_julita',
    title: 'Piñata Gastronómica — Fonda Julita',
    description: '¡Sabor auténtico con mole de caderas y +65 $HZ de premio!',
    imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_fonda_julita.png`,
    actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/fonda_julita.json`,
    poiId: 'fonda_julita',
    rewardPoints: 65,
  },
};

export class BlinkService {
  /**
   * Safe getter for ALL Piñata Blink metadata in Huellazo
   */
  static getBlinkMetadata(poiId?: string): BlinkMetadata {
    if (poiId && ALL_HUELLAZO_BLINK_CATALOG[poiId]) {
      return ALL_HUELLAZO_BLINK_CATALOG[poiId];
    }
    const sanitizedId = (poiId || 'cerro_minas').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    return {
      id: sanitizedId,
      title: poiId ? `Piñata Recompensa ${poiId}` : 'Piñata Recompensa — Cerro de las Minas',
      description: '¡Rompe la Piñata en la dApp Huellazo y reclama tus Puntos Huellazos ($HZ)!',
      imageUrl: `${GITHUB_RAW_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
      actionJsonUrl: `${GITHUB_RAW_BASE}/assets/metadata/blink_action_cerro_minas.json`,
      poiId: poiId || 'cerro_minas',
      rewardPoints: 100,
    };
  }

  /**
   * Constructs CORS-compliant Solana Action Link for Piñata Rewards
   */
  static getDialectBlinkUrl(poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    return `https://dial.to/devnet?action=solana-action:${encodeURIComponent(meta.actionJsonUrl)}`;
  }

  /**
   * Generates a Twitter/X intent URL explicitly attaching the direct GitHub Raw PNG image URL
   * so Twitter/X attaches and renders the image preview directly in the social post
   */
  static getTwitterShareUrl(stampTitle: string, poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    const dialectUrl = this.getDialectBlinkUrl(poiId);
    
    const tweetText = `¡Rompe la Piñata en la dApp Huellazo y reclama tus Puntos Huellazos ($HZ) de recompensa! 🪅☀️\n\n🖼️ Imagen: ${meta.imageUrl}\n\nReclama la tuya en Solana con 1-clic:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(dialectUrl)}`;
  }

  /**
   * Generates clean payload text for native sharing (WhatsApp, Messenger, iMessage)
   */
  static getNativeSharePayload(stampTitle: string, poiId?: string) {
    const meta = this.getBlinkMetadata(poiId);
    const dialectUrl = this.getDialectBlinkUrl(poiId);
    return {
      message: `¡Rompe la Piñata en la dApp Huellazo y reclama tus Puntos Huellazos ($HZ) de recompensa! 🪅☀️\n\n🖼️ Imagen: ${meta.imageUrl}\n\nReclama tus puntos en Solana:\n${dialectUrl}`,
      title: 'Piñata Recompensa Huellazo',
    };
  }

  /**
   * Generates a direct mobile app deep-link URI for 100% client-side QR Piñata scanning
   */
  static getDirectAppClaimUri(poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    return `huellazo:pinata?id=${meta.poiId}&title=${encodeURIComponent(meta.title)}&reward=${meta.rewardPoints}`;
  }
}
