export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceMXN: number;
  discountHZ?: number;
  isPopular?: boolean;
}

export interface LockedStamp {
  id: string;
  title: string;
  location: string;
  zone: 'huajuapan' | 'cdmx';
  image: any;
  hint: string;
  rewardPoints: number;
  style?: string;
}

export const MOCK_USER = {
  name: 'Mario Explorador Mixteco',
  publicKey: '7XbN...9QkP',
  balanceHuellazos: 1450,
  passportLevel: 4,
  businessesSupported: 18,
  weeklyRank: 1,
  avatarUrl: require('@/assets/images/profile_wallet.png'),
  nfts: [
    {
      id: 'jaguarcito_nuine',
      title: 'Jaguarcito Ñuiñe',
      location: 'Cerro de las Minas, Huajuapan',
      image: require('@/assets/images/nfts/nft_jaguarcito_nuiñe.png'),
      date: '2026-05-12T10:30:00Z',
      style: 'chromatic'
    },
    {
      id: 'sol_mixteca',
      title: 'Sol de la Mixteca',
      location: 'Mirador Yukunitzá, Huajuapan',
      image: require('@/assets/images/nfts/nft_sol_mixteca.png'),
      date: '2026-05-15T14:15:00Z',
      style: 'metallic'
    },
    {
      id: 'jarabe_mixteco',
      title: 'Maestro Jarabe Mixteco',
      location: 'Parque Independencia, Huajuapan',
      image: require('@/assets/images/nfts/nft_jarabe_mixteco.png'),
      date: '2026-06-01T20:00:00Z'
    },
    {
      id: 'guaje_oro',
      title: 'Guaje de Oro',
      location: 'Mercado Zaragoza, Huajuapan',
      image: require('@/assets/images/nfts/nft_guaje_oro.png'),
      date: '2026-06-10T12:00:00Z'
    },
    {
      id: 'xochimilco',
      title: 'Trajinera de Xochimilco',
      location: 'Canales de Xochimilco, CDMX',
      image: require('@/assets/images/nfts/nft_xochimilco.png'),
      date: '2026-07-01T11:00:00Z',
      style: 'chromatic'
    },
    {
      id: 'luchador',
      title: 'Santo del Ring',
      location: 'Arena México, CDMX',
      image: require('@/assets/images/nfts/nft_luchador.png'),
      date: '2026-07-10T19:30:00Z',
      style: 'metallic'
    },
    {
      id: 'eagle',
      title: 'Águila Real Sagrada',
      location: 'Templo Mayor, CDMX',
      image: require('@/assets/images/nfts/nft_eagle.png'),
      date: '2026-07-18T16:00:00Z'
    },
    {
      id: 'alebrije',
      title: 'Alebrije Fantástico',
      location: 'Museo de Arte Popular, CDMX',
      image: require('@/assets/images/nfts/nft_alebrije.png'),
      date: '2026-08-05T13:20:00Z',
      style: 'chromatic'
    },
    {
      id: 'mitote_mixteco',
      title: 'Mitote y Máscara Mixteca',
      location: 'Casa de la Cultura, Huajuapan',
      image: require('@/assets/images/nfts/nft_mitote_mixteco.png'),
      date: '2026-08-06T15:00:00Z',
      style: 'chromatic'
    },
    {
      id: 'mole_caderas',
      title: 'Cazuela de Mole de Caderas',
      location: 'Fonda Julita, Huajuapan de León',
      image: require('@/assets/images/nfts/nft_mole_caderas.png'),
      date: '2026-08-08T14:30:00Z',
      style: 'metallic'
    },
    {
      id: 'pitaya_sagrada',
      title: 'Pitaya Sagrada de la Mixteca',
      location: 'Mercado Zaragoza, Huajuapan',
      image: require('@/assets/images/nfts/nft_pitaya_sagrada.png'),
      date: '2026-08-10T11:20:00Z',
      style: 'chromatic'
    },
    {
      id: 'pulque_mixteco',
      title: 'Jícara de Pulque Tradicional',
      location: 'La Casa de Humo, Huajuapan',
      image: require('@/assets/images/nfts/nft_pulque_mixteco.png'),
      date: '2026-08-12T17:45:00Z'
    },
    {
      id: 'pyramid',
      title: 'Pirámides del Cerro de las Minas',
      location: 'Zona Arqueológica, Huajuapan',
      image: require('@/assets/images/nfts/tourism_pyramid.png'),
      date: '2026-08-14T09:15:00Z',
      style: 'metallic'
    },
    {
      id: 'pottery',
      title: 'Alfarería Prehispánica Ñuiñe',
      location: 'MUREH - Museo Regional, Huajuapan',
      image: require('@/assets/images/nfts/workshop_pottery.png'),
      date: '2026-08-15T16:00:00Z'
    },
    {
      id: 'taco',
      title: 'Taco de Barbacoa de Chivo',
      location: 'Mercado Porfirio Díaz, Huajuapan',
      image: require('@/assets/images/nfts/business_taco.png'),
      date: '2026-08-16T12:30:00Z'
    },
    {
      id: 'cerro_minas',
      title: 'Zona Arqueológica Cerro de las Minas',
      location: 'Huajuapan de León, Oaxaca',
      image: require('@/assets/images/huajuapan/huajuapan_cerro_minas.png'),
      date: '2026-08-18T10:00:00Z'
    },
    {
      id: 'catedral_huajuapan',
      title: 'Catedral de El Señor de los Corazones',
      location: 'Centro Histórico, Huajuapan',
      image: require('@/assets/images/huajuapan/huajuapan_catedral.png'),
      date: '2026-08-19T12:00:00Z'
    },
    {
      id: 'mirador_yukunitza',
      title: 'Mirador de Cristal Yukunitzá',
      location: 'Cerro Yukunitzá, Huajuapan',
      image: require('@/assets/images/huajuapan/huajuapan_mirador_yukunitza.png'),
      date: '2026-08-20T18:00:00Z'
    },
    {
      id: 'cafe_petirrojo',
      title: 'Cafetería Petirrojo',
      location: 'Colonia Centro, Huajuapan',
      image: require('@/assets/images/huajuapan/huajuapan_cafe_petirrojo.png'),
      date: '2026-08-21T09:30:00Z'
    },
    {
      id: 'casa_humo',
      title: 'La Casa de Humo',
      location: 'Huajuapan de León, Oaxaca',
      image: require('@/assets/images/huajuapan/huajuapan_casa_humo.png'),
      date: '2026-08-21T14:00:00Z'
    },
    {
      id: 'fonda_julita',
      title: 'Fonda Julita - Cocina Mixteca',
      location: 'Centro, Huajuapan de León',
      image: require('@/assets/images/huajuapan/huajuapan_fonda_julita.png'),
      date: '2026-08-21T16:15:00Z'
    }
  ]
};

