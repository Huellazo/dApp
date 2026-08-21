/**
 * Service to map Points of Interest (POIs) and stamps to their standard Metaplex JSON metadata URLs
 * hosted on GitHub Raw for Solana Devnet cNFT minting.
 */

export const POI_METADATA_MAP: Record<string, string> = {
  // Sitios Turísticos
  poi1: 'cerro_minas.json',
  poi3: 'catedral_huajuapan.json',
  poi5: 'jaguarcito_nuine.json',
  poi7: 'mirador_yukunitza.json',

  // Comercios Aliatos
  biz1: 'cafe_petirrojo.json',
  biz3: 'casa_humo.json',
  biz5: 'fonda_julita.json',

  // Estampas de Pasaporte Especiales
  jaguarcito_nuine: 'jaguarcito_nuine.json',
  sol_mixteca: 'sol_mixteca.json',
  jarabe_mixteco: 'jarabe_mixteco.json',
  guaje_oro: 'guaje_oro.json',
  catedral_huajuapan: 'catedral_huajuapan.json',
  cerro_minas: 'cerro_minas.json',
  mirador_yukunitza: 'mirador_yukunitza.json',
  cafe_petirrojo: 'cafe_petirrojo.json',
  casa_humo: 'casa_humo.json',
  fonda_julita: 'fonda_julita.json',
};

/**
 * Gets the full HTTP/HTTPS URL for a metadata JSON file.
 * If EXPO_PUBLIC_GITHUB_METADATA_BASE_URL is provided in .env, it uses that base URL.
 * Otherwise, falls back to the relative path or raw GitHub format.
 */
export function getMetadataJsonUrl(poiOrStampId: string, customRepoBaseUrl?: string): string {
  const filename = POI_METADATA_MAP[poiOrStampId] || `${poiOrStampId}.json`;
  
  const envBaseUrl = process.env.EXPO_PUBLIC_GITHUB_METADATA_BASE_URL;
  const baseUrl = customRepoBaseUrl || envBaseUrl;

  if (baseUrl) {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}/${filename}`;
  }

  // Fallback default structure
  return `https://raw.githubusercontent.com/Huellazo/dApp/main/mobile/assets/metadata/${filename}`;
}
