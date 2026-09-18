export type ProductCategory = 
  | 'TODOS'
  | 'VELAS'
  | 'DIFUSORES'
  | 'HOME_SPRAYS'
  | 'TEXTILES'
  | 'SETS';

export type OlfactoryFamily = 
  | 'Amaderado'
  | 'Cítrico'
  | 'Floral'
  | 'Verde & Herbal'
  | 'Especiado'
  | 'Gourmand'
  | 'Fresco & Acuático';

export interface OlfactoryPyramid {
  topNotes: string[];    // Salida (primeros 15 min)
  heartNotes: string[];  // Corazón (cuerpo del aroma)
  baseNotes: string[];   // Fondo (fijación y memoria)
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: 'VELAS' | 'DIFUSORES' | 'HOME_SPRAYS' | 'TEXTILES' | 'SETS';
  categoryLabel: string;
  aromaticFamily: OlfactoryFamily;
  mainNotes: string[];
  price: number; // Integer (ARS, e.g. 18500)
  sizeVolume: string; // e.g. "250g · 50hs de combustión limpia"
  shortStory: string;
  poeticDescription: string;
  feelsLike: string; // "A qué huele"
  intensity: number; // 1 to 5
  idealForRooms: string[];
  pyramid: OlfactoryPyramid;
  moodTags: string[];
  companionProductSlugs: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  stock: number;
  badge?: string;
  accentColor: string;
  imageBg: string;
  visualType: 'candle' | 'diffuser' | 'spray' | 'textile' | 'blend';
  images: string[];
}

export interface BundleItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  productsIncluded: string[];
  originalPrice: number;
  bundlePrice: number;
  discountPercent: number;
  tag: string;
  description: string;
  accentColor: string;
  badge: string;
}

export interface BotanicalIngredient {
  id: string;
  slug: string;
  name: string;
  latinName: string;
  originNote: string;
  family: OlfactoryFamily;
  description: string;
  benefits: string;
  matchingProductSlugs: string[];
  accentColor: string;
  iconName: string;
}

export interface MoodFilter {
  id: string;
  title: string;
  subtitle: string;
  quote: string;
  accentColor: string;
  matchingSlugs: string[];
}