export const MOCK_LOCKED_STAMPS: LockedStamp[] = [
  {
    id: 'ls-chapultepec',
    title: 'Bosque Sagrado de Chapultepec',
    location: 'Bosque de Chapultepec, CDMX',
    zone: 'cdmx',
    image: require('@/assets/images/nfts/tourism_chapultepec.png'),
    hint: 'Recorre el Lago Mayor de Chapultepec y escanea tu huella.',
    rewardPoints: 90
  }
];

export const MOCK_QUESTS = [
  {
    id: 'q1',
    title: 'Ruta del Sol y la Historia Ñuiñe',
    description: 'Recorre la cuna prehispánica e histórica de Huajuapan visitando sus monumentos sagrados y murales heroicos.',
    pois: ['poi1', 'poi3', 'poi5', 'poi9', 'poi10'],
    progress: 3,
    rewardMultiplier: 2.0,
    nftReward: 'Trofeo Guardián Ñuiñe de Huajuapan'
  },
  {
    id: 'q2',
    title: 'Ruta del Sabor Mixteco',
    description: 'Degusta el mejor Chileajo, Mole de Caderas, machucadas y café de altura en los comercios locales aliados.',
    pois: ['poi2', 'poi4', 'poi8', 'poi18', 'poi22'],
    progress: 3,
    rewardMultiplier: 1.5,
    nftReward: 'Insignia Mole de Caderas'
  },
  {
    id: 'q3',
    title: 'Ruta del Ecoturismo & Vistas de la Mixteca',
    description: 'Explora el Mirador de Cristal, el Paseo de las Campanas y la emblemática Presa de Yosocuta.',
    pois: ['poi6', 'poi13', 'poi14', 'poi15'],
    progress: 1,
    rewardMultiplier: 1.8,
    nftReward: 'Insignia Explorador de la Mixteca'
  }
];

