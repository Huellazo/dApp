export interface POIWithGeofence {
  id: string;
  name: string;
  category: string;
  coords: [number, number]; // [lng, lat]
  address: string;
  rewardPoints: number;
  rewardStamp?: string;
  image?: string;
  distanceMeters: number;
  isClaimable: boolean;
}

/**
 * Fórmula Haversine en TypeScript puro para calcular distancia en metros
 */
export function calculateDistanceMeters(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lng1, lat1] = coords1;
  const [lng2, lat2] = coords2;

  const R = 6371000; // Radio de la Tierra en metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Evalúa el estado de la geocerca para una lista de POIs en relación a las coordenadas del usuario
 */
export function checkGeofenceStatus(
  userCoords: [number, number],
  pois: Array<{
    id: string;
    name: string;
    category: string;
    coords: [number, number];
    address: string;
    rewardPoints: number;
    rewardStamp?: string;
    image?: string;
  }>,
  geofenceRadiusMeters = 50
): POIWithGeofence[] {
  return pois
    .map((poi) => {
      const distanceMeters = calculateDistanceMeters(userCoords, poi.coords);
      return {
        ...poi,
        distanceMeters,
        isClaimable: distanceMeters <= geofenceRadiusMeters,
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