export interface Review {
  id: string;
  quote: string;
  author: string;
  location: string;
  productName: string;
  stars: number;
  date: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod_vela_ambar_madera",
    slug: "vela-botanica-ambar-madera",
    name: "Vela Botánica Ámbar & Madera",
    category: "VELAS",
    categoryLabel: "Vela Aromática",
    aromaticFamily: "Amaderado",
    mainNotes: ["ámbar resinoso", "cedro del atlas", "vainilla ahumada"],
    price: 18500,
    sizeVolume: "250g · 50hs de combustión limpia",
    shortStory: "un living de madera después de la lluvia.",
    poeticDescription: "Inspirada en las tardes porteñas de otoño donde el tiempo se detiene entre libros y madera tibia. Vertida a mano en vaso de vidrio ámbar de botica con pabilo de madera natural que crepita suavemente como un fuego íntimo.",
    feelsLike: "madera tibia, papel viejo y una ventana abierta después de una tormenta de verano.",
    intensity: 4,
    idealForRooms: ["Living", "Biblioteca", "Dormitorio", "Atelier"],
    pyramid: {
      topNotes: ["Bergamota italiana", "Cáscara de naranja amarga"],
      heartNotes: ["Cedro del Atlas", "Cardamomo negro", "Jazmín salvaje"],
      baseNotes: ["Ámbar fósil", "Vainilla de Madagascar", "Resina de benjuí"]
    },
    moodTags: ["Refugio", "Calma", "Para leer", "Para una noche lenta", "Nostalgia"],
    companionProductSlugs: ["home-spray-bosque-humedo", "difusor-sandalo-higo"],
    isFeatured: true,
    isBestseller: true,
    stock: 14,
    badge: "MÁS ELEGIDO",
    accentColor: "#C87D38",
    imageBg: "#FDF5ED",
    visualType: "candle",
    images: ["/images/vela_ambar.jpg"]
  },
  {
    id: "prod_vela_lavanda_manzanilla",
    slug: "vela-lavanda-manzanilla",
    name: "Vela Lavanda & Manzanilla",
    category: "VELAS",
    categoryLabel: "Vela Aromática",
    aromaticFamily: "Verde & Herbal",
    mainNotes: ["lavanda silvestre", "flores de manzanilla", "hoja de higuera"],
    price: 17800,
    sizeVolume: "250g · 50hs de combustión limpia",
    shortStory: "un respiro hondo para soltar el día.",
    poeticDescription: "Lavanda recolectada en campos serranos con infusión calmante de flores de manzanilla dulce. La compañía perfecta para la mesa de luz antes del descanso, disipando la tensión acumulada.",
    feelsLike: "sábanas limpias de lino crudo, sol tibio de las cinco de la tarde y silencio.",
    intensity: 2,
    idealForRooms: ["Dormitorio", "Espacio de Meditación", "Baño de Inmersión"],
    pyramid: {
      topNotes: ["Lavanda provenzal", "Salvia clara"],
      heartNotes: ["Manzanilla dulce", "Neroli silvestre"],
      baseNotes: ["Haba tonka", "Almizcle blanco vegetal"]
    },
    moodTags: ["Calma", "Para bajar un cambio", "Para una noche lenta", "Refugio"],
    companionProductSlugs: ["home-spray-neroli-lino", "perfume-textil-velvet-rose"],
    isFeatured: false,
    isBestseller: true,
    stock: 9,
    badge: "RITUAL NOCTURNO",
    accentColor: "#8F9E84",
    imageBg: "#F2F5F0",
    visualType: "candle",
    images: ["/images/vela_lavanda.jpg"]
  },
  {
    id: "prod_vela_cedro_vainilla",
    slug: "vela-cedro-vainilla",
    name: "Vela Cedro & Vainilla",
    category: "VELAS",
    categoryLabel: "Vela Aromática",
    aromaticFamily: "Gourmand",
    mainNotes: ["cedro añejo", "vainilla bourbon", "pizca de tabaco rubio"],
    price: 18500,
    sizeVolume: "250g · 50hs de combustión limpia",
    shortStory: "la calidez de una charla que no tiene prisa.",
    poeticDescription: "Un equilibrio sublime entre la sobriedad terrosa del cedro y la dulzura aterciopelada de la vainilla bourbon. Notas que abrigan el espacio sin empalagar, evocando rincones bohemios de Buenos Aires.",
    feelsLike: "taza de café humeante en un rincón de San Telmo, bufanda de lana y calma.",
    intensity: 3,
    idealForRooms: ["Living", "Escritorio", "Atelier"],
    pyramid: {
      topNotes: ["Cáscara de nuez moscada", "Flor de azahar"],
      heartNotes: ["Cedro virginiano", "Tabaco rubio macerado"],
      baseNotes: ["Vainilla bourbon", "Pachulí ligero", "Resina ambarina"]
    },
    moodTags: ["Nostalgia", "Sensualidad", "Para leer", "Refugio"],
    companionProductSlugs: ["difusor-sandalo-higo", "blend-botanico-resina-humo"],
    isFeatured: true,
    isBestseller: false,
    stock: 11,
    badge: "EDICIÓN ATELIER",
    accentColor: "#BC6C4D",
    imageBg: "#FBF0EB",
    visualType: "candle",
    images: ["/images/vela_cedro.jpg"]
  },
  {
    id: "prod_difusor_bergamota_te",
    slug: "difusor-bergamota-te-verde",
    name: "Difusor Bergamota & Té Verde",
    category: "DIFUSORES",
    categoryLabel: "Difusor Ambiental",
    aromaticFamily: "Cítrico",
    mainNotes: ["bergamota calabresa", "té verde matcha", "menta japonesa"],
    price: 21000,
    sizeVolume: "200ml · 8 varillas de ratán natural",
    shortStory: "luz de mañana entrando por los ventanales.",
    poeticDescription: "Difusión continua y luminosa que purifica el aire y despierta la mente. Las varillas de fibra vegetal porosa elevan el ambiente con una frescura chispeante y limpia que dura hasta 90 días.",
    feelsLike: "brisa fresca que mueve cortinas blancas, té servido en cuenco de cerámica artesanal.",
    intensity: 3,
    idealForRooms: ["Atelier", "Cocina", "Entrada", "Oficina & Estudio"],
    pyramid: {
      topNotes: ["Bergamota prensada en frío", "Pomelo rosado"],
      heartNotes: ["Té verde matcha", "Jazmín sambac", "Coriandro"],
      baseNotes: ["Vetiver fresco", "Madera flotante"]
    },
    moodTags: ["Energía", "Concentración", "Para trabajar", "Para perfumar la casa", "Frescura"],
    companionProductSlugs: ["home-spray-bosque-humedo", "perfume-textil-eucalipto-salvia"],
    isFeatured: true,
    isBestseller: true,
    stock: 18,
    badge: "ESENCIAL",
    accentColor: "#D4A346",
    imageBg: "#FAF6EA",
    visualType: "diffuser",
    images: ["/images/difusor_bergamota.jpg"]
  },
  {
    id: "prod_difusor_sandalo_higo",
    slug: "difusor-sandalo-higo",
    name: "Difusor Sándalo & Higo",
    category: "DIFUSORES",
    categoryLabel: "Difusor Ambiental",
    aromaticFamily: "Amaderado",
    mainNotes: ["sándalo de Mysore", "higo maduro", "hoja de laurel"],
    price: 22500,
    sizeVolume: "200ml · 8 varillas de ratán natural",
    shortStory: "un jardín escondido entre casonas antiguas.",
    poeticDescription: "La exuberancia frutal y verde del higo se funde con la nobleza cremosa del sándalo. Un aroma profundo e hipnótico que transforma cualquier espacio en un santuario íntimo y distinguido.",
    feelsLike: "tarde dorada bajo una higuera frondosa, piel tibia y silencio cómplice.",
    intensity: 4,
    idealForRooms: ["Living", "Dormitorio Principal", "Hall de Entrada"],
    pyramid: {
      topNotes: ["Higo verde", "Mandarina amarga"],
      heartNotes: ["Hojas de higuera", "Iris florentino", "Laurel"],
      baseNotes: ["Sándalo puro", "Cedro seco", "Almizcle suave"]
    },
    moodTags: ["Sensualidad", "Refugio", "Para recibir gente", "Nostalgia"],
    companionProductSlugs: ["vela-botanica-ambar-madera", "perfume-textil-velvet-rose"],
    isFeatured: false,
    isBestseller: true,
    stock: 7,
    accentColor: "#707A5E",
    imageBg: "#F3F5F1",
    visualType: "diffuser",
    images: ["/images/difusor_sandalo.jpg"]
  },
  {
    id: "prod_spray_bosque",
    slug: "home-spray-bosque-humedo",
    name: "Home Spray Bosque Húmedo",
    category: "HOME_SPRAYS",
    categoryLabel: "Home Spray",
    aromaticFamily: "Verde & Herbal",
    mainNotes: ["musgo de roble", "pino silvestre", "tierra mojada (petricor)"],
    price: 14900,
    sizeVolume: "250ml · Gatillo pulverizador de bruma fina",
    shortStory: "caminar descalzo sobre el rocío matinal.",
    poeticDescription: "Un golpe de aire botánico instantáneo. Formulado a base de hidrolatos puros de coníferas y extractos vegetales que neutralizan olores y oxigenan los ambientes de inmediato.",
    feelsLike: "caminar entre pinos bajo la lluvia, corteza mojada y aire frío en los pulmones.",
    intensity: 4,
    idealForRooms: ["Living", "Baño", "Pasillos", "Galería"],
    pyramid: {
      topNotes: ["Agujas de pino", "Eucalipto medicinal"],
      heartNotes: ["Musgo de roble", "Salvia silvestre"],
      baseNotes: ["Tierra húmeda (Petricor)", "Ciprés patagónico"]
    },
    moodTags: ["Frescura", "Concentración", "Para perfumar la casa", "Energía"],
    companionProductSlugs: ["difusor-bergamota-te-verde", "vela-botanica-ambar-madera"],
    isFeatured: true,
    isBestseller: true,
    stock: 22,
    badge: "BOTÁNICA VIVA",
    accentColor: "#2E3D2F",
    imageBg: "#EFF3EF",
    visualType: "spray",
    images: ["/images/spray_bosque.jpg"]
  },
  {
    id: "prod_spray_neroli_lino",
    slug: "home-spray-neroli-lino",
    name: "Home Spray Neroli & Lino",
    category: "HOME_SPRAYS",
    categoryLabel: "Home Spray",
    aromaticFamily: "Floral",
    mainNotes: ["flor de azahar", "neroli fresco", "lino crudo"],
    price: 14900,
    sizeVolume: "250ml · Gatillo pulverizador de bruma fina",
    shortStory: "la caricia del sol en las sábanas de media tarde.",
    poeticDescription: "Fragancia etérea, luminosa y profundamente reconfortante. Ideal para rociar sobre cortinas, almohadones y rincones antes de recibir visitas o al abrir las ventanas del día.",
    feelsLike: "ropa tendida al sol primaveral, flores blancas abriéndose al alba.",
    intensity: 2,
    idealForRooms: ["Dormitorio", "Living", "Espacio de Niños", "Comedor"],
    pyramid: {
      topNotes: ["Neroli de Túnez", "Limón amarillo"],
      heartNotes: ["Flor de azahar", "Peonía blanca"],
      baseNotes: ["Almizcle vegetal", "Cedro blanco"]
    },
    moodTags: ["Calma", "Frescura", "Para recibir gente", "Para bajar un cambio"],
    companionProductSlugs: ["vela-lavanda-manzanilla", "perfume-textil-velvet-rose"],
    isFeatured: false,
    isBestseller: false,
    stock: 15,
    accentColor: "#E0907A",
    imageBg: "#FAF1EE",
    visualType: "spray",
    images: ["/images/spray_neroli.jpg"]
  },
  {
    id: "prod_textil_rose",
    slug: "perfume-textil-velvet-rose",
    name: "Perfume Textil Velvet Rose",
    category: "TEXTILES",
    categoryLabel: "Perfume Textil",
    aromaticFamily: "Floral",
    mainNotes: ["rosa de mayo", "madera de guayaco", "pimienta rosa"],
    price: 15800,
    sizeVolume: "250ml · Fórmula que no mancha linos ni sedas",
    shortStory: "un poema escrito en el forro de un abrigo antiguo.",
    poeticDescription: "Una interpretación contemporánea y bohemia de la rosa: no empolvada, sino húmeda, espinosa y envuelta en maderas oscuras y pimientas cálidas. Se funde con las fibras naturales sin dejar residuos.",
    feelsLike: "abrazar a alguien con perfume inolvidable, pétalos rojos entre páginas de libros.",
    intensity: 3,
    idealForRooms: ["Vestidor", "Dormitorio", "Placares", "Almohadones"],
    pyramid: {
      topNotes: ["Pimienta rosa", "Grosella negra"],
      heartNotes: ["Rosa damascena", "Geranio bourbon"],
      baseNotes: ["Madera de guayaco", "Ámbar gris botánico", "Incienso sutil"]
    },
    moodTags: ["Sensualidad", "Nostalgia", "Para una noche lenta", "Refugio"],
    companionProductSlugs: ["vela-cedro-vainilla", "difusor-sandalo-higo"],
    isFeatured: true,
    isBestseller: false,
    stock: 12,
    badge: "TEXTURA DE LINO",
    accentColor: "#9E4738",
    imageBg: "#F7ECE9",
    visualType: "textile",
    images: ["/images/textil_rose.jpg"]
  },
  {
    id: "prod_textil_eucalipto",
    slug: "perfume-textil-eucalipto-salvia",
    name: "Perfume Textil Eucalipto & Salvia",
    category: "TEXTILES",
    categoryLabel: "Perfume Textil",
    aromaticFamily: "Verde & Herbal",
    mainNotes: ["eucalipto medicinal", "salvia blanca", "romero de huerta"],
    price: 15800,
    sizeVolume: "250ml · Fórmula que no mancha linos ni sedas",
    shortStory: "claridad mental y frescura para tus prendas.",
    poeticDescription: "Diseñado para rociar en tapizados, mantas, frazadas y prendas de abrigo. Deja una estela herbácea limpia y protectora que renueva la vitalidad del ambiente.",
    feelsLike: "manos frotando hojas de hierbas frescas, aire puro de montaña.",
    intensity: 3,
    idealForRooms: ["Dormitorio", "Studio", "Living", "Espacio de Trabajo"],
    pyramid: {
      topNotes: ["Eucalipto globulus", "Menta silvestre"],
      heartNotes: ["Salvia officinalis", "Tomillo limonero"],
      baseNotes: ["Pino marítimo", "Cedro seco"]
    },
    moodTags: ["Concentración", "Energía", "Para trabajar", "Frescura"],
    companionProductSlugs: ["difusor-bergamota-te-verde", "home-spray-bosque-humedo"],
    isFeatured: false,
    isBestseller: false,
    stock: 16,
    accentColor: "#5C6B52",
    imageBg: "#F0F4EE",
    visualType: "textile",
    images: ["/images/textil_eucalipto.jpg"]
  },
  {
    id: "prod_blend_humo",
    slug: "blend-botanico-resina-humo",
    name: "Blend Botánico Resina & Humo",
    category: "SETS",
    categoryLabel: "Blend & Piedra Difusora",
    aromaticFamily: "Especiado",
    mainNotes: ["copal mexicano", "palo santo ético", "incienso de omán"],
    price: 19200,
    sizeVolume: "Gotero de vidrio ámbar 30ml + Piedra difusora volcánica",
    shortStory: "el ritual sagrado de sahumar las intenciones.",
    poeticDescription: "Blend concentrado de aceites resinosos puros para usar en difusores cerámicos, cuencos de agua caliente o sobre la piedra volcánica porosa incluida. Crea un ambiente místico de profunda serenidad.",
    feelsLike: "humo blanco ascendiendo en espiral, mística de atelier y recogimiento.",
    intensity: 5,
    idealForRooms: ["Atelier", "Espacio de Yoga", "Living", "Librería"],
    pyramid: {
      topNotes: ["Palo santo", "Semillas de cilantro"],
      heartNotes: ["Copal puro", "Mirra añeja"],
      baseNotes: ["Incienso negro", "Ládano resinoso", "Cedro"]
    },
    moodTags: ["Refugio", "Calma", "Nostalgia", "Sensualidad"],
    companionProductSlugs: ["vela-cedro-vainilla", "home-spray-bosque-humedo"],
    isFeatured: false,
    isBestseller: false,
    stock: 8,
    badge: "ALQUIMIA PURA",
    accentColor: "#BC6C4D",
    imageBg: "#F9EDE8",
    visualType: "blend",
    images: ["/images/blend_humo.jpg"]
  }
];