export const MOCK_FLASH_DEALS = [
  {
    id: 'fd1',
    businessId: 'poi2',
    businessName: 'Café y Letras Huajuapan',
    title: '2x1 en Café Pluma de Hidalgo',
    discount: '50% OFF',
    expiresIn: '2h 15m',
    costHZ: 20
  },
  {
    id: 'fd2',
    businessId: 'poi4',
    businessName: 'Fonda Julita - Cocina Mixteca',
    title: '20% OFF en Chileajo Tradicional o Mole de Caderas',
    discount: '20% OFF',
    expiresIn: '4h 45m',
    costHZ: 30
  },
  {
    id: 'fd3',
    businessId: 'poi8',
    businessName: 'Cafetería Petirrojo',
    title: 'Latte Artesanal + Waffle por 15 HZ',
    discount: '30% OFF',
    expiresIn: '1h 30m',
    costHZ: 15
  },
  {
    id: 'fd4',
    businessId: 'poi18',
    businessName: 'La Casa de Humo',
    title: 'Orden de Machucadas Tradicionales + Agua por 10 HZ',
    discount: '25% OFF',
    expiresIn: '3h 10m',
    costHZ: 10
  },
  {
    id: 'fd5',
    businessId: 'poi22',
    businessName: 'La Antigua Restaurant-Bar',
    title: 'Cena Bajo los Portales con 15% OFF',
    discount: '15% OFF',
    expiresIn: '5h 00m',
    costHZ: 25
  }
];

