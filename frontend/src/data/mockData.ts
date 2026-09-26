import { Quest, CrowdHotspot, ArtisanVendor, UserBadge } from '../types';

export const INITIAL_USER_PROFILE = {
  name: 'Ananya Sinha',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 3,
  currentXp: 740,
  xpToNextLevel: 1000,
  title: 'Cultural Pathfinder',
  coins: 480,
  streakDays: 4,
  completedQuestIds: ['quest-spice-trail'],
  unlockedBadges: [
    {
      id: 'badge-spice-master',
      name: 'Spice Alchemist',
      icon: 'Sparkles',
      color: '#F09367',
      description: 'Discovered the centuries-old hidden spice blends of Khari Baoli.',
      unlockedAt: '2026-08-28',
      is3dUnlocked: true,
      category: 'Culinary Heritage'
    },
    {
      id: 'badge-crowd-balancer',
      name: 'Smart Pathfinder',
      icon: 'Compass',
      color: '#8A8635',
      description: 'Diverted from an overcrowded monument to support an artisan workshop.',
      unlockedAt: '2026-08-30',
      is3dUnlocked: true,
      category: 'Sustainable Tourism'
    }
  ],
  redeemedVouchers: [
    {
      id: 'vouch-1',
      artisanName: 'Babulal Terracotta Arts',
      discount: '20% OFF Handmade Pitcher',
      code: 'RH-TERRA-8492',
      date: '2026-08-29'
    }
  ],
  localImpactDollars: 45,
  stepsWalked: 8420
};

