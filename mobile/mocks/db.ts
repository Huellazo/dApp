export const MOCK_USER = {
  name: 'Mario Explorer',
  publicKey: '7XbN...9QkP',
  balanceHuellazos: 1450,
  passportLevel: 4,
  businessesSupported: 12,
  weeklyRank: 4,
  avatarUrl: require('@/assets/images/profile_wallet.png'),
  nfts: [
    {
      id: '1',
      title: 'Eagle Warrior',
      location: 'Templo Mayor',
      image: require('@/assets/images/nft_eagle.png'),
      date: '2026-05-12T10:30:00Z'
    },
    {
      id: '2',
      title: 'Xochimilco Explorer',
      location: 'Trajineras',
      image: require('@/assets/images/nft_xochimilco.png'),
      date: '2026-05-15T14:15:00Z'
    },
    {
      id: '3',
      title: 'Lucha Libre Legend',
      location: 'Arena México',
      image: require('@/assets/images/nft_luchador.png'),
      date: '2026-06-01T20:00:00Z'
    },
    {
      id: '4',
      title: 'Alebrije Tamer',
      location: 'Coyoacán Market',
      image: require('@/assets/images/nft_alebrije.png'),
      date: '2026-06-10T12:00:00Z'
    }
  ]
};

export const MOCK_QUESTS = [
  {
    id: 'q1',
    title: 'Ruta Imperial',
    description: 'Visit the historical castles and museums of the city center.',
    pois: ['poi1', 'poi3'],
    progress: 1, // 1 out of 2 completed
    rewardMultiplier: 2.0,
    nftReward: 'Imperial Route Champion'
  }
];

export const MOCK_FLASH_DEALS = [
  {
    id: 'fd1',
    businessId: 'poi2',
    businessName: 'Don Porfirio Coffee',
    title: '2x1 in Americanos',
    discount: '50% OFF',
    expiresIn: '2h 15m',
    costHZ: 20
  }
];

export const MOCK_POIS = [
  {
    id: 'poi1',
    name: 'Chapultepec Castle',
    description: 'National Museum of History. Located at the top of Chapulín Hill, it is the only royal castle in Latin America. Scan the QR at the main entrance to earn 50 $HUELLAZOS.',
    coordinates: { latitude: 19.4204, longitude: -99.1819 },
    reward: 50,
    nftReward: 'Imperial Castle Badge',
    type: 'historical',
    category: 'tourism',
    image: require('@/assets/images/tourism_chapultepec.png'), 
    layoutStyle: 'square',
    rating: 4.9,
    distanceKm: 0.8,
    features: ['Accessible', 'Restrooms', 'Guided Tours', 'Panoramic Views'],
    duration: '3 hours',
    price: '$90 MXN',
    address: 'Bosque de Chapultepec I Secc, 11100 Mexico City'
  },
  {
    id: 'poi2',
    name: 'Don Porfirio Coffee',
    description: 'Enjoy traditional Mexican coffee with the best view of the Palace of Fine Arts. Use your $HUELLAZOS for discounts.',
    coordinates: { latitude: 19.4352, longitude: -99.1412 },
    reward: 15,
    type: 'cafe',
    category: 'business',
    image: require('@/assets/images/business_taco.png'),
    layoutStyle: 'square',
    rating: 4.8,
    distanceKm: 1.2,
    features: ['Coffee', 'Discounts', 'WiFi', 'Scenic View'],
    duration: '1 hour',
    price: 'Varies',
    address: 'Av. Juárez 14, Centro Histórico, Mexico City'
  },
  {
    id: 'poi3',
    name: 'Templo Mayor',
    description: 'Main temple of the Mexica people in their capital city of Tenochtitlan. Uncover ancient secrets.',
    coordinates: { latitude: 19.4349, longitude: -99.1314 },
    reward: 60,
    nftReward: 'Mexica Explorer Stamp',
    type: 'historical',
    category: 'tourism',
    image: require('@/assets/images/tourism_pyramid.png'),
    layoutStyle: 'banner',
    rating: 4.7,
    distanceKm: 2.5,
    features: ['Museum', 'Outdoors', 'History'],
    duration: '2 hours',
    price: '$90 MXN',
    address: 'Seminario 8, Centro Histórico, Mexico City'
  },
  {
    id: 'poi4',
    name: 'Coyoacán Market',
    description: 'Vibrant local market known for traditional food and crafts. Spend your $HUELLAZOS here!',
    coordinates: { latitude: 19.3496, longitude: -99.1626 },
    reward: 25,
    type: 'commerce',
    category: 'business',
    image: require('@/assets/images/negocio2.png'),
    layoutStyle: 'banner',
    rating: 4.6,
    distanceKm: 8.4,
    features: ['Food', 'Crafts', 'Local Business'],
    duration: '1.5 hours',
    price: 'Free Entry',
    address: 'Ignacio Allende s/n, Coyoacán, Mexico City'
  },
  {
    id: 'poi5',
    name: 'Frida Kahlo Museum',
    description: 'The Blue House, historic art museum dedicated to the life and work of Mexican artist Frida Kahlo.',
    coordinates: { latitude: 19.3551, longitude: -99.1622 },
    reward: 45,
    type: 'cultural',
    category: 'tourism',
    image: require('@/assets/images/negocio3.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 8.6,
    features: ['Art', 'Museum', 'Accessible'],
    duration: '2 hours',
    price: '$250 MXN',
    address: 'Londres 247, Del Carmen, Coyoacán, Mexico City'
  },
  {
    id: 'poi6',
    name: 'La Ciudadela Artisans',
    description: 'Traditional Mexican handicrafts market. Perfect for souvenirs, supports local artisans.',
    coordinates: { latitude: 19.4300, longitude: -99.1500 },
    reward: 10,
    type: 'crafts',
    category: 'business',
    image: require('@/assets/images/workshop_pottery.png'),
    layoutStyle: 'square',
    rating: 4.5,
    distanceKm: 3.1,
    features: ['Shopping', 'Souvenirs', 'Culture'],
    duration: '2 hours',
    price: 'Free Entry',
    address: 'Balderas S/N, Centro, Mexico City'
  }
];