export const BUNDLES: BundleItem[] = [
  {
    id: "bundle_noche",
    slug: "ritual-de-noche",
    title: "RITUAL DE NOCHE",
    subtitle: "Para preparar el cuerpo y la mente antes de soñar",
    productsIncluded: [
      "Vela Lavanda & Manzanilla (250g)",
      "Home Spray Neroli & Lino (250ml)",
      "Caja de fósforos botánicos MEJUNJE"
    ],
    originalPrice: 32700,
    bundlePrice: 28500,
    discountPercent: 13,
    tag: "SET RECOMENDADO",
    description: "Un dúo sereno pensado para transformar el dormitorio en un santuario nocturno. Apagá las pantallas, rociá las sábanas de lino y encendé la mecha de madera.",
    accentColor: "#8F9E84",
    badge: "13% AHORRO"
  },
  {
    id: "bundle_casa_lenta",
    slug: "set-casa-lenta",
    title: "SET CASA LENTA",
    subtitle: "La atmósfera completa para toda la casa",
    productsIncluded: [
      "Difusor Bergamota & Té Verde (200ml)",
      "Vela Botánica Ámbar & Madera (250g)",
      "Home Spray Bosque Húmedo (250ml)",
      "Bolsa artesanal de lino crudo MEJUNJE"
    ],
    originalPrice: 54400,
    bundlePrice: 46900,
    discountPercent: 14,
    tag: "EXPERIENCIA COMPLETA",
    description: "Nuestra trinidad de aromas para crear capas olfativas: frescura cítrica en la entrada, refugio amaderado en el living y bruma botánica cuando lo necesites.",
    accentColor: "#C87D38",
    badge: "14% AHORRO"
  },
  {
    id: "bundle_regalo_atelier",
    slug: "set-regalo-atelier",
    title: "SET REGALO ATELIER",
    subtitle: "El obsequio perfecto listo para emocionar",
    productsIncluded: [
      "Vela Botánica a elección (250g)",
      "Fósforos extra largos con raspador",
      "Tarjeta manuscrita mecanografiada",
      "Envoltorio botánico con lacre sellado a mano"
    ],
    originalPrice: 25000,
    bundlePrice: 21900,
    discountPercent: 12,
    tag: "LISTO PARA REGALAR",
    description: "Elegí el mensaje y nosotros lo escribimos en nuestra máquina de escribir vintage sobre papel de algodón artesanal, cerrado con lacre botánico.",
    accentColor: "#BC6C4D",
    badge: "12% AHORRO"
  }
];

