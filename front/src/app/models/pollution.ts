export interface Pollution {
  id?: number;
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  indice?: number; // indice de dangerosité (0 et plus)
}

export const POLLUTION_TYPES = ['Plastique', 'Chimique', 'Dépôt sauvage', 'Eau', 'Air', 'Autre'];

export const POLLUTION_TYPE_ICONS: Record<string, string> = {
  'Plastique': 'fa-bottle-water',
  'Chimique': 'fa-flask',
  'Dépôt sauvage': 'fa-dumpster',
  'Eau': 'fa-droplet',
  'Air': 'fa-wind',
  'Autre': 'fa-circle-question'
};

export function mapUrl(p: Pollution): string {
  return `https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=15/${p.latitude}/${p.longitude}`;
}

export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

export function getPollutionLevel(indice: number): PollutionLevel {
  if (indice <= 20) return 'Faible';
  if (indice <= 50) return 'Modérée';
  if (indice <= 100) return 'Élevée';
  return 'Dangereuse';
}
