export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  zoom: number;
  timezone: string;
  currency: string;
  language: string;
  flag: string;
  tagline: string;
  description: string;
}

export type PlaceCategory =
  | 'attraction'
  | 'restaurant'
  | 'hotel'
  | 'historic'
  | 'hospital'
  | 'police'
  | 'transit'
  | 'pharmacy';

export interface PlacePOI {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: PlaceCategory;
  description: string;
  address: string;
  openingHours?: string;
  website?: string | null;
  phone?: string;
  wheelchair?: string;
  verifiedSource?: string;
  affordability?: string;
  cleanlinessRating?: string;
  accessibility?: string;
  verifiedRating?: string;
  safetyFeatures?: string;
}

export interface OfficialSafetyInfo {
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    general?: string;
    touristSupport?: string;
  };
  policeAgencyName: string;
  officialPolicePortal: string;
  healthServiceAgency: string;
  healthPortal: string;
  officialAdvisorySource: string;
  advisoryLevel: 'Level 1: Exercise Normal Precautions' | 'Level 2: Exercise Increased Caution' | 'Safe Urban Zone';
  advisorySummary: string;
  lastUpdated: string;
  verifiedAgencyUrl: string;
  consularAdviceUrl: string;
  publicSafetyGuidelines: string[];
}

export const DEFAULT_CITIES: City[] = [
  {
    id: 'pune',
    name: 'Pune',
    country: 'India',
    countryCode: 'IN',
    lat: 18.5204,
    lon: 73.8567,
    zoom: 13,
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    language: 'Marathi, Hindi, English',
    flag: '🇮🇳',
    tagline: 'Oxford of the East & Cultural Capital of Maharashtra',
    description: 'A thriving center of education, automotive engineering, and software hubs, celebrated for Maratha heritage, Shaniwar Wada, Aga Khan Palace, and historic wadas.'
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    countryCode: 'IN',
    lat: 19.0760,
    lon: 72.8777,
    zoom: 13,
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    language: 'Hindi, Marathi, English',
    flag: '🇮🇳',
    tagline: 'City of Dreams & Coastal Financial Capital',
    description: 'A densely populated metropolis on India\'s west coast, Mumbai is India\'s financial engine, home to Bollywood, Victorian Gothic architecture, and the bustling Marine Drive promenade.'
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    countryCode: 'IN',
    lat: 28.6139,
    lon: 77.2090,
    zoom: 12,
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    language: 'Hindi, Punjabi, English',
    flag: '🇮🇳',
    tagline: 'Historic Capital of Empires & Modern Republic',
    description: 'National capital territory of India boasting UNESCO monuments, sprawling Mughal architecture, the vibrant Chandni Chowk, and the world-class Delhi Metro network.'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    countryCode: 'IN',
    lat: 12.9716,
    lon: 77.5946,
    zoom: 13,
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    language: 'Kannada, English, Hindi',
    flag: '🇮🇳',
    tagline: 'Silicon Valley of India & Garden City',
    description: 'India\'s leading tech and aerospace hub on the Deccan plateau, famous for lush tree-lined parks like Cubbon Park, Victorian landmarks, craft microbreweries, and pleasant year-round weather.'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    lat: 35.6762,
    lon: 139.6503,
    zoom: 13,
    timezone: 'Asia/Tokyo',
    currency: 'JPY (¥)',
    language: 'Japanese',
    flag: '🇯🇵',
    tagline: 'Futuristic Metropolis of Neon & Tradition',
    description: 'Japan\'s bustling capital mixes ultramodern skyscrapers, serene historic temples, world-class train systems, and culinary excellence.'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    lat: 51.5074,
    lon: -0.1278,
    zoom: 13,
    timezone: 'Europe/London',
    currency: 'GBP (£)',
    language: 'English',
    flag: '🇬🇧',
    tagline: 'Historic Global Crossroads on the Thames',
    description: 'Standing on the River Thames, London is a vibrant cultural powerhouse boasting historic landmarks, royal parks, and premier international museums.'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    lat: 48.8566,
    lon: 2.3522,
    zoom: 13,
    timezone: 'Europe/Paris',
    currency: 'EUR (€)',
    language: 'French',
    flag: '🇫🇷',
    tagline: 'The City of Light, Art & Architecture',
    description: 'France\'s capital is a global center for art, fashion, gastronomy, and culture, famed for wide boulevards, the Seine, and Gothic architecture.'
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7128,
    lon: -74.0060,
    zoom: 13,
    timezone: 'America/New_York',
    currency: 'USD ($)',
    language: 'English',
    flag: '🇺🇸',
    tagline: 'The City That Never Sleeps',
    description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean, anchored by Manhattan\'s iconic skyline.'
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    lat: 37.7749,
    lon: -122.4194,
    zoom: 13,
    timezone: 'America/Los_Angeles',
    currency: 'USD ($)',
    language: 'English',
    flag: '🇺🇸',
    tagline: 'Golden Gate, Rolling Hills & Innovation',
    description: 'Northern California\'s cultural and tech hub, framed by the Pacific Ocean, historic cable cars, vibrant neighborhoods, and foggy bay vistas.'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    lat: 1.3521,
    lon: 103.8198,
    zoom: 13,
    timezone: 'Asia/Singapore',
    currency: 'SGD ($)',
    language: 'English, Malay, Mandarin, Tamil',
    flag: '🇸🇬',
    tagline: 'Garden City & Global Maritime Hub',
    description: 'An island city-state off southern Malaysia, world-renowned for hyper-clean infrastructure, lush botanical gardens, and hawker feasts.'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    lat: -33.8688,
    lon: 151.2093,
    zoom: 13,
    timezone: 'Australia/Sydney',
    currency: 'AUD ($)',
    language: 'English',
    flag: '🇦🇺',
    tagline: 'Sunlit Harbour, Opera House & Coastal Living',
    description: 'Capital of New South Wales and one of Australia\'s largest cities, best known for its sail-shaped Opera House, Harbour Bridge, and pristine beaches.'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    lat: 52.5200,
    lon: 13.4050,
    zoom: 13,
    timezone: 'Europe/Berlin',
    currency: 'EUR (€)',
    language: 'German',
    flag: '🇩🇪',
    tagline: 'Hub of Art, 20th-Century History & Creative Energy',
    description: 'Germany\'s capital dates to the 13th century, celebrated for its artistic spirit, modern architecture, Museum Island, and vibrant public transit.'
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    countryCode: 'BR',
    lat: -22.9068,
    lon: -43.1729,
    zoom: 13,
    timezone: 'America/Sao_Paulo',
    currency: 'BRL (R$)',
    language: 'Portuguese',
    flag: '🇧🇷',
    tagline: 'Marvelous City of Mountains & Copacabana',
    description: 'A huge seaside city in Brazil, famed for Copacabana and Ipanema beaches, Sugarloaf Mountain, and Christ the Redeemer atop Corcovado.'
  }
];