export const BOTANICALS: BotanicalIngredient[] = [
  {
    id: "ing_bergamota",
    slug: "bergamota",
    name: "BERGAMOTA",
    latinName: "Citrus bergamia",
    originNote: "Cáscara cítrica prensada en frío de Calabria",
    family: "Cítrico",
    description: "Chispeante, luminosa y sofisticada. Levanta el ánimo al instante sin caer en la acidez estridente, aportando claridad a los espacios.",
    benefits: "Claridad mental, optimismo matinal y disipación de la fatiga.",
    matchingProductSlugs: ["difusor-bergamota-te-verde", "vela-botanica-ambar-madera"],
    accentColor: "#D4A346",
    iconName: "Sun"
  },
  {
    id: "ing_cedro",
    slug: "cedro",
    name: "CEDRO",
    latinName: "Cedrus atlantica",
    originNote: "Corteza destilada al vapor de la cordillera del Atlas",
    family: "Amaderado",
    description: "Noble, seco y profundamente reconfortante. El aroma inconfundible de las maderas añejas, bibliotecas y casonas con historia.",
    benefits: "Arraigo, calma interior, reducción de la dispersión mental.",
    matchingProductSlugs: ["vela-botanica-ambar-madera", "vela-cedro-vainilla"],
    accentColor: "#9E5A20",
    iconName: "TreePine"
  },
  {
    id: "ing_lavanda",
    slug: "lavanda",
    name: "LAVANDA",
    latinName: "Lavandula angustifolia",
    originNote: "Flores silvestres de altura recolectadas al atardecer",
    family: "Verde & Herbal",
    description: "Herbal, limpia y balsámica. Muy lejos de las imitaciones sintéticas: es el perfume de la flor viva bajo el sol de la tarde.",
    benefits: "Baja las pulsaciones, calma la ansiedad y favorece el descanso reparador.",
    matchingProductSlugs: ["vela-lavanda-manzanilla"],
    accentColor: "#8F9E84",
    iconName: "Flower"
  },
  {
    id: "ing_ambar",
    slug: "ambar",
    name: "ÁMBAR",
    latinName: "Succin / Balsamum",
    originNote: "Acorde de resinas fósiles, benjuí y ládano",
    family: "Amaderado",
    description: "Dorado, cálido, meloso y envolvente. La nota fundamental que fija los recuerdos más entrañables en la memoria olfativa.",
    benefits: "Sensación de abrigo emocional, sensualidad y calidez hogareña.",
    matchingProductSlugs: ["vela-botanica-ambar-madera", "perfume-textil-velvet-rose"],
    accentColor: "#C87D38",
    iconName: "Flame"
  },
  {
    id: "ing_vainilla",
    slug: "vainilla",
    name: "VAINILLA",
    latinName: "Vanilla planifolia",
    originNote: "Vainas maduras curadas al sol de Madagascar",
    family: "Gourmand",
    description: "Ahumada, licorosa y aterciopelada. Nunca empalagosa: aporta la redondez acogedora de un recuerdo entrañable de la infancia.",
    benefits: "Confort emocional, alivio de la tensión y sensación de refugio.",
    matchingProductSlugs: ["vela-cedro-vainilla", "vela-botanica-ambar-madera"],
    accentColor: "#D4A346",
    iconName: "Sparkles"
  },
  {
    id: "ing_sandalo",
    slug: "sandalo",
    name: "SÁNDALO",
    latinName: "Santalum album",
    originNote: "Duramen maduro de madera sagrada",
    family: "Amaderado",
    description: "Cremoso, suavemente dulce y místico. Crea atmósferas de recogimiento, quietud y elegancia contemporánea.",
    benefits: "Apertura de la creatividad, meditación y serenidad.",
    matchingProductSlugs: ["difusor-sandalo-higo"],
    accentColor: "#707A5E",
    iconName: "Compass"
  },
  {
    id: "ing_jazmin",
    slug: "jazmin",
    name: "JAZMÍN",
    latinName: "Jasminum officinale",
    originNote: "Pétalos nocturnos cosechados antes del amanecer",
    family: "Floral",
    description: "Embriagador, verde y sensual. El aroma inolvidable de las noches de verano en los patios antiguos de Buenos Aires.",
    benefits: "Despierta la sensualidad, combate la fatiga emocional y alegra el espíritu.",
    matchingProductSlugs: ["difusor-bergamota-te-verde", "vela-botanica-ambar-madera"],
    accentColor: "#BC6C4D",
    iconName: "Heart"
  },
  {
    id: "ing_eucalipto",
    slug: "eucalipto",
    name: "EUCALIPTO",
    latinName: "Eucalyptus globulus",
    originNote: "Hojas cerosas de eucalipto azul medicinal",
    family: "Verde & Herbal",
    description: "Alcanforado, fresco y expansivo. Abre las vías respiratorias y renueva el aire estancado con vitalidad pura.",
    benefits: "Respiración libre, energía renovada y purificación ambiental.",
    matchingProductSlugs: ["home-spray-bosque-humedo", "perfume-textil-eucalipto-salvia"],
    accentColor: "#2E3D2F",
    iconName: "Wind"
  }
];

