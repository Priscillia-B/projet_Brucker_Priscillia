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