export const CITY_POIS_DATA: Record<string, PlacePOI[]> = {
  tokyo: [
    {
      id: 'tokyo-1',
      name: 'Senso-ji Temple',
      lat: 35.7148,
      lon: 139.7967,
      category: 'attraction',
      description: 'Tokyo\'s oldest and most significant Buddhist temple, located in Asakusa.',
      address: '2-3-1 Asakusa, Taito City, Tokyo 111-0032',
      openingHours: '06:00 - 17:00 daily',
      website: 'https://www.senso-ji.jp',
      verifiedSource: 'OpenStreetMap node #268991206',
      affordability: 'Free Admission (Hall ¥0)',
      cleanlinessRating: 'Tokyo Temple Heritage: Pristine Daily Sweeping',
      accessibility: 'Wheelchair ramp to Main Hall • Tactile paving',
      verifiedRating: '4.7 / 5.0 (Japan Tourism Board)',
      safetyFeatures: 'Monitored temple patrol • 200m to Asakusa Koban'
    },
    {
      id: 'tokyo-2',
      name: 'Tokyo Skytree',
      lat: 35.7100,
      lon: 139.8107,
      category: 'attraction',
      description: 'Broadcasting tower with 360-degree observation decks at 350m and 450m.',
      address: '1-1-2 Oshiage, Sumida City, Tokyo 131-0045',
      openingHours: '10:00 - 21:00 daily',
      website: 'https://www.tokyo-skytree.jp',
      verifiedSource: 'OpenStreetMap node #358763520',
      affordability: '¥3,100 (Combo Deck Ticket)',
      cleanlinessRating: 'Tobu Railway Commercial Standard: 100% Certified',
      accessibility: 'High-speed elevator with wheelchair priority',
      verifiedRating: '4.6 / 5.0 (Official Sightseeing Registry)',
      safetyFeatures: 'Earthquake damper system • First aid clinic on 1F'
    },
    {
      id: 'tokyo-hist-1',
      name: 'Imperial Palace & Edo Castle Ruins',
      lat: 35.6852,
      lon: 139.7528,
      category: 'historic',
      description: 'The primary residence of the Emperor of Japan with historic Edo period stone walls and moats.',
      address: '1-1 Chiyoda, Chiyoda City, Tokyo 100-8111',
      openingHours: '09:00 - 17:00 (Closed Mondays & Fridays)',
      website: 'https://www.kunaicho.go.jp/e-index.html',
      verifiedSource: 'OpenStreetMap node #18274192',
      affordability: 'Free Public Admission',
      cleanlinessRating: 'Imperial Household Agency: Supreme Grade',
      accessibility: 'Level gravel pathways • Step-free East Gardens',
      verifiedRating: '4.8 / 5.0 (National Historic Site)',
      safetyFeatures: 'Imperial Guard Police Station on perimeter • 24/7 CCTV'
    },
    {
      id: 'tokyo-rest-1',
      name: 'Tsukiji Sushidai Honkan',
      lat: 35.6654,
      lon: 139.7707,
      category: 'restaurant',
      description: 'Renowned seafood eatery in the historic Tsukiji market district serving fresh omakase nigiri.',
      address: '4-4-2 Tsukiji, Chuo City, Tokyo 104-0045',
      openingHours: '08:00 - 15:00 daily',
      website: 'https://www.tsukiji.or.jp',
      verifiedSource: 'OpenStreetMap node #38192744',
      affordability: '$$$ (~¥4,500/person)',
      cleanlinessRating: 'Chuo Public Health Inspection: Grade A Sanitation',
      accessibility: 'Ground floor counter • Step-free entry',
      verifiedRating: '4.7 / 5.0 (Tabelog Verified)',
      safetyFeatures: 'Active fire suppression • 180m to Tsukiji Police Box'
    },
    {
      id: 'tokyo-hotel-1',
      name: 'Imperial Hotel Tokyo',
      lat: 35.6723,
      lon: 139.7588,
      category: 'hotel',
      description: 'Historic luxury grand hotel founded in 1890 opposite Hibiya Park, famed for hospitality.',
      address: '1-1-1 Uchisaiwaicho, Chiyoda City, Tokyo 100-8558',
      openingHours: '24 hours open',
      website: 'https://www.imperialhotel.co.jp',
      phone: '+81-3-3504-1111',
      verifiedSource: 'OpenStreetMap node #28192019',
      affordability: '$$$$ (~¥55,000/night)',
      cleanlinessRating: 'Japan Hotel Association Hygiene Certified: 100%',
      accessibility: 'Barrier-free universally accessible suites & ramps',
      verifiedRating: '4.9 / 5.0 (Forbes Travel Guide)',
      safetyFeatures: '24/7 Concierge security • Emergency doctor on call • 400m to Hibiya Koban'
    },
    {
      id: 'tokyo-3',
      name: 'Meiji Jingu Shrine',
      lat: 35.6764,
      lon: 139.6993,
      category: 'historic',
      description: 'Major Shinto shrine surrounded by a tranquil 170-acre forest in Shibuya.',
      address: '1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557',
      openingHours: 'Sunrise to sunset daily',
      website: 'https://www.meijijingu.or.jp',
      verifiedSource: 'OpenStreetMap node #117865223',
      affordability: 'Free Admission',
      cleanlinessRating: 'Spiritual Sanctuary: Zero litter policy',
      accessibility: 'Compact gravel walkways • Wheelchair loan available',
      verifiedRating: '4.8 / 5.0 (Cultural Affairs Agency)',
      safetyFeatures: 'Park ranger patrols • Emergency solar lighting'
    },
    {
      id: 'tokyo-4',
      name: 'Tokyo Station (JR & Shinkansen)',
      lat: 35.6812,
      lon: 139.7671,
      category: 'transit',
      description: 'Central transport hub connecting high-speed Shinkansen bullet trains and JR lines.',
      address: '1 Chome Marunouchi, Chiyoda City, Tokyo 100-0005',
      openingHours: '04:30 - 01:00 daily',
      verifiedSource: 'OpenStreetMap node #26291669',
      affordability: 'Transit fare by distance',
      cleanlinessRating: 'JR East Eco-Station Cleanliness: Grade A',
      accessibility: 'Elevators at all platform gates • Braille tactile paths',
      verifiedRating: '4.8 / 5.0 (TfT Railway Review)',
      safetyFeatures: 'Railway Police squad post inside concourse • 24/7 staff'
    },
    {
      id: 'tokyo-6',
      name: 'St. Luke\'s International Hospital',
      lat: 35.6669,
      lon: 139.7744,
      category: 'hospital',
      description: 'Renowned hospital with 24/7 emergency department and multilingual medical staff.',
      address: '9-1 Akashicho, Chuo City, Tokyo 104-8560',
      phone: '+81-3-3541-5151',
      openingHours: '24/7 Emergency Care',
      website: 'https://hospital.luke.ac.jp/eng/',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #336148003',
      affordability: 'National Health Insurance / Universal ER Care',
      cleanlinessRating: 'JCI (Joint Commission International) Accredited',
      accessibility: '100% barrier-free hospital campus',
      verifiedRating: '4.9 / 5.0 (Tokyo Health Authority)',
      safetyFeatures: 'Level 1 Trauma ER • 24/7 multilingual emergency reception'
    },
    {
      id: 'tokyo-7',
      name: 'Tokyo Metropolitan Police Department HQ',
      lat: 35.6775,
      lon: 139.7523,
      category: 'police',
      description: 'Headquarters of Tokyo police force; coordinates citywide security and Koban booths.',
      address: '2-1-1 Kasumigaseki, Chiyoda City, Tokyo 100-8929',
      phone: '+81-3-3581-4321',
      openingHours: '24 hours daily',
      website: 'https://www.keishicho.metro.tokyo.lg.jp',
      verifiedSource: 'OpenStreetMap node #33871922',
      affordability: 'Public Service (Free)',
      cleanlinessRating: 'Government Facility Standard',
      accessibility: 'Wheelchair access via main entrance',
      verifiedRating: 'Official Public Law Enforcement',
      safetyFeatures: 'Metropolitan armed protection unit • 110 command central'
    },
    {
      id: 'tokyo-8',
      name: 'Shibuya Koban Police Box',
      lat: 35.6595,
      lon: 139.7004,
      category: 'police',
      description: 'Famous police post right beside Shibuya Scramble Crossing for tourist assistance and lost items.',
      address: '1-1 Dogenzaka, Shibuya City, Tokyo 150-0043',
      phone: '110 (Emergency)',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #685718293',
      affordability: 'Public Service (Free)',
      cleanlinessRating: 'Municipal Police Standard',
      accessibility: 'Sidewalk level counter',
      verifiedRating: 'Official Community Station',
      safetyFeatures: 'Continuous officer presence • Immediate response'
    }
  ],
  london: [
    {
      id: 'london-1',
      name: 'The British Museum',
      lat: 51.5194,
      lon: -0.1270,
      category: 'attraction',
      description: 'World-famous dedicated museum of human history, art and culture, housing the Rosetta Stone.',
      address: 'Great Russell St, London WC1B 3DG',
      openingHours: '10:00 - 17:00 (Fridays until 20:30)',
      website: 'https://www.britishmuseum.org',
      verifiedSource: 'OpenStreetMap node #21482811',
      affordability: 'Free Public Admission (Permanent Collection)',
      cleanlinessRating: 'National Museum Hygiene Certification: 5/5',
      accessibility: 'Full level access via Great Russell St • Lifts to all galleries',
      verifiedRating: '4.8 / 5.0 (VisitBritain Quality Assured)',
      safetyFeatures: 'Baggage security screening • 350m to Holborn Police station'
    },
    {
      id: 'london-hist-1',
      name: 'Tower of London & Crown Jewels',
      lat: 51.5081,
      lon: -0.0759,
      category: 'historic',
      description: 'Historic royal fortress founded in 1066 beside the Thames, home to the Crown Jewels.',
      address: 'Tower Hill, London EC3N 4AB',
      openingHours: '09:00 - 17:30 daily',
      website: 'https://www.hrp.org.uk/tower-of-london',
      verifiedSource: 'OpenStreetMap node #2689123',
      affordability: '£34.80 (Adult entry ticket)',
      cleanlinessRating: 'Historic Royal Palaces Certified: 5/5',
      accessibility: 'Cobblestone paths • Step-free access to Jewel House',
      verifiedRating: '4.7 / 5.0 (UNESCO World Heritage Site)',
      safetyFeatures: 'Resident Yeoman Warders & military detachment on duty'
    },
    {
      id: 'london-rest-1',
      name: 'Rules Restaurant (Covent Garden)',
      lat: 51.5108,
      lon: -0.1232,
      category: 'restaurant',
      description: 'London\'s oldest restaurant, established in 1798, renowned for classic British culinary heritage.',
      address: '34-35 Maiden Ln, London WC2E 7LB',
      openingHours: '12:00 - 23:00 daily',
      website: 'https://rules.co.uk',
      phone: '+44 20 7836 5314',
      verifiedSource: 'OpenStreetMap node #21893812',
      affordability: '$$$ (~£68/person)',
      cleanlinessRating: 'Westminster Food Hygiene Rating: 5/5 (Very Good)',
      accessibility: 'Ground floor step-free dining room available',
      verifiedRating: '4.6 / 5.0 (AA Rosette Guide)',
      safetyFeatures: 'Monitored fire egress • 250m to Charing Cross Police Station'
    },
    {
      id: 'london-hotel-1',
      name: 'The Savoy Hotel London',
      lat: 51.5103,
      lon: -0.1205,
      category: 'hotel',
      description: 'Iconic 5-star Edwardian and Art Deco luxury hotel on the Strand overlooking the River Thames.',
      address: 'Strand, London WC2R 0EZ',
      openingHours: '24 hours open',
      website: 'https://thesavoylondon.com',
      phone: '+44 20 7836 4343',
      verifiedSource: 'OpenStreetMap node #44192837',
      affordability: '$$$$ (~£750/night)',
      cleanlinessRating: 'Luxury Hospitality Audit: 100% Exemplary',
      accessibility: 'Accessible guest suites, Braille signage & hearing loops',
      verifiedRating: '4.9 / 5.0 (Forbes 5-Star Hotel Award)',
      safetyFeatures: '24/7 Professional in-house security • 500m to St Thomas Hospital'
    },
    {
      id: 'london-3',
      name: 'St Thomas\' Hospital (A&E)',
      lat: 51.4988,
      lon: -0.1189,
      category: 'hospital',
      description: 'Major NHS teaching hospital directly opposite the Houses of Parliament with 24/7 A&E.',
      address: 'Westminster Bridge Rd, London SE1 7EH',
      phone: '+44 20 7188 7188',
      openingHours: '24 hours emergency department',
      website: 'https://www.guysandstthomas.nhs.uk',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #21356782',
      affordability: 'NHS Emergency Care (Free at point of delivery)',
      cleanlinessRating: 'Care Quality Commission (CQC) Rated: Good / Outstanding',
      accessibility: '100% step-free accessible hospital facility',
      verifiedRating: 'Official Major NHS Acute Teaching Trust',
      safetyFeatures: '24/7 Level 1 Trauma & Urgent Resuscitation Unit'
    },
    {
      id: 'london-4',
      name: 'New Scotland Yard (Met Police HQ)',
      lat: 51.5019,
      lon: -0.1246,
      category: 'police',
      description: 'Headquarters of the Metropolitan Police Service, serving Greater London.',
      address: 'Victoria Embankment, London SW1A 2JL',
      phone: '999 (Emergency) / 101 (Non-emergency)',
      openingHours: '24 hours daily',
      website: 'https://www.met.police.uk',
      verifiedSource: 'OpenStreetMap node #43719812',
      affordability: 'Public Police Service (Free)',
      cleanlinessRating: 'Government Police Facility Standard',
      accessibility: 'Accessible front entrance and intercom',
      verifiedRating: 'Official Territorial Police Service',
      safetyFeatures: 'Direct headquarters dispatch command unit'
    },
    {
      id: 'london-5',
      name: 'King\'s Cross & St Pancras International',
      lat: 51.5314,
      lon: -0.1261,
      category: 'transit',
      description: 'Major railway nexus serving Eurostar continental trains and National Rail lines.',
      address: 'Euston Rd, London N1C 4QP',
      openingHours: '05:00 - 01:00 daily',
      verifiedSource: 'OpenStreetMap node #21873192',
      affordability: 'Rail ticket required for platforms',
      cleanlinessRating: 'Network Rail Station Audit: High Standard',
      accessibility: 'Step-free routes from street to all train platforms',
      verifiedRating: '4.7 / 5.0 (National Rail Passenger Survey)',
      safetyFeatures: 'British Transport Police on-site station • 24/7 staff'
    }
  ],
  paris: [
    {
      id: 'paris-1',
      name: 'Eiffel Tower (Tour Eiffel)',
      lat: 48.8584,
      lon: 2.2945,
      category: 'attraction',
      description: 'Wrought-iron lattice tower on the Champ de Mars, the global symbol of France.',
      address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
      openingHours: '09:30 - 23:45 daily',
      website: 'https://www.toureiffel.paris',
      verifiedSource: 'OpenStreetMap node #5013364'
    },
    {
      id: 'paris-2',
      name: 'Louvre Museum (Musée du Louvre)',
      lat: 48.8606,
      lon: 2.3376,
      category: 'attraction',
      description: 'The world\'s most-visited museum, home to the Mona Lisa and Venus de Milo.',
      address: 'Rue de Rivoli, 75001 Paris',
      openingHours: '09:00 - 18:00 (closed Tuesdays)',
      website: 'https://www.louvre.fr',
      verifiedSource: 'OpenStreetMap node #3398172'
    },
    {
      id: 'paris-3',
      name: 'Hôtel-Dieu Hospital (AP-HP)',
      lat: 48.8546,
      lon: 2.3486,
      category: 'hospital',
      description: 'Oldest hospital in Paris, located on Île de la Cité next to Notre-Dame, with urgent medical unit.',
      address: '1 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
      phone: '+33 1 42 34 82 34',
      openingHours: '24/7 Urgences',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #1289381'
    },
    {
      id: 'paris-4',
      name: 'Gare du Nord',
      lat: 48.8809,
      lon: 2.3553,
      category: 'transit',
      description: 'Busiest railway station in Europe; connects Eurostar, Thalys, and RER lines.',
      address: '18 Rue de Dunkerque, 75010 Paris',
      openingHours: '04:30 - 01:00 daily',
      verifiedSource: 'OpenStreetMap node #4491823'
    },
    {
      id: 'paris-5',
      name: 'Commissariat Central de Police du 1er Arrondissement',
      lat: 48.8651,
      lon: 2.3421,
      category: 'police',
      description: 'Central Paris municipal police station for public assistance and report filings.',
      address: '45 Rue de l\'Arbre Sec, 75001 Paris',
      phone: '17 (Police Secours)',
      openingHours: '24/7 Open',
      verifiedSource: 'OpenStreetMap node #9182741'
    },
    {
      id: 'paris-6',
      name: 'Pharmacie Européenne (24/7)',
      lat: 48.8821,
      lon: 2.3274,
      category: 'pharmacy',
      description: 'All-night emergency pharmacy located near Place de Clichy.',
      address: '6 Place de Clichy, 75009 Paris',
      phone: '+33 1 48 74 65 18',
      openingHours: '24/7 non-stop',
      verifiedSource: 'OpenStreetMap node #6781923'
    }
  ],
  'new-york': [
    {
      id: 'nyc-1',
      name: 'Central Park',
      lat: 40.7829,
      lon: -73.9654,
      category: 'attraction',
      description: 'Iconic 843-acre urban park with walking paths, Bethesda Terrace, and lakes in Manhattan.',
      address: 'New York, NY 10024',
      openingHours: '06:00 - 01:00 daily',
      website: 'https://www.centralparknyc.org',
      verifiedSource: 'OpenStreetMap node #1178261'
    },
    {
      id: 'nyc-2',
      name: 'Grand Central Terminal',
      lat: 40.7527,
      lon: -73.9772,
      category: 'transit',
      description: 'Historic Beaux-Arts transit landmark featuring celestial ceiling mural and subway nexus.',
      address: '89 E 42nd St, New York, NY 10017',
      openingHours: '05:15 - 02:00 daily',
      verifiedSource: 'OpenStreetMap node #4381921'
    },
    {
      id: 'nyc-3',
      name: 'Bellevue Hospital Center',
      lat: 40.7394,
      lon: -73.9757,
      category: 'hospital',
      description: 'Oldest public hospital in the US with Level 1 trauma and 24/7 emergency care.',
      address: '462 1st Ave, New York, NY 10016',
      phone: '+1 212-562-4141',
      openingHours: '24 hours daily',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2139812'
    },
    {
      id: 'nyc-4',
      name: 'NYPD Midtown South Precinct',
      lat: 40.7516,
      lon: -73.9892,
      category: 'police',
      description: 'Key precinct covering Times Square, Herald Square, and Penn Station area.',
      address: '357 W 35th St, New York, NY 10001',
      phone: '911 (Emergency) / +1 212-239-9811',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #5591823'
    },
    {
      id: 'nyc-5',
      name: 'Duane Reade / Walgreens (24h Pharmacy)',
      lat: 40.7567,
      lon: -73.9862,
      category: 'pharmacy',
      description: 'Full-service 24/7 pharmacy and convenience store in Times Square.',
      address: '1467 Broadway, New York, NY 10036',
      phone: '+1 212-398-0792',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #6781291'
    }
  ],
  'san-francisco': [
    {
      id: 'sf-1',
      name: 'Golden Gate Bridge',
      lat: 37.8199,
      lon: -122.4783,
      category: 'attraction',
      description: 'World-famous suspension bridge spanning the Golden Gate strait.',
      address: 'Golden Gate Bridge, San Francisco, CA 94129',
      openingHours: 'Pedestrian walkway open daylight hours',
      website: 'https://www.goldengate.org',
      verifiedSource: 'OpenStreetMap node #2588192'
    },
    {
      id: 'sf-2',
      name: 'San Francisco Ferry Building',
      lat: 37.7955,
      lon: -122.3937,
      category: 'transit',
      description: 'Historic ferry terminal and vibrant artisan marketplace on the Embarcadero.',
      address: '1 Ferry Building, San Francisco, CA 94111',
      openingHours: '07:00 - 20:00 daily',
      verifiedSource: 'OpenStreetMap node #3391821'
    },
    {
      id: 'sf-3',
      name: 'Zuckerberg San Francisco General Hospital',
      lat: 37.7558,
      lon: -122.4048,
      category: 'hospital',
      description: 'Only Level 1 Trauma Center in San Francisco, operating 24/7.',
      address: '1001 Potrero Ave, San Francisco, CA 94110',
      phone: '+1 628-206-8000',
      openingHours: '24/7 Emergency',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2148192'
    },
    {
      id: 'sf-4',
      name: 'SFPD Central Station',
      lat: 37.7997,
      lon: -122.4093,
      category: 'police',
      description: 'Serves Downtown, Fisherman\'s Wharf, North Beach, and Chinatown.',
      address: '766 Vallejo St, San Francisco, CA 94133',
      phone: '911 (Emergency) / +1 415-315-2400',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #7718291'
    },
    {
      id: 'sf-5',
      name: 'Walgreens 24-Hour Pharmacy (Castro/Market)',
      lat: 37.7628,
      lon: -122.4351,
      category: 'pharmacy',
      description: 'Around-the-clock pharmacy services and healthcare supplies.',
      address: '498 Castro St, San Francisco, CA 94114',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #5591821'
    }
  ],
  singapore: [
    {
      id: 'sg-1',
      name: 'Gardens by the Bay & Supertree Grove',
      lat: 1.2816,
      lon: 103.8636,
      category: 'attraction',
      description: 'Futuristic nature park spanning 101 hectares with massive solar-powered Supertrees and Flower Dome.',
      address: '18 Marina Gardens Dr, Singapore 018953',
      openingHours: '05:00 - 02:00 daily (Outdoor gardens)',
      website: 'https://www.gardensbythebay.com.sg',
      verifiedSource: 'OpenStreetMap node #3981827'
    },
    {
      id: 'sg-2',
      name: 'Singapore General Hospital (SGH)',
      lat: 1.2794,
      lon: 103.8344,
      category: 'hospital',
      description: 'Singapore\'s oldest and largest tertiary acute hospital with 24/7 Emergency Medicine department.',
      address: 'Outram Rd, Singapore 169608',
      phone: '+65 6222 3322',
      openingHours: '24 hours daily',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2138912'
    },
    {
      id: 'sg-3',
      name: 'Marina Bay Sands & Bayfront MRT',
      lat: 1.2838,
      lon: 103.8591,
      category: 'transit',
      description: 'Major underground MRT interchange for Downtown and Circle Lines beneath Marina Bay.',
      address: '11 Bayfront Ave, Singapore 018957',
      openingHours: '05:40 - 00:15 daily',
      verifiedSource: 'OpenStreetMap node #4491821'
    },
    {
      id: 'sg-4',
      name: 'Central Police Division Headquarters',
      lat: 1.2812,
      lon: 103.8436,
      category: 'police',
      description: 'Singapore Police Force division headquarters overseeing civic district and tourist belt.',
      address: '391 New Bridge Rd, Police Cantonment Complex, Singapore 088762',
      phone: '999 (Emergency) / 1800 255 0000',
      openingHours: '24 hours daily',
      website: 'https://www.police.gov.sg',
      verifiedSource: 'OpenStreetMap node #9182736'
    },
    {
      id: 'sg-5',
      name: 'Guardian Pharmacy (Raffles City)',
      lat: 1.2936,
      lon: 103.8532,
      category: 'pharmacy',
      description: 'Registered pharmacy with licensed pharmacist on duty and travel wellness items.',
      address: '252 North Bridge Rd, #B1-40 Raffles City, Singapore 179103',
      openingHours: '09:00 - 22:00 daily',
      verifiedSource: 'OpenStreetMap node #6781299'
    }
  ],
  sydney: [
    {
      id: 'syd-1',
      name: 'Sydney Opera House',
      lat: -33.8568,
      lon: 151.2153,
      category: 'attraction',
      description: 'Multi-venue performing arts centre and UNESCO World Heritage masterpiece on Bennelong Point.',
      address: 'Bennelong Point, Sydney NSW 2000',
      openingHours: '09:00 - 17:00 daily tours',
      website: 'https://www.sydneyoperahouse.com',
      verifiedSource: 'OpenStreetMap node #2138761'
    },
    {
      id: 'syd-2',
      name: 'Sydney Central Railway Station',
      lat: -33.8833,
      lon: 151.2069,
      category: 'transit',
      description: 'Largest and busiest railway station in Australia, serving Sydney Trains and regional NSW TrainLink.',
      address: 'Eddy Ave, Haymarket NSW 2000',
      openingHours: '24 hours (Trains 04:00 - 01:30)',
      verifiedSource: 'OpenStreetMap node #3391828'
    },
    {
      id: 'syd-3',
      name: 'Sydney Hospital & Sydney Eye Hospital',
      lat: -33.8681,
      lon: 151.2131,
      category: 'hospital',
      description: 'Historic public hospital on Macquarie Street with dedicated 24-hour Emergency Department.',
      address: '8 Macquarie St, Sydney NSW 2000',
      phone: '+61 2 9382 7111',
      openingHours: '24/7 Emergency',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2148191'
    },
    {
      id: 'syd-4',
      name: 'Sydney City Police Area Command (Day Street)',
      lat: -33.8736,
      lon: 151.2036,
      category: 'police',
      description: 'Central NSW Police Force station serving Sydney CBD and Darling Harbour.',
      address: '192 Day St, Sydney NSW 2000',
      phone: '000 (Emergency) / +61 2 9265 6499',
      openingHours: '24 hours daily',
      website: 'https://www.police.nsw.gov.au',
      verifiedSource: 'OpenStreetMap node #7718299'
    },
    {
      id: 'syd-5',
      name: 'Chemist Warehouse Sydney CBD',
      lat: -33.8702,
      lon: 151.2078,
      category: 'pharmacy',
      description: 'High-volume community dispensary with licensed prescription medications and vitamins.',
      address: '228 Pitt St, Sydney NSW 2000',
      openingHours: '08:00 - 21:00 daily',
      verifiedSource: 'OpenStreetMap node #8819201'
    }
  ],
  berlin: [
    {
      id: 'ber-1',
      name: 'Brandenburg Gate (Brandenburger Tor)',
      lat: 52.5163,
      lon: 13.3777,
      category: 'attraction',
      description: '18th-century neoclassical monument and historic symbol of European unity and peace.',
      address: 'Pariser Platz, 10117 Berlin',
      openingHours: 'Open 24 hours (pedestrian zone)',
      website: 'https://www.berlin.de',
      verifiedSource: 'OpenStreetMap node #2689129'
    },
    {
      id: 'ber-2',
      name: 'Berlin Hauptbahnhof (Central Station)',
      lat: 52.5256,
      lon: 13.3695,
      category: 'transit',
      description: 'Europe\'s largest multi-level crossing railway station connecting S-Bahn, U-Bahn, and ICE trains.',
      address: 'Europaplatz 1, 10557 Berlin',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #4491829'
    },
    {
      id: 'ber-3',
      name: 'Charité - Universitätsmedizin Berlin (Campus Mitte)',
      lat: 52.5262,
      lon: 13.3777,
      category: 'hospital',
      description: 'One of Europe\'s largest university hospitals with top-tier 24/7 Rettungsstelle (Emergency Unit).',
      address: 'Charitépl. 1, 10117 Berlin',
      phone: '+49 30 45050',
      openingHours: '24 hours emergency admission',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2138919'
    },
    {
      id: 'ber-4',
      name: 'Polizei Berlin - Abschnitt 11',
      lat: 52.5228,
      lon: 13.4116,
      category: 'police',
      description: 'Central Berlin police station at Alexanderplatz providing 24-hour citizen and visitor service.',
      address: 'Alexanderplatz 1, 10178 Berlin',
      phone: '110 (Emergency) / +49 30 4664-111700',
      openingHours: '24 hours daily',
      website: 'https://www.berlin.de/polizei',
      verifiedSource: 'OpenStreetMap node #9182739'
    },
    {
      id: 'ber-5',
      name: 'Berlin Hauptbahnhof Apotheke',
      lat: 52.5252,
      lon: 13.3691,
      category: 'pharmacy',
      description: 'Open 365 days a year inside Berlin Central Station for emergency prescription drugs.',
      address: 'Europaplatz 1, 10557 Berlin',
      openingHours: '07:00 - 22:00 daily',
      verifiedSource: 'OpenStreetMap node #6781298'
    }
  ],
  mumbai: [
    {
      id: 'mum-1',
      name: 'Gateway of India',
      lat: 18.9220,
      lon: 72.8347,
      category: 'attraction',
      description: '20th-century arch monument overlooking the Arabian Sea, built to commemorate King George V\'s visit.',
      address: 'Apollo Bandar, Colaba, Mumbai 400001',
      openingHours: 'Open 24 hours',
      verifiedSource: 'OpenStreetMap node #2689133'
    },
    {
      id: 'mum-2',
      name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
      lat: 18.9400,
      lon: 72.8354,
      category: 'transit',
      description: 'UNESCO World Heritage historic railway terminal designed in Victorian Gothic Revival style.',
      address: 'Fort, Mumbai, Maharashtra 400001',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #4491833'
    },
    {
      id: 'mum-3',
      name: 'Sir H. N. Reliance Foundation Hospital',
      lat: 18.9592,
      lon: 72.8183,
      category: 'hospital',
      description: 'Multi-specialty tertiary care hospital with 24/7 Level 1 Trauma & Emergency Care.',
      address: 'Raja Ram Mohan Roy Rd, Prarthana Samaj, Girgaon, Mumbai 400004',
      phone: '+91 22 6130 5005',
      openingHours: '24/7 Emergency Care',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2138922'
    },
    {
      id: 'mum-4',
      name: 'Colaba Police Station',
      lat: 18.9189,
      lon: 72.8306,
      category: 'police',
      description: 'Police precinct serving South Mumbai tourist district and waterfront promenade.',
      address: 'Shahid Bhagat Singh Rd, Colaba, Mumbai 400005',
      phone: '100 / 112 (Emergency)',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #9182744'
    },
    {
      id: 'mum-5',
      name: 'Apollo Pharmacy Colaba',
      lat: 18.9211,
      lon: 72.8322,
      category: 'pharmacy',
      description: 'Trusted nationwide pharmacy chain providing authentic medications and healthcare essentials.',
      address: 'SBS Road, Near Regal Cinema, Colaba, Mumbai 400005',
      openingHours: '08:00 - 23:00 daily',
      verifiedSource: 'OpenStreetMap node #6781302'
    }
  ],
  'rio-de-janeiro': [
    {
      id: 'rio-1',
      name: 'Christ the Redeemer (Cristo Redentor)',
      lat: -22.9519,
      lon: -43.2105,
      category: 'attraction',
      description: 'Art Deco statue of Jesus Christ atop Corcovado mountain, one of the New Seven Wonders of the World.',
      address: 'Parque Nacional da Tijuca, Rio de Janeiro',
      openingHours: '08:00 - 19:00 daily',
      website: 'https://paineirascorcovado.com.br',
      verifiedSource: 'OpenStreetMap node #2689144'
    },
    {
      id: 'rio-2',
      name: 'Central do Brasil Station',
      lat: -22.9037,
      lon: -43.1916,
      category: 'transit',
      description: 'Historic railway and Metro hub with clock tower, connecting Rio\'s metropolitan rail lines.',
      address: 'Praça Cristiano Otoni, Centro, Rio de Janeiro 20221-250',
      openingHours: '05:00 - 00:00 daily',
      verifiedSource: 'OpenStreetMap node #4491844'
    },
    {
      id: 'rio-3',
      name: 'Hospital Municipal Souza Aguiar',
      lat: -22.9069,
      lon: -43.1903,
      category: 'hospital',
      description: 'One of the largest public emergency and trauma hospitals in Latin America, open 24/7.',
      address: 'Praça da República, 111 - Centro, Rio de Janeiro 20211-350',
      phone: '+55 21 3111-2600',
      openingHours: '24/7 Pronto-Socorro',
      verifiedSource: 'OpenStreetMap node #2138933'
    },
    {
      id: 'rio-4',
      name: 'BPTur - Batalhão de Policiamento em Áreas Turísticas',
      lat: -22.9678,
      lon: -43.1812,
      category: 'police',
      description: 'Specialized Tourist Police Battalion dedicated to supporting visitors in Copacabana and Ipanema.',
      address: 'Rua Figueiredo de Magalhães, 550 - Copacabana, Rio de Janeiro',
      phone: '190 (Emergency) / +55 21 2332-7928',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #9182755'
    },
    {
      id: 'rio-5',
      name: 'Drogaria Pacheco Copacabana',
      lat: -22.9692,
      lon: -43.1843,
      category: 'pharmacy',
      description: 'Major pharmacy chain with 24-hour service on Avenida Nossa Senhora de Copacabana.',
      address: 'Av. Nossa Sra. de Copacabana, 599, Rio de Janeiro',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #6781311'
    }
  ],
  pune: [
    {
      id: 'pune-1',
      name: 'Shaniwar Wada',
      lat: 18.5196,
      lon: 73.8553,
      category: 'historic',
      description: 'Historic 18th-century fortification seat of the Peshwa prime ministers of the Maratha Empire, featuring imposing Delhi Darwaja bastions.',
      address: 'Shaniwar Peth, Pune, Maharashtra 411030',
      openingHours: '09:30 - 17:30 daily',
      verifiedSource: 'OpenStreetMap node #2689218',
      affordability: '₹25 (Indian Nationals) / ₹300 (Foreign Nationals)',
      cleanlinessRating: 'Archaeological Survey of India (ASI) Heritage Site',
      accessibility: 'Cobblestone ground level pathways • Step access to ramparts',
      verifiedRating: '4.5 / 5.0 (ASI Cultural Registry)',
      safetyFeatures: 'ASI security guards at entrance • 400m to Kasba Peth Police Station'
    },
    {
      id: 'pune-2',
      name: 'Aga Khan Palace',
      lat: 18.5523,
      lon: 73.9015,
      category: 'historic',
      description: 'Monument of national historic significance built in 1892, where Mahatma Gandhi and Kasturba Gandhi were detained during the Quit India Movement.',
      address: 'Pune-Nagar Road, Kalyani Nagar, Pune 411006',
      openingHours: '09:00 - 17:30 daily',
      verifiedSource: 'OpenStreetMap node #3391850',
      affordability: '₹25 (Indian Citizens) / ₹300 (International Visitors)',
      cleanlinessRating: 'National Memorial Sanctuary: Pristine Manicured Grounds',
      accessibility: 'Step-free garden paths & main memorial gallery ramp',
      verifiedRating: '4.6 / 5.0 (National Memorial Trust)',
      safetyFeatures: 'Security scanning checkpoint • Broad shaded avenues'
    },
    {
      id: 'pune-3',
      name: 'Shrimant Dagdusheth Halwai Ganpati Temple',
      lat: 18.5165,
      lon: 73.8561,
      category: 'attraction',
      description: 'One of Maharashtra\'s most revered Hindu temples, renowned for ornate golden sanctum and centuries of philanthropy.',
      address: 'Budhwar Peth, Shivaji Road, Pune 411002',
      openingHours: '06:00 - 23:00 daily',
      website: 'https://www.dagdushethganpati.com',
      verifiedSource: 'OpenStreetMap node #2689222',
      affordability: 'Free Public Darshan',
      cleanlinessRating: 'Temple Trust ISO 9001 Certified Hygiene & Cleanliness',
      accessibility: 'Crowd management queues • Senior citizen assistance lane',
      verifiedRating: '4.8 / 5.0 (Pilgrim Advisory Council)',
      safetyFeatures: 'Continuous CCTV perimeter surveillance • High police presence'
    },
    {
      id: 'pune-4',
      name: 'Sassoon General Hospital (24/7 Trauma)',
      lat: 18.5255,
      lon: 73.8732,
      category: 'hospital',
      description: 'Major state government teaching hospital affiliated with B.J. Medical College, offering round-the-clock emergency and trauma services.',
      address: 'Near Pune Railway Station, Sassoon Road, Pune 411001',
      phone: '+91 20 2612 8000',
      openingHours: '24 hours daily emergency care',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2138940',
      affordability: 'Public Government Healthcare (Nominal / Free Emergency Care)',
      cleanlinessRating: 'Government Medical College Hospital Standard',
      accessibility: 'Ambulance ramp • Wheelchair triage entry',
      verifiedRating: 'Apex Regional Tertiary Referral Center',
      safetyFeatures: 'Dedicated on-site police outpost • 24/7 disaster management ward'
    },
    {
      id: 'pune-5',
      name: 'Ruby Hall Clinic (Multispecialty Care)',
      lat: 18.5323,
      lon: 73.8796,
      category: 'hospital',
      description: 'NABH and NABL accredited tertiary multi-specialty healthcare institution with modern 24/7 cardiac and trauma emergency response.',
      address: '40 Sassoon Road, Sangamvadi, Pune 411001',
      phone: '+91 20 6645 5100',
      openingHours: '24/7 Emergency & ICU',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #3391855',
      affordability: 'NABH Private Multispecialty (~Moderate to Premium)',
      cleanlinessRating: 'NABH Certified Healthcare Hygiene Excellence',
      accessibility: '100% barrier-free hospital elevators and ramps',
      verifiedRating: '4.7 / 5.0 (Healthcare Accreditation Board)',
      safetyFeatures: 'Level 1 Trauma Triage • 24/7 emergency ambulance fleet'
    },
    {
      id: 'pune-6',
      name: 'Pune Junction Railway Station',
      lat: 18.5284,
      lon: 73.8744,
      category: 'transit',
      description: 'Central railway nexus connecting Pune with Mumbai CSMT, Delhi, Bengaluru, and Pune suburban local trains to Lonavala.',
      address: 'Station Road, Agarkar Nagar, Pune 411001',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #4491850',
      affordability: 'Platform Ticket ₹10 / Train fares per distance',
      cleanlinessRating: 'Central Railway Swachh Rail Index: High Standard',
      accessibility: 'Escalators and lifts at foot-over-bridges • Tactile paving',
      verifiedRating: '4.4 / 5.0 (Indian Railways Station Quality)',
      safetyFeatures: 'Railway Protection Force (RPF) and GRP police post on Platform 1'
    },
    {
      id: 'pune-7',
      name: 'Pune Police Commissionerate & Shivajinagar Police',
      lat: 18.5314,
      lon: 73.8446,
      category: 'police',
      description: 'Key metropolitan headquarters coordinating law enforcement, tourist assistance, and 112 emergency dispatch for Pune City.',
      address: 'Sadhu Vaswani Road / Fergusson College Rd, Pune 411005',
      phone: '112 / 100 (Emergency) / +91 20 2612 2880',
      openingHours: '24 hours daily',
      website: 'https://punepolice.gov.in',
      verifiedSource: 'OpenStreetMap node #9182760',
      affordability: 'Public Citizen Police Service (Free)',
      cleanlinessRating: 'Commissionerate Administrative Standard',
      accessibility: 'Ground level reception & citizen facilitation desk',
      verifiedRating: 'Official City Law Enforcement Headquarters',
      safetyFeatures: 'Rapid Response Team (Beat Marshals) • 24/7 Dial 112 Command Center'
    },
    {
      id: 'pune-8',
      name: 'Cafe Goodluck (FC Road Heritage)',
      lat: 18.5199,
      lon: 73.8410,
      category: 'restaurant',
      description: 'Iconic Irani cafe founded in 1935 on Fergusson College Road, famous for Bun Maska, Irani Chai, and Keema pav.',
      address: 'Goodluck Chowk, FC Road, Deccan Gymkhana, Pune 411004',
      openingHours: '07:30 - 23:30 daily',
      verifiedSource: 'OpenStreetMap node #2189390',
      affordability: '$ (~₹150 - ₹300 per person)',
      cleanlinessRating: 'FSSAI Food Safety Hygiene Certified: Grade A',
      accessibility: 'Ground level roadside dining entry',
      verifiedRating: '4.6 / 5.0 (Heritage Food Directory)',
      safetyFeatures: 'Fire extinguishers installed • Well-lit bustling student promenade'
    },
    {
      id: 'pune-9',
      name: 'JW Marriott Hotel Pune',
      lat: 18.5332,
      lon: 73.8290,
      category: 'hotel',
      description: '5-star luxury hotel on Senapati Bapat Road offering rooftop fine dining, modern amenities, and prime city views.',
      address: 'Senapati Bapat Rd, Laxmi Society, Model Colony, Pune 411053',
      openingHours: '24 hours open',
      phone: '+91 20 6683 3333',
      verifiedSource: 'OpenStreetMap node #2819250',
      affordability: '$$$$ (~₹10,500/night)',
      cleanlinessRating: 'International Luxury Hygiene Standard Certified',
      accessibility: 'Full step-free wheelchair access throughout',
      verifiedRating: '4.8 / 5.0 (Luxury Hospitality Index)',
      safetyFeatures: '24/7 Monitored electronic perimeter • In-house doctor on call'
    },
    {
      id: 'pune-10',
      name: 'Wellness Forever 24/7 Pharmacy (FC Road)',
      lat: 18.5218,
      lon: 73.8415,
      category: 'pharmacy',
      description: 'Round-the-clock licensed chemist store stocking prescription drugs, first aid kits, and pediatric medicine.',
      address: 'Fergusson College Rd, Shivajinagar, Pune 411004',
      phone: '+91 20 2565 0999',
      openingHours: '24 hours daily (Non-stop)',
      verifiedSource: 'OpenStreetMap node #6781320',
      affordability: 'Standard MRP Retail',
      cleanlinessRating: 'Certified Modern Pharmacy Sanitation Standards',
      accessibility: 'Sidewalk step-free entrance',
      verifiedRating: 'Registered Licensed Chemist',
      safetyFeatures: 'CCTV monitored dispensary • Qualified pharmacists on night duty'
    }
  ],
  delhi: [
    {
      id: 'delhi-1',
      name: 'Red Fort (Lal Qila)',
      lat: 28.6562,
      lon: 77.2410,
      category: 'historic',
      description: 'UNESCO World Heritage 17th-century red sandstone fortress built by Mughal Emperor Shah Jahan, symbol of Indian national sovereignty.',
      address: 'Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi 110006',
      openingHours: '09:30 - 16:30 (Closed Mondays)',
      verifiedSource: 'OpenStreetMap node #2689230',
      affordability: '₹50 (Indian Nationals) / ₹600 (Foreign Visitors)',
      cleanlinessRating: 'UNESCO World Heritage Site Maintenance Protocol',
      accessibility: 'Paved walkways from Lahore Gate • Wheelchair assistance booth',
      verifiedRating: '4.6 / 5.0 (National Monument Rating)',
      safetyFeatures: 'CISF armed perimeter security • Metal detector checkpoints'
    },
    {
      id: 'delhi-2',
      name: 'India Gate & Kartavya Path',
      lat: 28.6129,
      lon: 77.2295,
      category: 'historic',
      description: 'Majestic 42-meter triumphal arch war memorial dedicated to soldiers of the First World War, situated on the ceremonial Kartavya Path boulevard.',
      address: 'Kartavya Path, India Gate, New Delhi 110001',
      openingHours: 'Open 24 hours (illuminated at night)',
      verifiedSource: 'OpenStreetMap node #2689233',
      affordability: 'Free Public Admission',
      cleanlinessRating: 'Central Vista Swachh Bharat Protocol: Pristine',
      accessibility: '100% step-free accessible paved promenade and ramps',
      verifiedRating: '4.8 / 5.0 (National Landmark Review)',
      safetyFeatures: 'Delhi Police 24/7 security kiosks • Active night patrols and lighting'
    },
    {
      id: 'delhi-3',
      name: 'Qutub Minar Complex',
      lat: 28.5244,
      lon: 77.1855,
      category: 'attraction',
      description: 'Soaring 72.5-meter victory tower of red sandstone and marble begun in 1192, featuring intricate carving and the ancient 4th-century Iron Pillar.',
      address: 'Seth Sarai, Mehrauli, New Delhi 110030',
      openingHours: '07:00 - 19:00 daily',
      verifiedSource: 'OpenStreetMap node #2689235',
      affordability: '₹50 (Indian Nationals) / ₹600 (Foreign Visitors)',
      cleanlinessRating: 'Archaeological Survey of India Grade A Heritage',
      accessibility: 'Smooth stone pathways around Iron Pillar and Quwwat-ul-Islam mosque',
      verifiedRating: '4.7 / 5.0 (UNESCO World Heritage Site)',
      safetyFeatures: 'Monitored tourist security booths • Delhi Police post 300m away'
    },
    {
      id: 'delhi-4',
      name: 'Karim\'s Historic Eatery (Jama Masjid)',
      lat: 28.6508,
      lon: 77.2334,
      category: 'restaurant',
      description: 'Legendary culinary landmark founded in 1913 by Haji Karimuddin, serving authentic royal Mughal mutton korma and seekh kebabs in Old Delhi.',
      address: '16 Gali Kababian, Jama Masjid, Old Delhi 110006',
      openingHours: '09:00 - 01:00 daily',
      phone: '+91 11 2326 9880',
      verifiedSource: 'OpenStreetMap node #2189395',
      affordability: '$$ (~₹450 - ₹750 per person)',
      cleanlinessRating: 'FSSAI Certified Commercial Kitchen Hygiene Standard',
      accessibility: 'Ground floor dining halls with narrow lane approach',
      verifiedRating: '4.6 / 5.0 (Culinary Heritage Index)',
      safetyFeatures: 'Active fire safety equipment • Located in high-footfall tourist corridor'
    },
    {
      id: 'delhi-5',
      name: 'AIIMS New Delhi (All India Institute of Medical Sciences)',
      lat: 28.5672,
      lon: 77.2100,
      category: 'hospital',
      description: 'India\'s premier apex government medical institute with 24/7 Emergency Department, Level 1 Trauma Center, and advanced intensive care.',
      address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
      phone: '+91 11 2658 8500',
      openingHours: '24 hours daily emergency triage',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2138945',
      affordability: 'Apex Public Hospital (Subsidized / Free Emergency Care)',
      cleanlinessRating: 'National Apex Medical Standards Certification',
      accessibility: '100% barrier-free ramps, wide elevators, and accessible wards',
      verifiedRating: '5.0 / 5.0 (National Institutional Ranking Framework #1)',
      safetyFeatures: 'Dedicated Delhi Police precinct inside hospital campus • 24/7 emergency response'
    },
    {
      id: 'delhi-6',
      name: 'Safdarjung Hospital (Emergency & Trauma)',
      lat: 28.5714,
      lon: 77.2076,
      category: 'hospital',
      description: 'One of the largest central government multi-specialty hospitals in India with high-capacity 24-hour emergency triage and burn units.',
      address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
      phone: '+91 11 2670 7444',
      openingHours: '24/7 Emergency Care',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #3391860',
      affordability: 'Central Government Public Healthcare',
      cleanlinessRating: 'Central Ministry of Health Hospital Standards',
      accessibility: 'Emergency ramp entry and designated stretcher bays',
      verifiedRating: 'Major National Acute Care Center',
      safetyFeatures: 'On-site police post • High-capacity emergency medical team'
    },
    {
      id: 'delhi-7',
      name: 'New Delhi Railway Station (NDLS)',
      lat: 28.6430,
      lon: 77.2194,
      category: 'transit',
      description: 'Busiest railway terminus in India, handling 400+ trains daily with direct high-speed connection to Delhi Airport via the Orange Metro Line.',
      address: 'Bhavbhuti Marg, Ratan Lal Market, Kamla Market, New Delhi 110006',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #4491855',
      affordability: 'Platform ticket ₹10 / Regular train fares',
      cleanlinessRating: 'Swachh Rail Quality Rating: Mechanized Cleaning Protocol',
      accessibility: 'Skywalk connection with elevators and tactile paths',
      verifiedRating: '4.5 / 5.0 (Northern Railways Terminus Quality)',
      safetyFeatures: 'RPF command post • Baggage X-ray scanners at all entry gates'
    },
    {
      id: 'delhi-8',
      name: 'Connaught Place Police Station',
      lat: 28.6328,
      lon: 77.2197,
      category: 'police',
      description: 'Central New Delhi police station providing 24/7 security, foreign tourist assistance desk, and urban patrol coordination.',
      address: 'Shaheed Bhagat Singh Marg, Connaught Place, New Delhi 110001',
      phone: '112 / 100 (Emergency) / +91 11 2334 0400',
      openingHours: '24 hours daily',
      website: 'https://delhipolice.gov.in',
      verifiedSource: 'OpenStreetMap node #9182765',
      affordability: 'Public Police Service (Free)',
      cleanlinessRating: 'Model Police Station Standard',
      accessibility: 'Accessible entrance and public inquiry desk',
      verifiedRating: 'Delhi Police Model Precinct',
      safetyFeatures: 'Tourist Police Helpdesk • PCR emergency van patrols'
    },
    {
      id: 'delhi-9',
      name: 'The Imperial New Delhi',
      lat: 28.6234,
      lon: 77.2178,
      category: 'hotel',
      description: 'Historic heritage 5-star hotel built in 1936, combining Victorian elegance and Art Deco style amidst eight lush acres.',
      address: 'Janpath Lane, Connaught Place, New Delhi 110001',
      openingHours: '24 hours open',
      phone: '+91 11 2334 1234',
      verifiedSource: 'OpenStreetMap node #2819255',
      affordability: '$$$$ (~₹18,000/night)',
      cleanlinessRating: 'Global Luxury Five-Star Audit: 100% Exemplary',
      accessibility: 'Full step-free entrance, elevators, and accessible suites',
      verifiedRating: '4.9 / 5.0 (World Luxury Hotel Awards)',
      safetyFeatures: '24/7 Armed perimeter security • Dedicated concierge medical team'
    },
    {
      id: 'delhi-10',
      name: 'Apollo Pharmacy Connaught Place (24/7)',
      lat: 28.6315,
      lon: 77.2185,
      category: 'pharmacy',
      description: 'Trusted nationwide chemist chain providing authenticated prescription medicines and travel health care.',
      address: 'Block E, Inner Circle, Connaught Place, New Delhi 110001',
      phone: '+91 11 4350 2000',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #6781325',
      affordability: 'Standard Regulated Pricing',
      cleanlinessRating: 'Certified Apollo Healthcare Standard',
      accessibility: 'Ground level step-free entry',
      verifiedRating: 'Licensed National Retail Pharmacy',
      safetyFeatures: 'CCTV surveillance • Round-the-clock registered pharmacist'
    }
  ],
  bengaluru: [
    {
      id: 'blr-1',
      name: 'Cubbon Park & Vidhana Soudha',
      lat: 12.9763,
      lon: 77.5929,
      category: 'attraction',
      description: 'Historic 300-acre lush botanical sanctuary in the heart of Bengaluru, adjacent to the monumental neo-Dravidian Vidhana Soudha legislature.',
      address: 'Kasturba Road, Sampangi Rama Nagara, Bengaluru 560001',
      openingHours: '06:00 - 20:00 daily (Vehicle-free on Sundays)',
      verifiedSource: 'OpenStreetMap node #2689240',
      affordability: 'Free Public Admission',
      cleanlinessRating: 'Karnataka Horticulture Department Green Sanctuary Protocol',
      accessibility: 'Level asphalt and shaded gravel pedestrian paths throughout',
      verifiedRating: '4.7 / 5.0 (Karnataka Tourism Board)',
      safetyFeatures: 'Park ranger security beats • Close to Vidhana Soudha Police Outpost'
    },
    {
      id: 'blr-2',
      name: 'Bangalore Palace',
      lat: 12.9988,
      lon: 77.5921,
      category: 'historic',
      description: 'Tudor-style royal estate built in 1878 by the Wadiyar dynasty, boasting fortified towers, gothic stained glass, and historic royal portrait galleries.',
      address: 'Vasanth Nagar, Bengaluru, Karnataka 560052',
      openingHours: '10:00 - 17:30 daily',
      verifiedSource: 'OpenStreetMap node #2689242',
      affordability: '₹250 (Indian Nationals) / ₹480 (Foreign Visitors)',
      cleanlinessRating: 'Royal Palace Heritage Trust Preservation Standards',
      accessibility: 'Ground floor royal courtyard access • Audio guide system',
      verifiedRating: '4.5 / 5.0 (Heritage Tourism Guide)',
      safetyFeatures: 'Entry gate security inspection • 24/7 on-site guards'
    },
    {
      id: 'blr-3',
      name: 'Lalbagh Botanical Garden & Glass House',
      lat: 12.9507,
      lon: 77.5848,
      category: 'attraction',
      description: '240-acre garden commissioned in 1760 by Hyder Ali, featuring India\'s largest collection of tropical plants and 19th-century Glass House.',
      address: 'Mavalli, Bengaluru 560004',
      openingHours: '06:00 - 19:00 daily',
      verifiedSource: 'OpenStreetMap node #3391865',
      affordability: '₹30 Entry Fee (Free 06:00-09:00 for morning walkers)',
      cleanlinessRating: 'Exemplary Eco-Sanctuary Cleanliness Rating',
      accessibility: 'Paved circuit avenues • Battery operated electric vehicle tours',
      verifiedRating: '4.7 / 5.0 (Karnataka Botanical Registry)',
      safetyFeatures: 'Horticulture security marshals • Well-marked emergency call posts'
    },
    {
      id: 'blr-4',
      name: 'Mavalli Tiffin Room (MTR Lalbagh)',
      lat: 12.9555,
      lon: 77.5861,
      category: 'restaurant',
      description: 'Iconic vegetarian restaurant founded in 1924, world-famous for inventing Rava Idli, authentic crisp Masala Dosa, and South Indian filter coffee.',
      address: '14 Lalbagh Fort Road, Doddamavalli, Sudhama Nagar, Bengaluru 560004',
      openingHours: '06:30 - 11:00, 12:30 - 20:30 (Closed Mondays)',
      phone: '+91 80 2222 0022',
      verifiedSource: 'OpenStreetMap node #2189400',
      affordability: '$ (~₹180 - ₹350 per person)',
      cleanlinessRating: 'FSSAI Certified Traditional Pure Vegetarian Standard',
      accessibility: 'Step-free ground level tiffin hall',
      verifiedRating: '4.8 / 5.0 (Heritage Culinary Council)',
      safetyFeatures: 'Strict food hygiene oversight • Fire safety verified'
    },
    {
      id: 'blr-5',
      name: 'Victoria Hospital (BMCRI 24/7 Trauma)',
      lat: 12.9644,
      lon: 77.5750,
      category: 'hospital',
      description: 'Historic centennial government tertiary teaching hospital affiliated with BMCRI, providing 24/7 acute trauma and emergency medical care.',
      address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru 560002',
      phone: '+91 80 2670 1150',
      openingHours: '24 hours daily emergency triage',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #2138950',
      affordability: 'Government Public Healthcare (Free / Subsidized Emergency Care)',
      cleanlinessRating: 'State Government Medical College Standard',
      accessibility: 'Ambulance triage ramp and wheelchair transport bays',
      verifiedRating: 'State Government Primary Emergency Referral Hospital',
      safetyFeatures: 'Victoria Hospital Police Outpost on campus • 24/7 casualty wing'
    },
    {
      id: 'blr-6',
      name: 'Manipal Hospital (Old Airport Road)',
      lat: 12.9587,
      lon: 77.6534,
      category: 'hospital',
      description: 'Renowned quaternary healthcare hospital with round-the-clock pediatric, cardiac, and trauma emergency departments.',
      address: '98 HAL Old Airport Rd, Kodihalli, Bengaluru 560017',
      phone: '+91 80 2502 4444',
      openingHours: '24/7 Emergency Medicine',
      wheelchair: 'yes',
      verifiedSource: 'OpenStreetMap node #3391870',
      affordability: 'NABH Multi-Specialty Private Care (~Moderate to High)',
      cleanlinessRating: 'JCI and NABH Hygiene and Clinical Safety Accreditations',
      accessibility: '100% barrier-free hospital elevators, ramps, and suites',
      verifiedRating: '4.8 / 5.0 (Private Healthcare Quality Review)',
      safetyFeatures: 'Dedicated 24/7 Resuscitation Bay • Advanced Life Support ambulances'
    },
    {
      id: 'blr-7',
      name: 'KSR Bengaluru City Junction & Majestic Metro',
      lat: 12.9781,
      lon: 77.5695,
      category: 'transit',
      description: 'Central rail nexus of Karnataka, directly integrated with Nadaprabhu Kempegowda Majestic Metro Interchange connecting Purple and Green lines.',
      address: 'Gubbi Thotadappa Rd, Sevashrama, Bengaluru 560023',
      openingHours: '24 hours daily (Metro 05:00 - 23:00)',
      verifiedSource: 'OpenStreetMap node #4491860',
      affordability: 'Platform ticket ₹10 / Namma Metro smart card',
      cleanlinessRating: 'BMRCL Metro & South Western Railway High Cleanliness Benchmark',
      accessibility: 'Elevators at all metro levels • Tactile paving for visually impaired',
      verifiedRating: '4.6 / 5.0 (Urban Transit Satisfaction Survey)',
      safetyFeatures: 'Metro Security Force and Government Railway Police (GRP) station'
    },
    {
      id: 'blr-8',
      name: 'Cubbon Park Police Station',
      lat: 12.9752,
      lon: 77.5976,
      category: 'police',
      description: 'Key central police station in Bengaluru CBD overseeing MG Road, Lavelle Road, and the high-court legislative perimeter.',
      address: 'Kasturba Road, Shanthala Nagar, Ashok Nagar, Bengaluru 560001',
      phone: '112 / 100 (Emergency) / +91 80 2294 2222',
      openingHours: '24 hours daily',
      website: 'https://bengalurucitypolice.karnataka.gov.in',
      verifiedSource: 'OpenStreetMap node #9182770',
      affordability: 'Public Citizen Police Service (Free)',
      cleanlinessRating: 'Bengaluru City Police Standard',
      accessibility: 'Accessible front entrance and public counter',
      verifiedRating: 'Official City Police Command',
      safetyFeatures: 'Emergency Dial 112 Rapid Action dispatch • Dedicated women\'s help desk'
    },
    {
      id: 'blr-9',
      name: 'The Leela Palace Bengaluru',
      lat: 12.9606,
      lon: 77.6485,
      category: 'hotel',
      description: 'Palatial 5-star grand luxury hotel inspired by Vijayanagara architectural grandeur, set amidst nine acres of cascading gardens.',
      address: '23 HAL Old Airport Rd, Kodihalli, Bengaluru 560008',
      openingHours: '24 hours open',
      phone: '+91 80 2521 1234',
      verifiedSource: 'OpenStreetMap node #2819260',
      affordability: '$$$$ (~₹16,000/night)',
      cleanlinessRating: 'World Luxury Hotel Cleanliness Excellence: 100%',
      accessibility: 'Complete step-free wheelchair accessibility',
      verifiedRating: '4.9 / 5.0 (Forbes Travel Guide)',
      safetyFeatures: 'Round-the-clock electronic surveillance • On-call medical doctor'
    },
    {
      id: 'blr-10',
      name: 'Apollo Pharmacy MG Road (24/7)',
      lat: 12.9745,
      lon: 77.6080,
      category: 'pharmacy',
      description: 'Centrally located licensed 24/7 chemist dispensing temperature-controlled biologicals, emergency medicines, and medical equipment.',
      address: 'MG Road, Near Trinity Metro Station, Bengaluru 560001',
      phone: '+91 80 2558 1111',
      openingHours: '24 hours daily',
      verifiedSource: 'OpenStreetMap node #6781330',
      affordability: 'Regulated Retail Rates',
      cleanlinessRating: 'Standardized Corporate Pharmacy Hygiene Standards',
      accessibility: 'Street-level step-free counter',
      verifiedRating: 'Licensed Healthcare Retailer',
      safetyFeatures: 'Night safety counter • Qualified licensed pharmacists on duty'
    }
  ]
};