export const MOODS: MoodFilter[] = [
  {
    id: "mood_calma",
    title: "CALMA",
    subtitle: "Para soltar el ritmo del día",
    quote: "Un silencio hondo donde todo vuelve a su centro.",
    accentColor: "#8F9E84",
    matchingSlugs: ["vela-lavanda-manzanilla", "home-spray-neroli-lino", "ritual-de-noche"]
  },
  {
    id: "mood_refugio",
    title: "REFUGIO",
    subtitle: "El abrazo de tu propia casa",
    quote: "Paredes de madera, té caliente y lluvia afuera.",
    accentColor: "#C87D38",
    matchingSlugs: ["vela-botanica-ambar-madera", "vela-cedro-vainilla", "difusor-sandalo-higo"]
  },
  {
    id: "mood_energia",
    title: "ENERGÍA",
    subtitle: "Despertar las mañanas con luz",
    quote: "Chispas de sol que ponen las ideas en marcha.",
    accentColor: "#D4A346",
    matchingSlugs: ["difusor-bergamota-te-verde", "perfume-textil-eucalipto-salvia"]
  },
  {
    id: "mood_frescura",
    title: "FRESCURA",
    subtitle: "Bruma limpia y ventanas abiertas",
    quote: "El aire puro de un bosque que respira después del agua.",
    accentColor: "#707A5E",
    matchingSlugs: ["home-spray-bosque-humedo", "home-spray-neroli-lino"]
  },
  {
    id: "mood_sensualidad",
    title: "SENSUALIDAD",
    subtitle: "Misterio, cercanía y noches lentas",
    quote: "Piel tibia, pétalos oscuros y una luz baja.",
    accentColor: "#9E4738",
    matchingSlugs: ["perfume-textil-velvet-rose", "difusor-sandalo-higo", "vela-cedro-vainilla"]
  },
  {
    id: "mood_concentracion",
    title: "CONCENTRACIÓN",
    subtitle: "Para el atelier y el trabajo creativo",
    quote: "Espacio despejado para escribir, crear y pensar.",
    accentColor: "#2E3D2F",
    matchingSlugs: ["difusor-bergamota-te-verde", "home-spray-bosque-humedo", "perfume-textil-eucalipto-salvia"]
  },
  {
    id: "mood_nostalgia",
    title: "NOSTALGIA",
    subtitle: "Memorias vivas de otros tiempos",
    quote: "Papeles viejos, cartas guardadas y perfume que regresa.",
    accentColor: "#BC6C4D",
    matchingSlugs: ["vela-cedro-vainilla", "blend-botanico-resina-humo", "perfume-textil-velvet-rose"]
  }
];

