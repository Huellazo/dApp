/**
 * BlinkService — SOLID Single Responsibility Service for Solana Blinks & Actions
 * Supports ALL 22 cNFT stamps in Huellazo.
 * Uses jsDelivr CDN to serve JSON Action manifests and PNG images with 100% CORS compliance,
 * fixing 503 errors on Dialect (dial.to) and enabling social image previews on X/Twitter.
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

const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/m4r10/dApp@main/mobile';

export const ALL_HUELLAZO_BLINK_CATALOG: Record<string, BlinkMetadata> = {
  // --- LUGARES HISTÓRICOS Y TURÍSTICOS ---
  cerro_minas: {
    id: 'cerro_minas',
    title: 'Zona Arqueológica Cerro de las Minas',
    description: 'Estampa Digital del antiguo centro rector prehispánico de la cultura Ñuiñe.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'cerro_minas',
    rewardPoints: 100,
  },
  poi3: {
    id: 'cerro_minas',
    title: 'Zona Arqueológica Cerro de las Minas',
    description: 'Estampa Digital del antiguo centro rector prehispánico de la cultura Ñuiñe.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'poi3',
    rewardPoints: 100,
  },
  mirador_yukunitza: {
    id: 'mirador_yukunitza',
    title: 'Mirador de Cristal Yukunitzá',
    description: 'Estampa Digital ecoturística del espectacular Mirador Yukunitzá.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_mirador_yukunitza.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_yukunitza.json`,
    poiId: 'mirador_yukunitza',
    rewardPoints: 90,
  },
  poi4: {
    id: 'mirador_yukunitza',
    title: 'Mirador de Cristal Yukunitzá',
    description: 'Estampa Digital ecoturística del espectacular Mirador Yukunitzá.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_mirador_yukunitza.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_yukunitza.json`,
    poiId: 'poi4',
    rewardPoints: 90,
  },
  catedral_huajuapan: {
    id: 'catedral_huajuapan',
    title: 'Catedral de El Señor del Corazal',
    description: 'Templo histórico y corazón espiritual de Huajuapan de León.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_catedral.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/catedral_huajuapan.json`,
    poiId: 'catedral_huajuapan',
    rewardPoints: 80,
  },
  poi2: {
    id: 'catedral_huajuapan',
    title: 'Catedral de El Señor del Corazal',
    description: 'Templo histórico y corazón espiritual de Huajuapan de León.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_catedral.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/catedral_huajuapan.json`,
    poiId: 'poi2',
    rewardPoints: 80,
  },
  palacio_municipal: {
    id: 'palacio_municipal',
    title: 'Palacio Municipal de Huajuapan',
    description: 'Sede gubernamental histórica con murales mixtecos.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_palacio_municipal.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'palacio_municipal',
    rewardPoints: 50,
  },
  poi1: {
    id: 'palacio_municipal',
    title: 'Palacio Municipal de Huajuapan',
    description: 'Sede gubernamental histórica con murales mixtecos.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_palacio_municipal.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_cerro_minas.json`,
    poiId: 'poi1',
    rewardPoints: 50,
  },

  // --- ESTAMPAS LEGENDARIAS Y SIMBÓLICAS ---
  jaguarcito_nuine: {
    id: 'jaguarcito_nuine',
    title: 'Jaguarcito Ñuiñe Legendario',
    description: 'Gran guardián místico felino tallado en piedra de la cultura Ñuiñe.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_jaguarcito_nuine.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_jaguarcito_nuine.json`,
    poiId: 'jaguarcito_nuine',
    rewardPoints: 150,
  },
  poi101: {
    id: 'jaguarcito_nuine',
    title: 'Jaguarcito Ñuiñe Legendario',
    description: 'Gran guardián místico felino tallado en piedra de la cultura Ñuiñe.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_jaguarcito_nuine.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_jaguarcito_nuine.json`,
    poiId: 'poi101',
    rewardPoints: 150,
  },
  sol_mixteca: {
    id: 'sol_mixteca',
    title: 'Sol de la Mixteca',
    description: 'Resplandeciente disco solar prehispánico con jeroglíficos tradicionales.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_sol_mixteca.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/sol_mixteca.json`,
    poiId: 'sol_mixteca',
    rewardPoints: 120,
  },
  jarabe_mixteco: {
    id: 'jarabe_mixteco',
    title: 'Jarabe Mixteco',
    description: 'Baile folclórico representativo con la indumentaria mixteca tradicional.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_jarabe_mixteco.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/jarabe_mixteco.json`,
    poiId: 'jarabe_mixteco',
    rewardPoints: 110,
  },
  guaje_oro: {
    id: 'guaje_oro',
    title: 'Guaje de Oro Ancestral',
    description: 'Fruto sagrado dorado que dio nombre a la región de Huajuapan.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_guaje_oro.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/guaje_oro.json`,
    poiId: 'guaje_oro',
    rewardPoints: 130,
  },
  alebrije: {
    id: 'alebrije',
    title: 'Alebrije Místico',
    description: 'Criatura fantástica tallada en madera de copal con colores psicodélicos.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_jaguarcito_nuine.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/alebrije.json`,
    poiId: 'alebrije',
    rewardPoints: 115,
  },
  chapultepec: {
    id: 'chapultepec',
    title: 'Bosque de Chapultepec',
    description: 'Emblemático cerro y pulmón histórico.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/chapultepec.json`,
    poiId: 'chapultepec',
    rewardPoints: 85,
  },
  eagle: {
    id: 'eagle',
    title: 'Águila Real Guerrera',
    description: 'Símbolo patrio de fuerza y visión prehispánica.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_sol_mixteca.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/eagle.json`,
    poiId: 'eagle',
    rewardPoints: 125,
  },
  luchador: {
    id: 'luchador',
    title: 'Máscara del Enmascarado de Plata',
    description: 'Ícono del deporte popular y la cultura de la lucha libre.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_jarabe_mixteco.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/luchador.json`,
    poiId: 'luchador',
    rewardPoints: 95,
  },
  mitote_mixteco: {
    id: 'mitote_mixteco',
    title: 'Gran Mitote Mixteco',
    description: 'Celebración festiva ancestral de música y danza.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_jarabe_mixteco.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/mitote_mixteco.json`,
    poiId: 'mitote_mixteco',
    rewardPoints: 105,
  },
  pitaya_sagrada: {
    id: 'pitaya_sagrada',
    title: 'Pitaya Sagrada del Desierto',
    description: 'Fruto dulce exótico característico de las cactáceas mixtecas.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_guaje_oro.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/pitaya_sagrada.json`,
    poiId: 'pitaya_sagrada',
    rewardPoints: 75,
  },
  pottery: {
    id: 'pottery',
    title: 'Vasija de Barro Barroco',
    description: 'Alfarería artesanal modelada a mano por ceramistas tradicionales.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_guaje_oro.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/pottery.json`,
    poiId: 'pottery',
    rewardPoints: 70,
  },
  pulque_mixteco: {
    id: 'pulque_mixteco',
    title: 'Pulque Sagrado de Maguey',
    description: 'Bebida ritual de los dioses extraída del corazón del maguey.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/nfts/nft_sol_mixteca.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/pulque_mixteco.json`,
    poiId: 'pulque_mixteco',
    rewardPoints: 85,
  },
  pyramid: {
    id: 'pyramid',
    title: 'Pirámide de la Luna',
    description: 'Monumento arquitectónico prehispánico monumental.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/pyramid.json`,
    poiId: 'pyramid',
    rewardPoints: 110,
  },
  taco: {
    id: 'taco',
    title: 'Taco Tradicional de Asado',
    description: 'Manjar gastronómico en tortilla de maíz nixtamalizado.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_casa_humo.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/taco.json`,
    poiId: 'taco',
    rewardPoints: 45,
  },
  xochimilco: {
    id: 'xochimilco',
    title: 'Trajinera en Xochimilco',
    description: 'Embarcación artesanal entre jardines flotantes chinamperos.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_mirador_yukunitza.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/xochimilco.json`,
    poiId: 'xochimilco',
    rewardPoints: 90,
  },

  // --- GASTRONOMÍA Y COMERCIOS ---
  cafe_petirrojo: {
    id: 'cafe_petirrojo',
    title: 'Café de Especialidad Petirrojo',
    description: 'Cafetería artesanal de especialidad en Huajuapan de León.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_cafe_petirrojo.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/blink_action_cafe_petirrojo.json`,
    poiId: 'cafe_petirrojo',
    rewardPoints: 55,
  },
  casa_humo: {
    id: 'casa_humo',
    title: 'Restaurante Casa de Humo',
    description: 'Cocina tradicional mixteca de humo y asados artesanales.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_casa_humo.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/casa_humo.json`,
    poiId: 'casa_humo',
    rewardPoints: 60,
  },
  fonda_julita: {
    id: 'fonda_julita',
    title: 'Tradicional Fonda Julita',
    description: 'Sabor auténtico con mole de caderas y platillos típicos.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_fonda_julita.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/fonda_julita.json`,
    poiId: 'fonda_julita',
    rewardPoints: 65,
  },
  mole_caderas: {
    id: 'mole_caderas',
    title: 'Mole de Caderas Tradicional',
    description: 'Platillo gastronómico ritual mixteco de temporada.',
    imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_fonda_julita.png`,
    actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/mole_caderas.json`,
    poiId: 'mole_caderas',
    rewardPoints: 100,
  },
};

export class BlinkService {
  /**
   * Safe getter for ALL 22 stamp metadata in Huellazo
   */
  static getBlinkMetadata(poiId?: string): BlinkMetadata {
    if (poiId && ALL_HUELLAZO_BLINK_CATALOG[poiId]) {
      return ALL_HUELLAZO_BLINK_CATALOG[poiId];
    }
    // Dynamic Fallback generator if ID is unlisted
    const sanitizedId = (poiId || 'cerro_minas').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    return {
      id: sanitizedId,
      title: poiId ? `Estampa ${poiId}` : 'Zona Arqueológica Cerro de las Minas',
      description: 'Estampa Digital de Pasaporte Huellazo registrada en la red de Solana.',
      imageUrl: `${JSDELIVR_BASE}/assets/images/huajuapan/huajuapan_cerro_minas.png`,
      actionJsonUrl: `${JSDELIVR_BASE}/assets/metadata/${sanitizedId}.json`,
      poiId: poiId || 'cerro_minas',
      rewardPoints: 100,
    };
  }

  /**
   * Constructs CORS-compliant Dialect Blink URL via jsDelivr CDN (Prevents 503 errors)
   */
  static getDialectBlinkUrl(poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    return `https://dial.to/devnet?action=solana-action:${encodeURIComponent(meta.actionJsonUrl)}`;
  }

  /**
   * Generates a Twitter/X intent URL embedding the direct image link for social media card previews
   */
  static getTwitterShareUrl(stampTitle: string, poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    const dialectUrl = this.getDialectBlinkUrl(poiId);
    
    const tweetText = `¡Obtuve mi estampa digital de pasaporte "${stampTitle}" en Huellazo! ☀️\n\n🖼️ Imagen: ${meta.imageUrl}\n\nReclama la tuya en Solana con 1-clic:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(dialectUrl)}`;
  }

  /**
   * Generates a direct mobile app deep-link URI for scanning QR codes
   */
  static getDirectAppClaimUri(poiId?: string): string {
    const meta = this.getBlinkMetadata(poiId);
    return `huellazo:place?id=${meta.poiId}&name=${encodeURIComponent(meta.title)}&reward=${meta.rewardPoints}`;
  }
}