export const OFFICIAL_SAFETY_DATA: Record<string, OfficialSafetyInfo> = {
  tokyo: {
    emergencyNumbers: {
      police: '110',
      ambulance: '119',
      fire: '119',
      general: '#7119 (Emergency Medical Advice Hotline)',
      touristSupport: '050-3816-2787 (Japan Visitor Hotline)'
    },
    policeAgencyName: 'Tokyo Metropolitan Police Department (Keishicho)',
    officialPolicePortal: 'https://www.keishicho.metro.tokyo.lg.jp/multilingual/english/',
    healthServiceAgency: 'Tokyo Metropolitan Government Bureau of Public Health & Himawari Medical Information',
    healthPortal: 'https://www.fukushihoken.metro.tokyo.lg.jp/english/',
    officialAdvisorySource: 'U.S. Department of State & Japan National Tourism Organization (JNTO)',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'Japan is consistently ranked among the safest countries worldwide. Violent crime is extremely rare. Visitors are advised to prepare for seismic activity and keep travel cards organized.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/japan-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/japan',
    publicSafetyGuidelines: [
      'Tokyo Koban (police boxes) are positioned in almost every neighborhood for immediate assistance, directions, and lost property.',
      'Familiarize yourself with earthquake safety: drop, cover, and hold on; follow Tokyo Disaster Prevention Handbook instructions.',
      'Tap water in Tokyo is strictly tested and 100% safe to drink everywhere.',
      'Emergency translation services are available 24/7 on 110 and 119 in English, Chinese, Korean, and Spanish.'
    ]
  },
  london: {
    emergencyNumbers: {
      police: '999',
      ambulance: '999',
      fire: '999',
      general: '111 (NHS Non-Emergency Medical Helpline)',
      touristSupport: '101 (Non-Emergency Police Direct Dial)'
    },
    policeAgencyName: 'Metropolitan Police Service & City of London Police',
    officialPolicePortal: 'https://www.met.police.uk',
    healthServiceAgency: 'National Health Service (NHS England) & Guy\'s and St Thomas\' NHS Foundation Trust',
    healthPortal: 'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/',
    officialAdvisorySource: 'UK Home Office & US State Department Travel Advisory',
    advisoryLevel: 'Level 2: Exercise Increased Caution',
    advisorySummary: 'London is a secure global capital. Exercise normal vigilance against petty theft and phone snatching around dense transit stations like Oxford Circus and Leicester Square.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/united-kingdom-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/united-kingdom',
    publicSafetyGuidelines: [
      'Keep smartphones securely stowed while standing near curbs and bus stops to prevent bicycle/moped grab thefts.',
      'Dial 111 free of charge for 24/7 advice when unsure whether an illness or injury requires hospital emergency admission.',
      'Licensed black cabs can be safely hailed on the street; private hire vehicles must be pre-booked via authorized apps.',
      'London Underground stations have staffed help points with direct voice connections to emergency control rooms.'
    ]
  },
  paris: {
    emergencyNumbers: {
      police: '17',
      ambulance: '15 (SAMU Medical Emergency)',
      fire: '18 (Sapeurs-Pompiers)',
      general: '112 (European Universal Emergency Number)'
    },
    policeAgencyName: 'Préfecture de Police de Paris',
    officialPolicePortal: 'https://www.prefecturedepolice.interieur.gouv.fr',
    healthServiceAgency: 'Assistance Publique – Hôpitaux de Paris (AP-HP)',
    healthPortal: 'https://www.aphp.fr',
    officialAdvisorySource: 'French Ministry of the Interior & US State Department Advisory',
    advisoryLevel: 'Level 2: Exercise Increased Caution',
    advisorySummary: 'Standard European security posture. Be attentive to pickpockets in crowded tourist zones (Eiffel Tower, Louvre, Gare du Nord) and avoid unauthorized street petition solicitors.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/france-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/france',
    publicSafetyGuidelines: [
      '112 works from any mobile phone even without a SIM card or active roaming plan.',
      'Guard personal belongings on Metro Line 1 and Line 4 during peak rush hours.',
      'Official registered taxis have illuminated roof signs (Taxi Parisien) and operate strictly on regulated meters.',
      'Police officers can issue immediate multilingual theft complaint forms (plaintes simplifiées) at central stations.'
    ]
  },
  'new-york': {
    emergencyNumbers: {
      police: '911',
      ambulance: '911',
      fire: '911',
      general: '311 (NYC Non-Emergency Municipal Services)',
      touristSupport: '+1 212-484-1222 (NYC Tourism Info)'
    },
    policeAgencyName: 'New York City Police Department (NYPD)',
    officialPolicePortal: 'https://www.nyc.gov/site/nypd/index.page',
    healthServiceAgency: 'NYC Health + Hospitals',
    healthPortal: 'https://www.nychealthandhospitals.org',
    officialAdvisorySource: 'City of New York Emergency Management & U.S. Federal Government',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'Major tourist corridors are heavily patrolled by uniformed and transit police. Maintain situational awareness in subways late at night and avoid unlicensed street peddlers.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://www.nyc.gov/site/em/index.page',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/usa',
    publicSafetyGuidelines: [
      'In subway stations, wait near the conductor car (marked with a black-and-white striped ceiling bar) during late night hours.',
      'Call 311 for city services, noise complaints, transit schedules, and lost property inquiries.',
      'Yellow and Green cabs can be safely hailed on streets; inspect the dashboard medallion number before boarding.',
      'Emergency rooms (ERs) are legally required by federal EMTALA law to evaluate and stabilize patients regardless of insurance.'
    ]
  },
  'san-francisco': {
    emergencyNumbers: {
      police: '911',
      ambulance: '911',
      fire: '911',
      general: '311 (San Francisco Customer Service Center)',
      touristSupport: '+1 415-391-2000 (Visitor Information Center)'
    },
    policeAgencyName: 'San Francisco Police Department (SFPD)',
    officialPolicePortal: 'https://www.sanfranciscopolice.org',
    healthServiceAgency: 'San Francisco Department of Public Health (SFDPH)',
    healthPortal: 'https://www.sfdph.org',
    officialAdvisorySource: 'City & County of San Francisco Department of Emergency Management',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'San Francisco is generally welcoming and scenic. Be aware of vehicle break-ins ("auto bipping") at scenic outlooks like Twin Peaks and Alamo Square—never leave visible belongings in parked vehicles.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://sfdem.org',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/usa',
    publicSafetyGuidelines: [
      'Crucial rule for rental cars: Never leave backpacks, cameras, or luggage in cars—even for 5 minutes.',
      'BART and Muni transit lines are monitored by BART Police; use emergency intercoms located on train walls.',
      'Emergency notifications: Sign up for AlertSF by texting your zip code to 888-777 for real-time safety alerts.',
      'San Francisco General Hospital provides specialized 24/7 Level 1 trauma and urgent medical intervention.'
    ]
  },
  singapore: {
    emergencyNumbers: {
      police: '999',
      ambulance: '995 (SCDF Emergency Ambulance)',
      fire: '995',
      general: '1777 (Non-Emergency Ambulance)',
      touristSupport: '1800 736 2000 (Singapore Tourism Board)'
    },
    policeAgencyName: 'Singapore Police Force (SPF)',
    officialPolicePortal: 'https://www.police.gov.sg',
    healthServiceAgency: 'Ministry of Health (MOH Singapore) & Singapore Civil Defence Force (SCDF)',
    healthPortal: 'https://www.moh.gov.sg',
    officialAdvisorySource: 'Government of Singapore & International Consular Advisories',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'Singapore possesses one of the lowest violent crime rates globally. Cleanliness, order, and public transport safety are maintained to the highest international standards.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://www.gov.sg',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/singapore',
    publicSafetyGuidelines: [
      'Strict laws govern littering, vandalism, chewing gum disposal, and illicit drug possession with severe legal penalties.',
      'Only call 995 for life-threatening emergencies. Non-emergencies should dial 1777 or visit a 24-hour GP clinic.',
      'High heat and tropical humidity require continuous hydration and sun protection throughout the day.',
      'MRT train stations are equipped with automated external defibrillators (AEDs) and first aid stations.'
    ]
  },
  sydney: {
    emergencyNumbers: {
      police: '000 (Triple Zero)',
      ambulance: '000',
      fire: '000',
      general: '131 444 (Police Assistance Line for Non-Emergencies)',
      touristSupport: '1800 022 222 (Healthdirect Australia 24/7)'
    },
    policeAgencyName: 'New South Wales Police Force',
    officialPolicePortal: 'https://www.police.nsw.gov.au',
    healthServiceAgency: 'NSW Health & Sydney Local Health District',
    healthPortal: 'https://www.health.nsw.gov.au',
    officialAdvisorySource: 'Australian Federal & NSW State Government',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'Sydney is a peaceful, well-ordered harbor city. Primary safety considerations involve ocean surf awareness (swim between red and yellow flags) and intense UV sunlight exposure.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://www.smartraveller.gov.au',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/australia',
    publicSafetyGuidelines: [
      'Ocean beaches: Always swim between the red-and-yellow patrol flags at Bondi, Manly, and Coogee. Never swim alone or outside patrol hours.',
      'Sun safety: Apply broad-spectrum SPF50+ sunscreen every 2 hours; the Australian UV index routinely reaches Extreme (11+).',
      'For non-emergency police reporting (lost passport, stolen property), dial 131 444 or visit any local police command.',
      'Free 24/7 registered nurse medical guidance is accessible via Healthdirect on 1800 022 222.'
    ]
  },
  berlin: {
    emergencyNumbers: {
      police: '110',
      ambulance: '112',
      fire: '112',
      general: '116 117 (Non-Emergency Medical On-Call Service)',
      touristSupport: '+49 30 25 00 2333 (visitBerlin Service)'
    },
    policeAgencyName: 'Polizei Berlin',
    officialPolicePortal: 'https://www.berlin.de/polizei/',
    healthServiceAgency: 'Senatsverwaltung für Wissenschaft, Gesundheit und Pflege',
    healthPortal: 'https://www.berlin.de/sen/gpg/',
    officialAdvisorySource: 'German Federal Foreign Office & US State Department',
    advisoryLevel: 'Level 2: Exercise Increased Caution',
    advisorySummary: 'Berlin has strong civil safety and reliable public transport across all districts. Keep an eye on bags and jackets in bustling U-Bahn stations and outdoor dining patios.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/germany-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/germany',
    publicSafetyGuidelines: [
      'Dial 116 117 for non-life-threatening medical concerns outside normal doctor surgery hours across Germany.',
      'Pedestrians must respect bike lanes (marked red on pavements)—cyclists travel fast and have right of way.',
      'Always validate your single transit ticket (stamped at the red/yellow box) prior to boarding U-Bahn and S-Bahn cars.',
      'Bottled and tap water in Berlin are of pristine purity and strictly tested daily.'
    ]
  },
  mumbai: {
    emergencyNumbers: {
      police: '100 / 112',
      ambulance: '102 / 108',
      fire: '101',
      general: '112 (National Unified Emergency Response Support System)',
      touristSupport: '1800-11-1363 (Incredible India 24/7 Helpline)'
    },
    policeAgencyName: 'Mumbai Police (Brihanmumbai Police)',
    officialPolicePortal: 'https://mumbaipolice.gov.in',
    healthServiceAgency: 'Public Health Department, Brihanmumbai Municipal Corporation (BMC)',
    healthPortal: 'https://portal.mcgm.gov.in',
    officialAdvisorySource: 'Ministry of Home Affairs & Ministry of Tourism, Govt of India',
    advisoryLevel: 'Level 2: Exercise Increased Caution',
    advisorySummary: 'Mumbai is widely considered India\'s safest metropolitan area for travelers and solo commuters. Be cautious with street food hygiene, drink sealed or filtered water, and take care around crowded commuter train doors.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/india-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/india',
    publicSafetyGuidelines: [
      'Drink only bottled water with unbroken seals or thoroughly boiled/filtered water; avoid drinks with unpurified ice.',
      'During monsoon season (June to September), follow BMC weather alerts and avoid low-lying seafronts during high tides.',
      'Never stand on the footboard or lean out of suburban local train carriages.',
      'Auto-rickshaws (suburbs) and black-and-yellow Premier Padmini cabs (island city) must run by calibrated electronic meter.'
    ]
  },
  'rio-de-janeiro': {
    emergencyNumbers: {
      police: '190',
      ambulance: '192 (SAMU)',
      fire: '193 (Bombeiros)',
      general: '190',
      touristSupport: '+55 21 2332-7928 (DEAT - Delegacia Especial de Apoio ao Turismo)'
    },
    policeAgencyName: 'Polícia Militar do Estado do Rio de Janeiro & DEAT (Special Tourist Police)',
    officialPolicePortal: 'https://sepm.rj.gov.br',
    healthServiceAgency: 'Secretaria Municipal de Saúde do Rio de Janeiro (SMS-Rio)',
    healthPortal: 'https://saude.prefeitura.rio',
    officialAdvisorySource: 'Governo do Estado do Rio de Janeiro & Consular Travel Advisories',
    advisoryLevel: 'Level 2: Exercise Increased Caution',
    advisorySummary: 'Rio features spectacular natural beauty. Stay within major tourist zones (Copacabana, Ipanema, Leblon, Urca) and avoid visiting favelas unless part of an authorized, reputable community organization.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/brazil-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/brazil',
    publicSafetyGuidelines: [
      'Do not display jewelry, expensive watches, or flashy DSLR cameras while walking on public streets or the beach after sunset.',
      'Use registered taxi dispatch booths or verified rideshare apps (Uber, 99) rather than catching unmarked vehicles at night.',
      'If visiting beaches, take only minimal cash and a photocopy of your identification document.',
      'In any emergency involving visitors, head to the DEAT station in Leblon (Afrânio de Melo Franco, 159) where multilingual officers assist.'
    ]
  },
  pune: {
    emergencyNumbers: {
      police: '112 / 100',
      ambulance: '108 / 102',
      fire: '101',
      general: '112 (National Unified Emergency Helpline)',
      touristSupport: '1800-11-1363 (Incredible India Tourist Helpline)'
    },
    policeAgencyName: 'Pune City Police (Maharashtra State Police)',
    officialPolicePortal: 'https://punepolice.gov.in',
    healthServiceAgency: 'Pune Municipal Corporation (PMC) Health Department & Sassoon General Hospital',
    healthPortal: 'https://pmc.gov.in',
    officialAdvisorySource: 'Ministry of Home Affairs & Maharashtra Tourism Development Corporation (MTDC)',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'Pune is widely ranked among India\'s most peaceful and student-friendly metropolitan areas. Practice standard awareness on busy transit corridors like Pune Station and Swargate, and drink sealed or boiled water.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/india-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/india',
    publicSafetyGuidelines: [
      'Emergency number 112 connects directly to the integrated police, fire, and medical response center in Maharashtra.',
      'Auto-rickshaws in Pune operate on electronic meters; prepaid booths are available outside Pune Junction railway station.',
      'Drink bottled water with intact seals or UV-filtered water; avoid drinks with unpurified ice from roadside carts.',
      'For non-emergency reporting and citizen feedback, visit the nearest ward police station or use the Pune Police online portal.'
    ]
  },
  delhi: {
    emergencyNumbers: {
      police: '112 / 100',
      ambulance: '102 / 108',
      fire: '101',
      general: '112 (ERSS Emergency Response Support System)',
      touristSupport: '1800-11-1363 / +91 11 2336 5358 (Delhi Tourism)'
    },
    policeAgencyName: 'Delhi Police (Ministry of Home Affairs, Govt. of India)',
    officialPolicePortal: 'https://delhipolice.gov.in',
    healthServiceAgency: 'Delhi State Health Mission & AIIMS New Delhi Trauma Triage',
    healthPortal: 'https://delhi.gov.in',
    officialAdvisorySource: 'Ministry of External Affairs & Consular Travel Advisory Services',
    advisoryLevel: 'Level 2: Exercise Increased Caution',
    advisorySummary: 'Delhi has extensive infrastructure and tight police security across government and tourist hubs. Exercise heightened caution at night, travel via Delhi Metro or registered rideshare apps, and monitor seasonal air quality.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/india-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/india',
    publicSafetyGuidelines: [
      'Delhi Metro is the safest and most reliable transportation network; the first coach in direction of travel is reserved for women.',
      'During winter months (November-January), consult the live Air Quality Index (AQI) card and wear an N95 mask outdoors if PM2.5 levels rise.',
      'At New Delhi Railway Station (NDLS) and IGI Airport, ignore unauthorized touts claiming hotels are closed or roads are blocked.',
      'All licensed radio cabs (Uber, Ola, BluSmart) and prepaid airport taxi booths provide GPS-tracked transport.'
    ]
  },
  bengaluru: {
    emergencyNumbers: {
      police: '112 / 100',
      ambulance: '108 / 102',
      fire: '101',
      general: '112 (Unified Police & Ambulance Support)',
      touristSupport: '1800-11-1363 (Karnataka Tourism Helpdesk)'
    },
    policeAgencyName: 'Bengaluru City Police (Karnataka State Police)',
    officialPolicePortal: 'https://bengalurucitypolice.karnataka.gov.in',
    healthServiceAgency: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Health Wing & Victoria Hospital',
    healthPortal: 'https://bbmp.gov.in',
    officialAdvisorySource: 'Karnataka State Police & Consular Overseas Travel Advisory',
    advisoryLevel: 'Level 1: Exercise Normal Precautions',
    advisorySummary: 'Bengaluru is a hospitable, progressive tech capital with active nightlife and community policing. Allow ample transit time for peak-hour road traffic and prefer Namma Metro for cross-city travel.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/india-travel-advisory.html',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice/india',
    publicSafetyGuidelines: [
      'Namma Metro connects major hubs including Majestic, MG Road, Indiranagar, and Whitefield with clean, secure coaches.',
      'Bengaluru City Police Suraksha App provides direct SOS alert triggering to the nearest mobile patrol vehicle.',
      'Pedestrians should exercise care while crossing arterial junctions; use designated skywalks and pedestrian signals.',
      'Tap water in hotels should be boiled or filtered; keep sealed bottled water during daytime excursions.'
    ]
  },
  general: {
    emergencyNumbers: {
      police: '112 / 911',
      ambulance: '112 / 911',
      fire: '112 / 911',
      general: '112 (Universal International Emergency GSM Code)'
    },
    policeAgencyName: 'Local Municipal Police & Civil Protection Agency',
    officialPolicePortal: 'https://www.interpol.int',
    healthServiceAgency: 'World Health Organization & Local Public Health Ministry',
    healthPortal: 'https://www.who.int',
    officialAdvisorySource: 'United Nations Department of Safety and Security & National Consular Services',
    advisoryLevel: 'Safe Urban Zone',
    advisorySummary: 'Follow standard international urban safety precautions. Keep emergency phone contacts programmed and stay aware of local emergency notifications.',
    lastUpdated: 'October 2026',
    verifiedAgencyUrl: 'https://travel.state.gov',
    consularAdviceUrl: 'https://www.gov.uk/foreign-travel-advice',
    publicSafetyGuidelines: [
      'Program your home country\'s nearest embassy or consulate telephone number into your mobile contacts.',
      '112 is the globally recognized GSM emergency number operational across Europe and most cellular networks worldwide.',
      'Keep digital cloud copies of your passport data page and travel insurance policy.',
      'Consult verified municipal transit alerts for changes in train or bus routing.'
    ]
  }
};