export const QUESTS: Quest[] = [
  {
    id: 'quest-terracotta-craft',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    title: 'Clay, Wheel & Soul: The Artisan Masterclass Loop',
    tagline: 'Meet 4th-generation potters & shape your own earthen lamp',
    description: 'Bypass the overcrowded tourist malls and journey into the vibrant lanes of Kumhar Colony. Experience living clay heritage, witness master block printers, and support local women cooperatives.',
    category: 'artisan',
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    totalXp: 350,
    totalCoins: 120,
    heroImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    coords3D: [-2.2, 0.4, 1.2],
    isCrowdBalancingBoosted: true,
    crowdMultiplier: 2.0,
    crowdReason: '⚡ 2X CROWD BOOSTER: Main Fort is at 92% capacity. Explore this quiet artisan alley for double rewards!',
    highlightArtisan: 'Master Potter Babulal & Soniya Devi',
    badgeReward: {
      id: 'badge-clay-master',
      name: 'Earth Sculptor',
      icon: 'Palette',
      color: '#7A1026',
      description: 'Mastered the ancient pottery wheel & supported 3 local artisan families.'
    },
    stops: [
      {
        id: 'stop-1-1',
        name: 'The 100-Year Wheel: Babulal Workshop',
        category: 'artisan',
        description: 'Watch Master Babulal spin raw clay from the riverbed into exquisite water jars in under 3 minutes.',
        historicalFact: 'Terracotta vessels naturally cool water by 5°C through micro-pore evaporation without electricity.',
        artisanName: 'Babulal Prajapati (45 yrs experience)',
        location: 'Lane 4, Kumhargram Heritage Colony',
        lat: 28.6139,
        lng: 77.2090,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Master Babulal',
          quote: '"The clay speaks to your fingers. If you rush, the neck collapses. If you are patient, it breathes."',
          actionPrompt: 'Ask Babulal what natural mineral gives local clay its signature apricot glow.'
        },
        rewardXp: 100,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-1-2',
        name: 'Saffron Mud & Hand Block Dyeing Guild',
        category: 'craft',
        description: 'Discover how traditional wooden blocks carved from rosewood are pressed with natural turmeric and madder root dyes.',
        historicalFact: 'Traditional block printing techniques date back over 800 years and use 100% biodegradable plant pigments.',
        artisanName: 'Meera & The Shilpkar Women Cooperative',
        location: 'Heritage Loom Courtyard, Old Bazaar',
        lat: 28.6145,
        lng: 77.2110,
        challengeType: 'trivia',
        trivia: {
          question: 'What natural ingredient is historically boiled to produce the deep golden "Haldi" yellow dye?',
          options: ['Raw Saffron & Turmeric root', 'Crushed pomegranate peel', 'Indigo leaf extract', 'Marigold blossoms'],
          correctIndex: 0,
          explanation: 'Raw turmeric root and saffron threads were traditionally boiled in copper cauldrons to create durable golden hues.'
        },
        rewardXp: 120,
        rewardCoins: 40,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-1-3',
        name: 'The Secret Copper Beater Alley',
        category: 'artisan',
        description: 'Listen to the rhythmic heartbeat of hammered brass and copper utensils being hand-chiseled by generational metal smiths.',
        historicalFact: 'Hand-hammered copper vessels require over 3,000 deliberate hammer strikes to achieve tensile strength.',
        location: 'Tambat Khadki, Gali No. 7',
        lat: 28.6160,
        lng: 77.2135,
        challengeType: 'checkin',
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'quest-spice-trail',
    stateId: 'delhi',
    stateName: 'Delhi',
    title: 'The Alchemist Aroma: Old Town Spice & Chai Trail',
    tagline: 'Follow 500-year-old spice trading routes & unlock secret chai recipes',
    description: 'Wander through fragrant spice alleys, taste hand-ground cardamom kahwa, and discover secret herbal concoctions known only to old medicinal apothecaries.',
    category: 'food',
    difficulty: 'Easy',
    estimatedTime: '35 mins',
    totalXp: 280,
    totalCoins: 95,
    heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    coords3D: [1.8, 0.3, -1.4],
    highlightArtisan: '3rd Gen Masala Blender Haji Nizam',
    badgeReward: {
      id: 'badge-spice-master',
      name: 'Spice Alchemist',
      icon: 'Sparkles',
      color: '#F09367',
      description: 'Discovered the hidden spice blends and secret saffron tea recipes.'
    },
    stops: [
      {
        id: 'stop-2-1',
        name: 'The 7-Spice Cellar: Nizam & Sons (Est. 1924)',
        category: 'food',
        description: 'Sample wild mountain cumin, smoked green cardamom, and stone-ground Kashmiri chilies.',
        historicalFact: 'Spices in ancient caravans were once weighed against pure silver coins due to their preservation power.',
        artisanName: 'Haji Nizamuddin',
        location: 'Khari Baoli Spice Arcade #12',
        lat: 28.6560,
        lng: 77.2240,
        challengeType: 'trivia',
        trivia: {
          question: 'Which spice is harvested by hand from the delicate crimson stigmas of a purple crocus flower?',
          options: ['Nutmeg', 'Saffron (Kesar)', 'Star Anise', 'Mace'],
          correctIndex: 1,
          explanation: 'It takes roughly 75,000 crocus flowers hand-picked at dawn to produce just one pound of pure saffron!'
        },
        rewardXp: 90,
        rewardCoins: 30,
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-2-2',
        name: 'Clay-Cup Saffron Kahwa Cauldron',
        category: 'food',
        description: 'Sip slow-brewed almond and cinnamon green tea poured from a gleaming copper samovar into single-use baked clay cups.',
        historicalFact: 'Drinking from earthen "Kulhad" cups infuses the beverage with trace petrichor minerals and supports rural potters.',
        location: 'Hakeem Street Corner',
        lat: 28.6575,
        lng: 77.2255,
        challengeType: 'checkin',
        rewardXp: 95,
        rewardCoins: 30,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-2-3',
        name: 'The 80-Year Jalebi & Rabri Hearth',
        category: 'food',
        description: 'Taste spiral golden jalebis fried in desi ghee over charcoal and soaked in wild honey & rose water syrup.',
        historicalFact: 'The spiral dessert journeyed through the Silk Route from Persian "Zulbiya" to Indian Jalebi over 600 years ago.',
        location: 'Dariba Kalan Crossing',
        lat: 28.6582,
        lng: 77.2270,
        challengeType: 'photo',
        rewardXp: 95,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'quest-stepwell-heritage',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    title: 'Echoes of Stone: Sacred Stepwell & Sunset Bastion',
    tagline: 'Climb 108 symmetrical stairs & solve the geometric water architecture mystery',
    description: 'Explore an astonishing 8th-century subterranean stepwell, discover ancient hydro-cooling architecture, and finish with panoramic sunset vistas.',
    category: 'heritage',
    difficulty: 'Moderate',
    estimatedTime: '60 mins',
    totalXp: 420,
    totalCoins: 150,
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80',
    coords3D: [0.2, 0.6, -2.5],
    isCrowdBalancingBoosted: true,
    crowdMultiplier: 1.8,
    crowdReason: '🔥 REROUTE PERK: Palace line is 60+ min wait. This peaceful stepwell offers quiet beauty and +180 Bonus XP!',
    highlightArtisan: 'Heritage Folk Troubadour Pandit Radheshyam',
    badgeReward: {
      id: 'badge-stone-guardian',
      name: 'Architectural Seeker',
      icon: 'Shield',
      color: '#120C2B',
      description: 'Decoded the sacred geometry of the underground subterranean stepwells.'
    },
    stops: [
      {
        id: 'stop-3-1',
        name: 'The Symmetrical Mirror Stepwell (Baoli)',
        category: 'landmark',
        description: 'Stand at the pavilion and admire 3,500 narrow steps carved in rhythmic geometric patterns down to turquoise groundwater.',
        historicalFact: 'The subterranean architecture created a natural microclimate that remained 10°F cooler than surface temperatures during scorching summers.',
        location: 'Chand Baori Heritage Precinct',
        lat: 28.5244,
        lng: 77.1855,
        challengeType: 'trivia',
        trivia: {
          question: 'What was the primary social function of stepwells besides water storage in medieval times?',
          options: ['Community gathering & cool retreat', 'Military weapon storage', 'Grain fermentation vaults', 'Astronomical observatory only'],
          correctIndex: 0,
          explanation: 'Stepwells served as vibrant cooling social retreats for women travelers, community gatherings, and musical performances.'
        },
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-3-2',
        name: 'The Ravanahatha Instrument Workshop',
        category: 'artisan',
        description: 'Meet folk luthier who carves the ancient coconut-shell bowed instrument believed to precede the violin.',
        historicalFact: 'The Ravanahatha instrument is mentioned in the Ramayana epic and has been handcrafted by desert nomadic bards for millennia.',
        artisanName: 'Pandit Radheshyam',
        location: 'Rampart St. #9',
        lat: 28.5255,
        lng: 77.1868,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Pandit Radheshyam',
          quote: '"Each coconut bowl is tuned to the wind of the desert. Two horsehair strings can make the stone fort weep with joy."',
          actionPrompt: 'Listen to a 10-second desert melody and record your check-in!'
        },
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-3-3',
        name: 'The Golden Hour Falcon Lookout',
        category: 'scenic',
        description: 'Catch the twilight glow over the terracotta tiled rooftops and distant fortress walls.',
        historicalFact: 'Royal heralds once signaled sunset curfew from this precise promontory using brass gong resonance.',
        location: 'West Bastion Overlook',
        lat: 28.5270,
        lng: 77.1880,
        challengeType: 'photo',
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'quest-night-lantern',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    title: 'Lanterns & Lore: Twilight Folk & Puppet Safari',
    tagline: 'Follow brass paper lanterns through illuminated courtyards & shadow puppetry',
    description: 'As twilight falls, experience the magic of traditional string puppeteers, wooden toy carvers, and evening flute performances in atmospheric courtyards.',
    category: 'night',
    difficulty: 'Easy',
    estimatedTime: '40 mins',
    totalXp: 310,
    totalCoins: 110,
    heroImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80',
    coords3D: [-1.5, 0.4, -1.8],
    highlightArtisan: 'Master Kathputli Puppeteer Puran Bhatt',
    badgeReward: {
      id: 'badge-night-owl',
      name: 'Twilight Storyteller',
      icon: 'Moon',
      color: '#E5A532',
      description: 'Explored historic night bazaars and kept folk oral traditions alive.'
    },
    stops: [
      {
        id: 'stop-4-1',
        name: 'The Kathputli String Puppet Guild',
        category: 'artisan',
        description: 'Watch vibrant handmade wooden marionettes clad in vintage silk brocade dance to the whistle of the "boli".',
        historicalFact: 'Kathputli puppetry originated over 1,000 years ago as a travelling theater conveying folk history and social satire.',
        artisanName: 'Puran Bhatt (National Awardee)',
        location: 'Artists Colony, West Courtyard',
        lat: 28.6410,
        lng: 77.2180,
        challengeType: 'trivia',
        trivia: {
          question: 'What lightweight wood is traditionally carved for the expressive heads of Rajasthani string puppets?',
          options: ['Mango (Aam) wood', 'Teak wood', 'Rosewood', 'Ebony'],
          correctIndex: 0,
          explanation: 'Mango wood is soft, pliable to carve, and lightweight enough for nimble multi-string puppetry balance.'
        },
        rewardXp: 100,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-4-2',
        name: 'Handmade Brass Lantern Makers Lane',
        category: 'craft',
        description: 'Marvel at geometric filigree lanterns casting intricate mandala shadow patterns on stone walls.',
        historicalFact: 'Each lamp perforations are punched by hand using tiny steel chisels without stencils or lasers.',
        location: 'Chawri Filigree Square',
        lat: 28.6425,
        lng: 77.2195,
        challengeType: 'checkin',
        rewardXp: 105,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-4-3',
        name: 'Midnight Saffron Milk & Pistachio Kulfi Hub',
        category: 'food',
        description: 'Taste dense earthen pot kulfi churned in salted ice barrels topped with silver leaf and rose petals.',
        historicalFact: 'Mughal courts imported Himalayan snow on horseback to freeze condensed milk for early kulfi masters.',
        location: 'Kuremal Courtyard',
        lat: 28.6440,
        lng: 77.2210,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Kulfi Master Ram',
          quote: '"We still freeze our kulfi in sealed clay pots with lake ice and rock salt, just as my grandfather did in 1906."',
          actionPrompt: 'Taste the signature stuffed mango kulfi and earn your night badge!'
        },
        rewardXp: 105,
        rewardCoins: 40,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'quest-sacred-groves',
    stateId: 'delhi',
    stateName: 'Delhi',
    title: 'Whispering Canopies: Ancient Banyan & Herbal Guild',
    tagline: 'Discover 300-year-old botanical sanctuaries & indigenous medicine',
    description: 'Step into tranquil urban forest reserves and learn the medicinal uses of neem, sacred tulsi, and vetiver roots from tribal botanists.',
    category: 'nature',
    difficulty: 'Adventurer',
    estimatedTime: '55 mins',
    totalXp: 380,
    totalCoins: 135,
    heroImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    coords3D: [2.5, 0.5, 1.6],
    highlightArtisan: 'Ethnobotanist Vaidya Shanti Bai',
    badgeReward: {
      id: 'badge-eco-walker',
      name: 'Forest Guardian',
      icon: 'Trees',
      color: '#889063',
      description: 'Walked zero-carbon trails and learned indigenous plant medicine.'
    },
    stops: [
      {
        id: 'stop-5-1',
        name: 'The Great Grandmother Banyan (Ficus benghalensis)',
        category: 'landmark',
        description: 'Stand underneath aerial prop roots forming a cathedral-like living canopy covering over 2 acres.',
        historicalFact: 'Banyan trees release oxygen continuously and their aerial roots can live for over 400 years.',
        location: 'Ridge Sanctuary South Gate',
        lat: 28.5820,
        lng: 77.1650,
        challengeType: 'trivia',
        trivia: {
          question: 'What woven root is traditionally dampened and hung in windows to cool summer breeze with earthy fragrance?',
          options: ['Vetiver (Khus-Khus)', 'Neem bark', 'Eucalyptus twig', 'Lemongrass stalk'],
          correctIndex: 0,
          explanation: 'Vetiver roots (Khus) have natural evaporative cooling properties and emit a calming petrichor scent when hydrated.'
        },
        rewardXp: 120,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-5-2',
        name: 'The Indigenous Aromatic Herbal Apothecary',
        category: 'artisan',
        description: 'Learn how cold-pressed pure wild apricot oil, sweet almond paste, and rose water are prepared.',
        historicalFact: 'Wild apricot kernel oil is rich in Vitamin E and has been pressed by mountain communities for skin healing.',
        artisanName: 'Vaidya Shanti Bai',
        location: 'Herbal Commons, Hut #4',
        lat: 28.5840,
        lng: 77.1670,
        challengeType: 'checkin',
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-5-3',
        name: 'The Lotus Lake Eco-Observation Deck',
        category: 'scenic',
        description: 'Observe migratory painted storks, kingfishers, and blooming sacred pink water lilies.',
        historicalFact: 'Natural wetland catchments filter stormwater and recharge clean groundwater tables for historic wells.',
        location: 'Eco Marsh Boardwalk',
        lat: 28.5860,
        lng: 77.1690,
        challengeType: 'photo',
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const CROWD_HOTSPOTS: CrowdHotspot[] = [
  {
    id: 'hotspot-1',
    name: 'Grand Amber Palace & Main Courtyard',
    currentCongestionPercent: 94,
    status: 'Critical Overcrowding',
    waitTimeMinutes: 75,
    redirectedQuestId: 'quest-terracotta-craft',
    redirectedQuestName: 'Clay, Wheel & Soul: Artisan Masterclass Loop',
    bonusMultiplier: 2.0,
    artisanHighlight: 'Support Master Potter Babulal (350m away) + 2x XP + 20% Voucher'
  },
  {
    id: 'hotspot-2',
    name: 'City Palace Main Gate & Souvenir Market',
    currentCongestionPercent: 88,
    status: 'Busy',
    waitTimeMinutes: 50,
    redirectedQuestId: 'quest-stepwell-heritage',
    redirectedQuestName: 'Echoes of Stone: Sacred Stepwell Trail',
    bonusMultiplier: 1.8,
    artisanHighlight: 'Peaceful stepwell acoustics + Folk Ravanahatha masterclass'
  },
  {
    id: 'hotspot-3',
    name: 'Hawa Viewpoint Central Overpass',
    currentCongestionPercent: 78,
    status: 'Busy',
    waitTimeMinutes: 35,
    redirectedQuestId: 'quest-spice-trail',
    redirectedQuestName: 'The Alchemist Aroma: Old Town Spice & Chai Trail',
    bonusMultiplier: 1.5,
    artisanHighlight: 'Taste authentic saffron kahwa in quiet old quarter alleys'
  }
];

export const ARTISAN_VENDORS: ArtisanVendor[] = [
  {
    id: 'artisan-1',
    name: 'Master Babulal Prajapati',
    craft: 'Terracotta Pottery & Hand-Carved Diyas',
    shopName: 'Babulal Heritage Clay Studio',
    bio: 'Carrying forward 4 generations of Kumbhakar earthenware traditions using riverbed alluvial clay and natural wood-fired kilns.',
    yearsOfTradition: 52,
    location: 'Lane 4, Kumhargram Heritage Colony',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    voucherDiscount: '25% OFF Any Handcrafted Clay Vessel',
    tokenCost: 150,
    verifiedLocal: true,
    specialtyProduct: 'Hand-thrown terracotta water jug with natural apricot glaze'
  },
  {
    id: 'artisan-2',
    name: 'Meera Devi & Cooperative',
    craft: 'Natural Turmeric & Indigo Wooden Block Printing',
    shopName: 'Shilpkar Women Loom Guild',
    bio: 'Empowering 38 rural craftswomen through ethical hand-block printing on organic khadi cotton using 100% natural vegetable dyes.',
    yearsOfTradition: 28,
    location: 'Heritage Loom Courtyard, Old Bazaar',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    voucherDiscount: 'Free Hand-Printed Khadi Scarf with $15 Purchase',
    tokenCost: 200,
    verifiedLocal: true,
    specialtyProduct: 'Organic indigo dyed scarf with geometric Mughal motifs'
  },
  {
    id: 'artisan-3',
    name: 'Haji Nizamuddin',
    craft: 'Royal Mughlai Spice Blends & Mountain Saffron',
    shopName: 'Nizam Old Town Spices (Est. 1924)',
    bio: 'Master blender using stone mortar-and-pestle techniques to craft fragrant biryani masalas and saffron tea infusions.',
    yearsOfTradition: 100,
    location: 'Khari Baoli Spice Arcade #12',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    voucherDiscount: 'Free 50g Royal Cardamom Tea Blend Pack',
    tokenCost: 120,
    verifiedLocal: true,
    specialtyProduct: 'Kashmiri Mogra saffron & stone-ground garam masala'
  },
  {
    id: 'artisan-4',
    name: 'Puran Bhatt & Family',
    craft: 'Vintage Silk Puppet Carving & String Theater',
    shopName: 'Bhatt Kathputli Troupe',
    bio: 'Preserving the endangered art of string puppetry and musical folk storytelling passed down over 8 centuries.',
    yearsOfTradition: 75,
    location: 'Artists Colony, West Courtyard',
    image: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80',
    voucherDiscount: 'Buy 1 Heritage Puppet, Get 1 Miniature FREE',
    tokenCost: 180,
    verifiedLocal: true,
    specialtyProduct: 'Hand-carved Rajasthani prince & princess string puppets'
  },
  {
    id: 'artisan-5',
    name: 'Pandit Radheshyam',
    craft: 'Coconut-Shell Ravanahatha & Flute Maker',
    shopName: 'Sur & Swar Folk Instrument Sanctuary',
    bio: 'Handcrafting ancient desert string instruments and bamboo flutes from natural seasoned cane and coconut resonators.',
    yearsOfTradition: 40,
    location: 'Rampart St. #9, Fort Foothills',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    voucherDiscount: '30% OFF Hand-Tuned Bamboo Flute + Live Lesson',
    tokenCost: 160,
    verifiedLocal: true,
    specialtyProduct: 'Concert-pitch Indian bamboo flute (Bansuri)'
  }
];

export const ALL_BADGES: UserBadge[] = [
  {
    id: 'badge-spice-master',
    name: 'Spice Alchemist',
    icon: 'Sparkles',
    color: '#F09367',
    description: 'Discovered the centuries-old hidden spice blends of Khari Baoli.',
    unlockedAt: '2026-08-28',
    is3dUnlocked: true,
    category: 'Culinary Heritage'
  },
  {
    id: 'badge-crowd-balancer',
    name: 'Smart Pathfinder',
    icon: 'Compass',
    color: '#8A8635',
    description: 'Diverted from an overcrowded monument to support an artisan workshop.',
    unlockedAt: '2026-08-30',
    is3dUnlocked: true,
    category: 'Sustainable Tourism'
  },
  {
    id: 'badge-clay-master',
    name: 'Earth Sculptor',
    icon: 'Palette',
    color: '#7A1026',
    description: 'Mastered the ancient pottery wheel & supported 3 local artisan families.',
    category: 'Artisans & Crafts'
  },
  {
    id: 'badge-stone-guardian',
    name: 'Architectural Seeker',
    icon: 'Shield',
    color: '#120C2B',
    description: 'Decoded the sacred geometry of the underground subterranean stepwells.',
    category: 'Heritage & History'
  },
  {
    id: 'badge-night-owl',
    name: 'Twilight Storyteller',
    icon: 'Moon',
    color: '#E5A532',
    description: 'Explored historic night bazaars and kept folk oral traditions alive.',
    category: 'Night Safari'
  },
  {
    id: 'badge-eco-walker',
    name: 'Forest Guardian',
    icon: 'Trees',
    color: '#889063',
    description: 'Walked zero-carbon trails and learned indigenous plant medicine.',
    category: 'Eco & Wellness'
  }
];