export const MOMENTS = [
  {
    id: "moment_bajar_cambio",
    title: "Para bajar un cambio",
    slugs: ["vela-lavanda-manzanilla", "home-spray-neroli-lino"],
    description: "Desconectá las pantallas y dejá que el aroma prepare el espacio para la pausa."
  },
  {
    id: "moment_recibir_gente",
    title: "Para recibir gente",
    slugs: ["difusor-sandalo-higo", "home-spray-neroli-lino"],
    description: "Una bienvenida inolvidable que envuelve a tus invitados desde la puerta."
  },
  {
    id: "moment_leer",
    title: "Para leer",
    slugs: ["vela-botanica-ambar-madera", "vela-cedro-vainilla"],
    description: "El crepitar del pabilo de madera y notas cálidas para perderse en las páginas."
  },
  {
    id: "moment_trabajar",
    title: "Para trabajar",
    slugs: ["difusor-bergamota-te-verde", "perfume-textil-eucalipto-salvia"],
    description: "Frescura botánica y notas herbales que limpian la mente y enfocan la energía."
  },
  {
    id: "moment_noche_lenta",
    title: "Para una noche lenta",
    slugs: ["perfume-textil-velvet-rose", "vela-cedro-vainilla"],
    description: "Música en vinilo, copas de vino y una penumbra perfumada y misteriosa."
  },
  {
    id: "moment_regalar",
    title: "Para regalar",
    slugs: ["vela-botanica-ambar-madera", "set-regalo-atelier"],
    description: "Presentación artesanal en lino con notas mecanografiadas a pedido."
  },
  {
    id: "moment_perfumar_casa",
    title: "Para perfumar la casa",
    slugs: ["home-spray-bosque-humedo", "difusor-bergamota-te-verde"],
    description: "La bruma botánica que transforma el aire de cada habitación en segundos."
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev_1",
    quote: "Mi casa huele al lugar exacto donde quiero quedarme para siempre. La vela de Ámbar & Madera tiene una presencia que no encontré en ninguna otra marca de Buenos Aires.",
    author: "Lucía M.",
    location: "Palermo · Cliente desde 2023",
    productName: "Vela Botánica Ámbar & Madera",
    stars: 5,
    date: "Hace 2 semanas"
  },
  {
    id: "rev_2",
    quote: "El home spray de Bosque Húmedo transformó mi estudio de trabajo. Es como abrir una ventana a la Patagonia húmeda en pleno asfalto porteño.",
    author: "Camila V.",
    location: "San Telmo · Ilustradora",
    productName: "Home Spray Bosque Húmedo",
    stars: 5,
    date: "Hace 1 mes"
  },
  {
    id: "rev_3",
    quote: "Compré el Set Regalo Atelier para el cumpleaños de mi pareja. La tarjeta escrita a máquina con lacre sellado fue el detalle más lindo que vimos en años.",
    author: "Esteban R.",
    location: "Colegiales · Arquitecto",
    productName: "Set Regalo Atelier",
    stars: 5,
    date: "Hace 3 semanas"
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "¿En qué espacio querés crear esta atmósfera?",
    subtitle: "El tamaño y uso del ambiente define la fijación y el formato ideal.",
    options: [
      {
        id: "room_living",
        label: "Living o sala principal",
        desc: "Espacio amplio para compartir y habitar en distintas horas.",
        category: "VELAS",
        weight: { "Amaderado": 2, "Cítrico": 1 }
      },
      {
        id: "room_bedroom",
        label: "Dormitorio & mesa de luz",
        desc: "Rincón íntimo de descanso, lectura y desconexión.",
        category: "VELAS",
        weight: { "Verde & Herbal": 2, "Floral": 1 }
      },
      {
        id: "room_atelier",
        label: "Atelier, estudio o escritorio",
        desc: "Área de foco, creatividad y trabajo de muchas horas.",
        category: "DIFUSORES",
        weight: { "Cítrico": 2, "Verde & Herbal": 1 }
      },
      {
        id: "room_entry",
        label: "Entrada, pasillos o toda la casa",
        desc: "El primer aroma que te da la bienvenida al cruzar la puerta.",
        category: "HOME_SPRAYS",
        weight: { "Cítrico": 1, "Amaderado": 1 }
      }
    ]
  },
  {
    id: 2,
    title: "¿Qué sensación estás buscando experimentar?",
    subtitle: "Los aromas dialogan directo con la memoria y el sistema límbico.",
    options: [
      {
        id: "feel_calm",
        label: "Bajar revoluciones y sentir calma profunda",
        desc: "Pausar el ruido de la ciudad y descansar.",
        mood: "Calma",
        weight: { "Verde & Herbal": 2, "Floral": 1 }
      },
      {
        id: "feel_shelter",
        label: "Refugio cálido, abrazo y nostalgia dulce",
        desc: "Sentirte cobijado en una tarde lluviosa.",
        mood: "Refugio",
        weight: { "Amaderado": 2, "Gourmand": 2 }
      },
      {
        id: "feel_energy",
        label: "Claridad, energía limpia y optimismo",
        desc: "Despertar la mente y renovar el aire.",
        mood: "Energía",
        weight: { "Cítrico": 2, "Verde & Herbal": 2 }
      },
      {
        id: "feel_sensual",
        label: "Sensualidad, misterio y noches lentas",
        desc: "Una presencia magnética e inolvidable.",
        mood: "Sensualidad",
        weight: { "Floral": 2, "Especiado": 2, "Amaderado": 1 }
      }
    ]
  },
  {
    id: 3,
    title: "¿Cuáles de estos acordes te atraen más?",
    subtitle: "Elegí el universo botánico con el que más resonás.",
    options: [
      {
        id: "accord_woods",
        label: "Maderas nobles, resinas y ámbar fósil",
        desc: "Cedro, sándalo, hojas secas, corteza y fogata.",
        family: "Amaderado"
      },
      {
        id: "accord_herbal",
        label: "Hierbas de campo, hojas machacadas y bosque",
        desc: "Lavanda silvestre, salvia, pino y rocío.",
        family: "Verde & Herbal"
      },
      {
        id: "accord_citrus",
        label: "Cáscara de bergamota, té verde y neroli",
        desc: "Luminosidad fresca, cítricos al sol y brisa limpia.",
        family: "Cítrico"
      },
      {
        id: "accord_floral_gourmand",
        label: "Pétalos de rosa húmeda y vainilla bourbon",
        desc: "Flores oscuras, especias suaves y dulzura madura.",
        family: "Floral"
      }
    ]
  },
  {
    id: 4,
    title: "¿Qué nivel de intensidad preferís en el aire?",
    subtitle: "Cada persona percibe el perfume a diferentes volúmenes.",
    options: [
      {
        id: "int_subtle",
        label: "Sutil & Etéreo (Nivel 1-2)",
        desc: "Un susurro apenas perceptible que no satura jamás.",
        intensity: 2
      },
      {
        id: "int_medium",
        label: "Equilibrado & Presente (Nivel 3)",
        desc: "Un aroma que acompaña constantemente de forma armoniosa.",
        intensity: 3
      },
      {
        id: "int_intense",
        label: "Profundo & Envolvente (Nivel 4-5)",
        desc: "Una estela con cuerpo que llena la habitación y perdura.",
        intensity: 4
      }
    ]
  }
];

export function formatPrice(price: number): string {
  // es-AR currency format: $18.500 (sin ARS / AR$)
  return `$${price.toLocaleString('es-AR')}`;
}