export const MOCK_POIS = [
  // --- HISTORIA Y ARQUEOLOGÍA ---
  {
    id: 'poi1',
    name: 'Zona Arqueológica Cerro de las Minas',
    description: 'Único centro rector de la cultura Ñuiñe (400 a.C. - 800 d.C.) abierto al público. Escanea el código en la cima para ganar 100 $HUELLAZOS.',
    coordinates: { latitude: 17.8183, longitude: -97.7850 },
    reward: 100,
    nftReward: 'Sticker Arqueológico Ñuiñe',
    type: 'Sitio Arqueológico',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_cerro_minas.png'), 
    layoutStyle: 'square',
    rating: 4.9,
    distanceKm: 1.2,
    features: ['Vistas Panorámicas', 'Guías Locales', 'Pirámides Ñuiñe', 'Entrada Libre'],
    duration: '2 horas',
    price: 'Gratuito',
    address: 'Col. Santa Teresa, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi3',
    name: 'Catedral de San Juan Bautista',
    description: 'Majestuoso templo neoclásico del siglo XVIII que alberga los restos del General Antonio de León y la venerada imagen del Señor de los Corazones.',
    coordinates: { latitude: 17.8070, longitude: -97.7758 },
    reward: 80,
    nftReward: 'Sticker Catedral Histórica',
    type: 'Monumento Histórico',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_catedral.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 0.1,
    features: ['Arquitectura Neoclásica', 'Historia de la Independencia', 'Acceso Libre'],
    duration: '1 hora',
    price: 'Gratuito',
    address: 'Calle Valerio Trujano S/N, Centro, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi5',
    name: 'MUREH - Museo Regional de Huajuapan',
    description: 'Museo insignia dedicado a preservar la rica historia arqueológica Ñuiñe, etnografía de la Mixteca Baja y memorias del heroico Sitio de Huajuapan de 1812.',
    coordinates: { latitude: 17.8080, longitude: -97.7765 },
    reward: 75,
    nftReward: 'Insignia MUREH Cultura Mixteca',
    type: 'Museo y Cultura',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_mureh.png'),
    layoutStyle: 'square',
    rating: 4.7,
    distanceKm: 0.4,
    features: ['Piezas Prehispánicas Ñuiñe', 'Códices', 'Exposiciones de Arte', 'Guías'],
    duration: '1.5 horas',
    price: 'Donación voluntaria',
    address: 'Calle Nuyoó N° 24, Centro, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi9',
    name: 'Palacio Municipal y Murales Históricos',
    description: 'Sede del gobierno municipal que resguarda imponentes frescos al óleo del maestro José Luis García, narrando el mito mixteco de la creación y el Sitio de 1812.',
    coordinates: { latitude: 17.8072, longitude: -97.7761 },
    reward: 70,
    nftReward: 'Sticker Muralista Mixteco',
    type: 'Arte & Historia',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_palacio_municipal.png'),
    layoutStyle: 'banner',
    rating: 4.8,
    distanceKm: 0.2,
    features: ['Murales de Arte', 'Historia de Oaxaca', 'Entrada Libre'],
    duration: '45 min',
    price: 'Gratuito',
    address: 'Portal Zaragoza S/N, Centro, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi10',
    name: 'Casa de la Pólvora (Sitio de 1812)',
    description: 'Baluarte histórico que sirvió como depósito militar de pólvora durante el cerco patriota de 111 días conducido por el Gral. Antonio de León y el Cura Morelos.',
    coordinates: { latitude: 17.8095, longitude: -97.7780 },
    reward: 65,
    type: 'Monumento de la Independencia',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_casa_polvora.png'),
    layoutStyle: 'square',
    rating: 4.6,
    distanceKm: 0.7,
    features: ['Sitio de 1812', 'Historia Militar', 'Monumento Histórico'],
    duration: '45 min',
    price: 'Gratuito',
    address: 'Barrio de San José, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi11',
    name: 'Casa de la Cultura Antonio Martínez Corro',
    description: 'Centro cultural donde se imparte y difunde la danza emblemática del Jarabe Mixteco y talleres artísticos de grabado, alfarería y música tradicional.',
    coordinates: { latitude: 17.8065, longitude: -97.7745 },
    reward: 70,
    type: 'Centro Cultural & Danza',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_casa_cultura.png'),
    layoutStyle: 'square',
    rating: 4.8,
    distanceKm: 0.5,
    features: ['Jarabe Mixteco', 'Talleres de Arte', 'Exposiciones'],
    duration: '1 hora',
    price: 'Gratuito',
    address: 'Calle Heroico Colegio Militar S/N, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi12',
    name: 'Plaza de la Danza y Kiosco Parque Independencia',
    description: 'Corazón social de Huajuapan rodeado de arcos y jacarandas. Resguarda el monumento al Gral. Antonio de León y el busto de José López Alavés.',
    coordinates: { latitude: 17.8073, longitude: -97.7759 },
    reward: 60,
    type: 'Plaza Pública & Tradición',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_kiosco_parque.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 0.1,
    features: ['Kiosco Tradicional', 'Nieves de Garrafa', 'Eventos Culturales'],
    duration: '1 hora',
    price: 'Libre',
    address: 'Parque Independencia, Centro, Huajuapan de León, Oaxaca'
  },

  // --- NATURALEZA Y ECOTURISMO ---
  {
    id: 'poi6',
    name: 'Mirador de Cristal Cerro de Yukunitzá',
    description: 'Impresionante plataforma suspendida de cristal con vista panorámica de 360° de la ciudad y el atardecer del semi-desierto mixteco.',
    coordinates: { latitude: 17.8150, longitude: -97.7680 },
    reward: 90,
    nftReward: 'Sticker Mirador Yukunitzá',
    type: 'Ecoturismo y Mirador',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_mirador_yukunitza.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 2.1,
    features: ['Piso de Cristal', 'Senderismo', 'Fotografía', 'Vista Panorámica'],
    duration: '2 horas',
    price: 'Gratuito',
    address: 'Cerro de Yukunitzá, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi13',
    name: 'Paseo de las Campanas y Estalactitas',
    description: 'Parque de aventura natural con formaciones rocosas únicas de estalactitas, tirolesa extrema sobre el cañón y senderos rodeados de cactáceas.',
    coordinates: { latitude: 17.8210, longitude: -97.7700 },
    reward: 85,
    type: 'Aventura & Grutas',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_paseo_campanas.png'),
    layoutStyle: 'square',
    rating: 4.7,
    distanceKm: 2.8,
    features: ['Tirolesa', 'Estalactitas', 'Senderismo de Aventura'],
    duration: '2.5 horas',
    price: '$50 MXN',
    address: 'Camino a las Campanas, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi14',
    name: 'Presa de San Francisco Yosocuta',
    description: 'Hermoso embalse de agua rodeado de montañas mixtecas. Ideal para paseos guiados en lancha, pesquería de mojarra y comer en palapas al borde del agua.',
    coordinates: { latitude: 17.7550, longitude: -97.8500 },
    reward: 95,
    nftReward: 'Sticker Presa Yosocuta',
    type: 'Ecoturismo & Pesca',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_presa_yosocuta.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 12.0,
    features: ['Paseos en Lancha', 'Mojarra al Gusto', 'Palapas', 'Pesca'],
    duration: '3.5 horas',
    price: 'Entrada Libre',
    address: 'San Francisco Yosocuta, Huajuapan de León, Oaxaca'
  },
  {
    id: 'poi15',
    name: 'Parque Ecológico Riberas del Río Mixteco',
    description: 'Reserva natural ajardinada a la orilla del Río Mixteco. Cuenta con pistas de jogging, ciclopista y arbolado de ahuehuetes centenarios.',
    coordinates: { latitude: 17.8020, longitude: -97.7730 },
    reward: 60,
    type: 'Parque Ecológico & Río',
    category: 'tourism',
    image: require('@/assets/images/huajuapan/huajuapan_rio_mixteco.png'),
    layoutStyle: 'square',
    rating: 4.6,
    distanceKm: 1.1,
    features: ['Río Mixteco', 'Ahuehuetes Centenarios', 'Ciclopista', 'Picnic'],
    duration: '1.5 horas',
    price: 'Gratuito',
    address: 'Riberas del Río Mixteco, Huajuapan de León, Oaxaca'
  },

  // --- MERCADOS TRADICIONALES ---
  {
    id: 'poi7',
    name: 'Mercado Municipal Zaragoza',
    description: 'Corazón comercial de Huajuapan. Encuentra pitayas de temporada, quesillos frescos, pan de yema, alaches y artesanías mixtecas.',
    coordinates: { latitude: 17.8062, longitude: -97.7770 },
    reward: 60,
    type: 'Mercado de Artesanías y Alimentos',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_mercado_zaragoza.png'),
    layoutStyle: 'square',
    rating: 4.8,
    distanceKm: 0.5,
    features: ['Productos de la Región', 'Pitayas', 'Artesanías', 'Gastronomía Local'],
    duration: '1 hora',
    price: 'Libre',
    address: 'Calle Zaragoza S/N, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-mz-1', name: 'Nieve Artesanal de Pitaya o Tuna', description: 'Nieve de garrafa elaborada con frutos silvestres mixtecos.', priceMXN: 35, discountHZ: 5, isPopular: true },
      { id: 'm-mz-2', name: 'Quesillo Criollo Mixteco (500g)', description: 'Queso oaxaqueño fresco producido artesanalmente en los Valles.', priceMXN: 75, discountHZ: 10, isPopular: true },
      { id: 'm-mz-3', name: 'Pan de Yema Tradicional', description: 'Pieza de pan suave artesanal estilo Huajuapan.', priceMXN: 20, discountHZ: 5 }
    ]
  },
  {
    id: 'poi16',
    name: 'Mercado Porfirio Díaz (1812)',
    description: 'El mercado más antiguo de la ciudad fundado tras el Sitio de 1812. Famoso por su venta de hierbas curativas, cecina y barbacoa de chivo.',
    coordinates: { latitude: 17.8078, longitude: -97.7782 },
    reward: 55,
    type: 'Mercado Histórico',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_mercado_porfirio.png'),
    layoutStyle: 'square',
    rating: 4.7,
    distanceKm: 0.6,
    features: ['Barbacoa de Chivo', 'Hierbas Medicinales', 'Cecina Tradicional'],
    duration: '1 hora',
    price: 'Libre',
    address: 'Calle Porfirio Díaz S/N, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-mpd-1', name: 'Taco de Barbacoa de Chivo', description: 'Servido con salsa borracha de chile pasilla y tortillas a mano.', priceMXN: 30, discountHZ: 5, isPopular: true },
      { id: 'm-mpd-2', name: 'Kilogramo de Cecina Enchilada', description: 'Corte magro de cerdo adobado artesanalmente.', priceMXN: 210, discountHZ: 25 }
    ]
  },
  {
    id: 'poi17',
    name: 'Mercado Benito Juárez (Comedores)',
    description: 'Famoso centro gastronómico de comedores populares en la planta alta. El mejor lugar para almorzar picaditas, caldo de chivo y aguas frescas.',
    coordinates: { latitude: 17.8055, longitude: -97.7750 },
    reward: 50,
    type: 'Comedores Populares',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_mercado_juarez.png'),
    layoutStyle: 'banner',
    rating: 4.8,
    distanceKm: 0.4,
    features: ['Comedores Populares', 'Picaditas', 'Aguas Frescas', 'Económico'],
    duration: '1 hora',
    price: '$40 - $110 MXN',
    address: 'Calle Benito Juárez S/N, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-mbj-1', name: 'Orden de Memelas de Asiento (3 pzas)', description: 'Con salsa verde o roja y queso fresco de cesto.', priceMXN: 50, discountHZ: 8, isPopular: true },
      { id: 'm-mbj-2', name: 'Caldo de Pollo Mixteco con Verduras', description: 'Servido con epazote silvestre y tortillas calientes.', priceMXN: 70, discountHZ: 10 }
    ]
  },

  // --- GASTRONOMÍA Y RESTAURANTES ---
  {
    id: 'poi4',
    name: 'Fonda Julita - Cocina Mixteca',
    description: 'Auténtica gastronomía mixteca en Huajuapan. Especialistas en el famoso Mole de Caderas, Chileajo de cerdo y tamales nejos tradicionales.',
    coordinates: { latitude: 17.8068, longitude: -97.7762 },
    reward: 50,
    type: 'Restaurante Tradicional',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_fonda_julita.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 0.2,
    features: ['Mole de Caderas', 'Chileajo', 'Comida Tradicional', 'Acepta HZ'],
    duration: '1.5 horas',
    price: '$60 - $220 MXN',
    address: 'Calle Nuyoó N° 12, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-fj-1', name: 'Mole de Caderas Tradicional (Temporada)', description: 'Espinazo y cadera de chivo guisado con pepita de guaje y chile costeño.', priceMXN: 220, discountHZ: 30, isPopular: true },
      { id: 'm-fj-2', name: 'Chileajo de Cerdo Oaxaqueño', description: 'Costilla de cerdo en mole espeso de chile guajillo, ancho y ajo frito.', priceMXN: 130, discountHZ: 20, isPopular: true },
      { id: 'm-fj-3', name: 'Tamales Nejos con Mole Negro', description: 'Orden de 2 tamales tradicionales cenizos bañados en mole oaxaqueño.', priceMXN: 60, discountHZ: 10 },
      { id: 'm-fj-4', name: 'Picaditas de Asiento y Queso Serrano', description: 'Tres picaditas de masa criolla con asiento y salsa martajada.', priceMXN: 70, discountHZ: 10 }
    ]
  },
  {
    id: 'poi18',
    name: 'La Casa de Humo (Sabor Casero)',
    description: 'Icónica fonda tradicional con estufa de leña y comales de barro. Reconocida por preparar las auténticas machucadas de maíz y cecina recién hecha.',
    coordinates: { latitude: 17.8088, longitude: -97.7740 },
    reward: 55,
    type: 'Cocina de Leña & Fonda',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_casa_humo.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 0.3,
    features: ['Comal de Leña', 'Machucadas', 'Cecina Enchilada', 'Comida Casera'],
    duration: '1 hora',
    price: '$50 - $140 MXN',
    address: 'Calle Isabel la Católica N° 18, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-cdh-1', name: 'Machucadas Mixtecas con Salsa de Molcajete', description: 'Masa de maíz criollo palmeada a la leña con asiento y queso fresco.', priceMXN: 55, discountHZ: 10, isPopular: true },
      { id: 'm-cdh-2', name: 'Plato Huajuapense (Tasajo + Cecina + Chiles)', description: 'Servido con frijoles refritos y nopalitos asados.', priceMXN: 140, discountHZ: 20, isPopular: true }
    ]
  },
  {
    id: 'poi19',
    name: 'El 20 Asador Oaxaqueño',
    description: 'Restaurante especial de carnes asadas al carbón servidas en brazeros tradicionales de barro con tasajo de hebra, chorizo mixteco y guacamole.',
    coordinates: { latitude: 17.8060, longitude: -97.7790 },
    reward: 60,
    type: 'Asador & Parrilla Oaxaqueña',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_20_asador.png'),
    layoutStyle: 'square',
    rating: 4.8,
    distanceKm: 0.6,
    features: ['Brazeros de Barro', 'Tasajo de Hebra', 'Cortes Regionales', 'WiFi'],
    duration: '1.5 horas',
    price: '$120 - $280 MXN',
    address: 'Av. 20 de Noviembre N° 45, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-e20-1', name: 'Brazero Mixto Oaxaqueño (2 personas)', description: 'Tasajo, cecina, chorizo criollo, cebollitas cambray y frijoles charros.', priceMXN: 280, discountHZ: 35, isPopular: true },
      { id: 'm-e20-2', name: 'Tlayuda Especial con Tasajo', description: 'Tlayuda gigante untada de asiento con quesillo fundido.', priceMXN: 130, discountHZ: 20, isPopular: true }
    ]
  },
  {
    id: 'poi20',
    name: 'Restaurante Las Palmas',
    description: 'Restaurante familiar tradicional famoso por su buffet dominical de antojitos oaxaqueños, mole negro y excelente atención en el centro.',
    coordinates: { latitude: 17.8071, longitude: -97.7750 },
    reward: 50,
    type: 'Restaurante Familiar & Buffet',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_las_palmas.png'),
    layoutStyle: 'square',
    rating: 4.7,
    distanceKm: 0.2,
    features: ['Buffet Dominical', 'Mole Negro', 'Ambiente Familiar'],
    duration: '1.5 horas',
    price: '$90 - $210 MXN',
    address: 'Calle Tapia N° 10, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-lp-1', name: 'Buffet Tradicional Oaxaqueño', description: 'Acceso ilimitado a guisados regionales, memelas, jugos y café.', priceMXN: 180, discountHZ: 25, isPopular: true },
      { id: 'm-lp-2', name: 'Pechuga a la Oaxaqueña rellena de Quesillo', description: 'Bañada en salsa de flor de calabaza.', priceMXN: 140, discountHZ: 20 }
    ]
  },
  {
    id: 'poi21',
    name: 'El Canto de los Grillos',
    description: 'Propuesta gastronómica contemporánea de autor que fusiona ingredientes autóctonos de la Mixteca (pitaya, guaje, chiles secos) con técnicas modernas.',
    coordinates: { latitude: 17.8090, longitude: -97.7760 },
    reward: 65,
    type: 'Cocina de Autor Mixteca',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_canto_grillos.png'),
    layoutStyle: 'square',
    rating: 4.9,
    distanceKm: 0.4,
    features: ['Cocina de Autor', 'Maridaje Mezcalero', 'Diseño Elegante'],
    duration: '2 horas',
    price: '$150 - $350 MXN',
    address: 'Calle Trujano N° 32, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-cdg-1', name: 'Costilla de Cerdo en Glaseado de Pitaya', description: 'Acompañada de puré de camote amarillo y ensalada orgánica.', priceMXN: 210, discountHZ: 30, isPopular: true },
      { id: 'm-cdg-2', name: 'Crema de Guaje con Crostini de Quesillo', description: 'Entrada tibia sazonada con finas hierbas regionales.', priceMXN: 95, discountHZ: 15 }
    ]
  },

  // --- CAFETERÍAS Y BISTRÓS ---
  {
    id: 'poi2',
    name: 'Café y Letras Huajuapan',
    description: 'Disfruta de café artesanal de Pluma de Hidalgo y repostería oaxaqueña con la mejor vista cultural del centro histórico de Huajuapan.',
    coordinates: { latitude: 17.8075, longitude: -97.7760 },
    reward: 50,
    type: 'Cafetería Cultural',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_cafe_letras.png'),
    layoutStyle: 'square',
    rating: 4.8,
    distanceKm: 0.3,
    features: ['Café Gourmet', 'Libros', 'WiFi', 'Descuentos HZ'],
    duration: '1 hora',
    price: '$35 - $95 MXN',
    address: 'Portal Zaragoza N° 5, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-cyl-1', name: 'Café Pluma de Hidalgo (Americano)', description: 'Grano de café oaxaqueño de altura con tostado medio artesanal.', priceMXN: 38, discountHZ: 10, isPopular: true },
      { id: 'm-cyl-2', name: 'Cappuccino de Canela & Chocolate', description: 'Espresso con leche cremada y espolvoreado de canela mixteca.', priceMXN: 50, discountHZ: 12 },
      { id: 'm-cyl-3', name: 'Pan de Yema Tradicional con Chocolate', description: 'Pieza de pan dulce tradicional horneado con leña.', priceMXN: 45, discountHZ: 10, isPopular: true },
      { id: 'm-cyl-4', name: 'Ensalada Mixteca con Quesillo', description: 'Mezcla de lechugas orgánicas, jitomate criollo y quesillo fresco.', priceMXN: 80, discountHZ: 15 }
    ]
  },
  {
    id: 'poi8',
    name: 'Cafetería Petirrojo',
    description: 'Famosa cafetería y bistro en Huajuapan con ambiente acogedor. Destaca por sus cafés de especialidad, desayunos completos, waffles artesanales y pastas gourmet.',
    coordinates: { latitude: 17.8082, longitude: -97.7752 },
    reward: 55,
    type: 'Cafetería & Bistro',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_cafe_petirrojo.png'),
    layoutStyle: 'banner',
    rating: 4.9,
    distanceKm: 0.4,
    features: ['Café Especialidad', 'Desayunos completos', 'Waffles & Pastas', 'WiFi', 'Acepta HZ'],
    duration: '1 hora',
    price: '$35 - $130 MXN',
    address: 'Guerrero N° 8, Col. Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-pet-1', name: 'Espresso / Americano Petirrojo', description: 'Café de grano oaxaqueño con extracción perfecta y aroma balanceado.', priceMXN: 35, discountHZ: 8, isPopular: true },
      { id: 'm-pet-2', name: 'Latte Artesanal Vainilla', description: 'Espresso doble con leche cremada y jarabe de vainilla natural.', priceMXN: 55, discountHZ: 12, isPopular: true },
      { id: 'm-pet-3', name: 'Waffles Tradicionales con Fruta & Miel', description: 'Waffles crujientes con fresas, plátano y miel pura de abeja.', priceMXN: 85, discountHZ: 15, isPopular: true },
      { id: 'm-pet-4', name: 'Sándwich Gourmet Pechuga & Quesillo', description: 'Pan artesanal con pechuga empanizada, quesillo fundido y aguacate.', priceMXN: 95, discountHZ: 20 },
      { id: 'm-pet-5', name: 'Pasta Alfredo con Pollo a la Plancha', description: 'Pasta con salsa cremosa de queso parmesano y pechuga sazonada.', priceMXN: 130, discountHZ: 25 }
    ]
  },
  {
    id: 'poi22',
    name: 'La Antigua Restaurant-Café-Bar',
    description: 'Casona colonial histórica bajo los portales del centro. Ideal para disfrutar copas de vino o café artesanal al aire libre observando el Parque Independencia.',
    coordinates: { latitude: 17.8074, longitude: -97.7763 },
    reward: 60,
    type: 'Café-Bar Historico',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_la_antigua.png'),
    layoutStyle: 'banner',
    rating: 4.8,
    distanceKm: 0.2,
    features: ['Terrazas en Portales', 'Café & Vino', 'Música en Vivo'],
    duration: '1.5 horas',
    price: '$50 - $180 MXN',
    address: 'Portal Zaragoza N° 12, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-la-1', name: 'Café Irlandés con Mezcal Oaxaqueño', description: 'Espresso doble con toque de mezcal artesanal de pechuga y crema.', priceMXN: 75, discountHZ: 15, isPopular: true },
      { id: 'm-la-2', name: 'Tabla de Quesos Regionales y Frutos Secos', description: 'Acompañada de pan horneado en casa.', priceMXN: 160, discountHZ: 20 }
    ]
  },
  {
    id: 'poi23',
    name: 'Vainilla Café & Libros',
    description: 'Cafetería de diseño contemporáneo y tranquilo ambiente. Ofrece repostería fina casera, tisanas frutales, barra de espresso y rincón de lectura.',
    coordinates: { latitude: 17.8085, longitude: -97.7735 },
    reward: 50,
    type: 'Cafetería & Repostería',
    category: 'business',
    image: require('@/assets/images/huajuapan/huajuapan_vainilla_cafe.png'),
    layoutStyle: 'square',
    rating: 4.7,
    distanceKm: 0.5,
    features: ['Repostería Artesanal', 'Espacio de Lectura', 'Tisanas Frutales', 'WiFi'],
    duration: '1 hora',
    price: '$35 - $85 MXN',
    address: 'Calle Madero N° 28, Centro, Huajuapan de León, Oaxaca',
    menu: [
      { id: 'm-vc-1', name: 'Tisana Frutal de la Mixteca (Jarra)', description: 'Infusión natural de zarzamora, manzana y flores.', priceMXN: 50, discountHZ: 10, isPopular: true },
      { id: 'm-vc-2', name: 'Tartaleta de Frutos Rojos y Queso', description: 'Masa sablee crujiente rellena de crema de queso.', priceMXN: 60, discountHZ: 10 }
    ]
  }
];
