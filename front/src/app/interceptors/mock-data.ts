import { Pollution } from '../models/pollution';

export const MOCK_POLLUTIONS: Pollution[] = [
  {
    id: 1,
    titre: 'Déchets plastiques sur la plage',
    type: 'Plastique',
    description: 'Bouteilles et sacs abandonnés sur le sable.',
    date: '2024-05-12',
    lieu: 'Plage du Prado, Marseille',
    latitude: 43.2767,
    longitude: 5.3725,
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800'
  },
  {
    id: 2,
    titre: 'Déversement suspect',
    type: 'Chimique',
    description: "Liquide verdâtre s'écoulant d'une canalisation.",
    date: '2024-06-20',
    lieu: 'Le Rhône, Lyon',
    latitude: 45.75,
    longitude: 4.85
  },
  {
    id: 3,
    titre: 'Dépôt de gravats',
    type: 'Dépôt sauvage',
    description: 'Gravats de chantier jetés en forêt.',
    date: '2024-07-05',
    lieu: 'Forêt de Fontainebleau',
    latitude: 48.4047,
    longitude: 2.7016
  },
  {
    id: 4,
    titre: 'Sacs plastiques flottant dans le port',
    type: 'Eau',
    description: 'Une dizaine de sacs et films plastiques dérivent entre les bateaux, près du quai.',
    date: '2024-08-22',
    lieu: 'Vieux-Port, Marseille',
    latitude: 43.2951,
    longitude: 5.374,
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800'
  },
  {
    id: 5,
    titre: "Fumées noires d'une cheminée d'usine",
    type: 'Air',
    description: "Panache de fumée noire et odeur âcre observés en fin de journée, plusieurs jours d'affilée.",
    date: '2024-09-14',
    lieu: 'Zone industrielle, Fos-sur-Mer',
    latitude: 43.4378,
    longitude: 4.9447
  }
];
