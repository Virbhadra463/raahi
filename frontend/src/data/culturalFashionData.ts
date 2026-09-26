export interface LocalMaker {
  id: string;
  name: string;
  artisanTitle: string;
  location: string;
  city: string;
  state: string;
  coordinates: string;
  craft: string;
  heritageYears: string;
  description: string;
  visitingHours: string;
  storySnippet: string;
  address: string;
}

export interface CulturalAccessory {
  id: string;
  name: string;
  localName: string;
  description: string;
  culturalSignificance: string;
  // 3D coordinates relative to character center: y from -1.5 (feet) to 1.5 (head)
  hotspot3D: { x: number; y: number; z: number };
  cameraFocus: { y: number; zoom: number };
  maker: LocalMaker;
}

export interface StateCulturalFashion {
  id: string;
  name: string;
  hindiName: string;
  tagline: string;
  editorialQuote: string;
  subCopy: string;
  regionCraftNote: string;
  accentColor: string;
  borderPattern: string;
  bgTextureClass: string;
  characterImage: string;
  pedestalTexture: string;
  architecturalBackdrop: string;
  cropRatio: number; // UV horizontal crop ratio for character column
  accessories: CulturalAccessory[];
}

export const CULTURAL_FASHION_DATA: Record<string, StateCulturalFashion> = {
  rajasthan: {
    id: 'rajasthan',
    name: 'RAJASTHAN',
    hindiName: 'राजस्थान',
    tagline: 'Land of Kings & Desert Living Craft',
    editorialQuote: 'Crafted in colour.\nCarried through generations.',
    subCopy:
      'From 500-year-old royal block-carving guilds in Bagru to desert silver hammerers of Johari Bazaar, Rajasthani attire is an unbroken lineage of living craft.',
    regionCraftNote: 'THAR DESERT GUILDS · BANDHANI & MEENAKARI REGISTRATION #RJ-1724',
    accentColor: '#7A1026',
    borderPattern: 'repeating-linear-gradient(45deg, #7A1026 0, #7A1026 1px, transparent 0, transparent 8px)',
    bgTextureClass: 'bg-[#FDF3EA]',
    characterImage: '/dress-to-impress/rajasthani.png',
    pedestalTexture: 'Jaisalmer Yellow Sandstone',
    architecturalBackdrop: 'Hawa Mahal & Amber Fort Sandstone Jharokhas',
    cropRatio: 0.62,
    accessories: [
      {
        id: 'maang-tikka',
        name: 'MAANG TIKKA',
        localName: 'मांग टीका / बोरला',
        description: 'Traditional bell-shaped forehead ornament inlaid with uncut Kundan and pearls.',
        culturalSignificance:
          'Symbolizes the sixth chakra and spiritual wisdom; distinctively hemispherical (borla) in Marwar and Mewar.',
        hotspot3D: { x: -0.05, y: 1.25, z: 0.2 },
        cameraFocus: { y: 1.2, zoom: 1.6 },
        maker: {
          id: 'maker-rj-1',
          name: 'Shri Om Prakash Soni & Sons',
          artisanTitle: 'Master Kundan Meenakari Goldsmith (5th Generation)',
          location: 'Gopalji Ka Rasta, Johari Bazaar',
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: '26.9208° N, 75.8242° E',
          craft: 'Jadau Kundan & Lac-Core Gold Inlay',
          heritageYears: '88 years in old walled city',
          description:
            'A humble, open-front workshop where four brothers carve pure 24k foil around uncut glass and real pearls using techniques patronized by Sawai Jai Singh.',
          visitingHours: '10:30 AM – 7:00 PM (Closed Sundays)',
          storySnippet:
            '“Every pearl in this borla is strung on pure silk thread by my uncle. You can hear our hammer taps echoing down Gopalji Ka Rasta all morning.”',
          address: 'Shop #42, Gopalji Ka Rasta, Johari Bazaar, Jaipur'
        }
      },
      {
        id: 'nath',
        name: 'NATH',
        localName: 'नथ',
        description: 'A classic Rajasthani nose ring, symbol of tradition and pride.',
        culturalSignificance:
          'Features intricate filigree work with natural pearls and a delicate gold link chain extending to the ear.',
        hotspot3D: { x: 0.05, y: 1.05, z: 0.22 },
        cameraFocus: { y: 1.05, zoom: 1.8 },
        maker: {
          id: 'maker-rj-2',
          name: 'Kishanlal Jewellers & Filigree Guild',
          artisanTitle: 'Royal Filigree Master',
          location: 'Haldiyon Ka Rasta',
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: '26.9234° N, 75.8256° E',
          craft: 'Handcrafted Heritage Bridal Naths',
          heritageYears: '112 years of ancestral tradition',
          description:
            'Specializes in lightweight hollow-gold naths accented with ruby-colored glass and seed pearls, crafted with ancient tweezers and blowpipes.',
          visitingHours: '11:00 AM – 8:00 PM',
          storySnippet:
            '“The Rajasthani nath must feel like a feather on the bride’s cheek. We hand-twist 22-gauge wire so it rests without strain for 14 hours.”',
          address: 'Haveli #18, Haldiyon Ka Rasta, Old City, Jaipur'
        }
      },
      {
        id: 'jhumka',
        name: 'JHUMKA EARRINGS',
        localName: 'झुमका',
        description: 'Heavy, handcrafted earrings that bring timeless charm.',
        culturalSignificance:
          'Bell-shaped droplets (jhumki) that chime subtly with movement, finished with hand-hammered silver tassels.',
        hotspot3D: { x: -0.22, y: 0.98, z: 0.18 },
        cameraFocus: { y: 0.98, zoom: 1.7 },
        maker: {
          id: 'maker-rj-3',
          name: 'Babu-ji Silver Craft Workshop',
          artisanTitle: 'Tribal Silver Artisan',
          location: 'Badi Chaupar, Sunar Gali',
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: '26.9248° N, 75.8274° E',
          craft: '92.5% Chandi Jhumkas & Chandbalis',
          heritageYears: '64 years at this sun-warmed hearth',
          description:
            'Using aged charcoal bellows to cast solid silver droplets. Babu-ji stamps every pair with the authentic hallmark of Jaipur silver guild.',
          visitingHours: '10:00 AM – 6:30 PM',
          storySnippet:
            '“Tourists usually walk past our lane to see the palace facade. If you step in here, you can watch silver melt over babool coal right in front of you.”',
          address: 'Sunar Gali, Lane 3 beside Clock Tower, Jaipur'
        }
      },
      {
        id: 'kundan-necklace',
        name: 'KUNDAN / SILVER NECKLACE',
        localName: 'कुंदन हार / हंसली',
        description: 'Traditional necklace with intricate detailing and mirror work.',
        culturalSignificance:
          'Multi-layered collar choker embedding emeralds, uncut polki, and reverse-side enamel Meenakari art.',
        hotspot3D: { x: 0.0, y: 0.8, z: 0.2 },
        cameraFocus: { y: 0.8, zoom: 1.5 },
        maker: {
          id: 'maker-rj-4',
          name: 'Meenakari House of Jaipur',
          artisanTitle: 'National Award-Winning Meenakar',
          location: 'Choti Chaupar, Khazanewalon Ka Rasta',
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: '26.9212° N, 75.8190° E',
          craft: 'Reverse-Fired Enamel & Jadau Chokers',
          heritageYears: 'Preserving Mughal-era Jaipuri enamel since 1884',
          description:
            'Crafting necklaces whose backsides are as breathtaking as the front — painted with pulverized mineral colours fired at 800°C in clay kilns.',
          visitingHours: '11:00 AM – 7:30 PM',
          storySnippet:
            '“True Jaipuri jewellery hides its greatest secret on the back: enamel peacocks and marigolds that touch your skin.”',
          address: 'House #7, Khazanewalon Ka Rasta, Jaipur'
        }
      },
      {
        id: 'bangles',
        name: 'BANGLES',
        localName: 'लाख की चूड़ियाँ / चूड़ा',
        description: 'Red and silver bangles that add colour, culture and rhythm.',
        culturalSignificance:
          'Natural resin lac bangles embedded with brass sequins and seed mirrors, handmade over charcoal stoves in Maniharon Ka Rasta.',
        hotspot3D: { x: 0.25, y: 0.35, z: 0.2 },
        cameraFocus: { y: 0.35, zoom: 1.4 },
        maker: {
          id: 'maker-rj-5',
          name: 'Mohammad Rafiq Lac Works',
          artisanTitle: 'Master Lac Bangle Artisan',
          location: 'Maniharon Ka Rasta (Bangle Lane)',
          city: 'Jaipur',
          state: 'Rajasthan',
          coordinates: '26.9221° N, 75.8231° E',
          craft: 'Hand-Moulded Natural Lac Bangles',
          heritageYears: '7 Generations of royal bangle makers',
          description:
            'Watch hot natural tree resin roll across wooden dowels and shape into custom sizes right in front of your eyes.',
          visitingHours: '9:30 AM – 9:00 PM',
          storySnippet:
            '“We warm the lac on slow coals and fit the bangle to the warmth of your wrist. It never catches cold like plastic.”',
          address: 'Shop #114, Maniharon Ka Rasta, Tripolia Bazaar, Jaipur'
        }
      },
      {
        id: 'potli-bag',
        name: 'POTLI BAG',
        localName: 'बटुवा / पोटली',
        description: 'Embroidered pouch to carry your essentials, with a touch of tradition.',
        culturalSignificance:
          'Gathered pouch decorated with Gota Patti ribbon, glass mirrors, and vibrant drawstring pom-poms.',
        hotspot3D: { x: -0.28, y: 0.25, z: 0.25 },
        cameraFocus: { y: 0.25, zoom: 1.4 },
        maker: {
          id: 'maker-rj-6',
          name: 'Shakuntala Devi Women’s Craft Guild',
          artisanTitle: 'Master Gota Patti Embroiderer',
          location: 'Bagru Road, Sanganer Artisan Village',
          city: 'Sanganer, Jaipur',
          state: 'Rajasthan',
          coordinates: '26.8188° N, 75.7766° E',
          craft: 'Gota Patti Appliqué & Velvet Potlis',
          heritageYears: '42 women artisans community collective',
          description:
            'Cutting pure gold and silver ribbons into floral leaves and stitching them onto velvet and raw silk pouches.',
          visitingHours: '10:00 AM – 5:00 PM',
          storySnippet:
            '“Every potli funds education for our daughters in the village. 100% of your payment stays with the artisan woman who stitched it.”',
          address: 'Gota Patti Kendra, Old Sanganer Gate, Jaipur'
        }
      },
      {
        id: 'jutti',
        name: 'JUTTI',
        localName: 'मोजड़ी / जूती',
        description: 'Handcrafted footwear that blends comfort with culture.',
        culturalSignificance:
          'Camel leather footwear with turned-up curled toes (nok), stitched with vegetable-tanned thread and zardozi.',
        hotspot3D: { x: -0.05, y: -1.3, z: 0.15 },
        cameraFocus: { y: -1.2, zoom: 1.5 },
        maker: {
          id: 'maker-rj-7',
          name: 'Master Chhaganlal Mojdi Karigar',
          artisanTitle: 'Generational Mojdi Shoemaker',
          location: 'Mochi Bazaar, Jodhpur Old City',
          city: 'Jodhpur',
          state: 'Rajasthan',
          coordinates: '26.2978° N, 73.0234° E',
          craft: 'Hand-stitched Nok Mojdis & Kashida Juttis',
          heritageYears: '52 years at Clock Tower market',
          description:
            'Soft, sock-like pure leather shoes that mould to the exact contour of your feet over three walks. No left or right shoe initially — they adapt to you.',
          visitingHours: '10:00 AM – 8:30 PM',
          storySnippet:
            '“Modern shoes force your foot into rigid plastic. A Marwari jutti breathes with your skin and softens with every step in the sand.”',
          address: 'Stall #8, Mochi Bazaar, near Ghanta Ghar, Jodhpur'
        }
      }
    ]
  },

  maharashtra: {
    id: 'maharashtra',
    name: 'MAHARASHTRA',
    hindiName: 'महाराष्ट्र',
    tagline: 'Woven Sahyadri Heritage & Royal Maratha Tradition',
    editorialQuote: 'Woven tradition.\nMade to travel.',
    subCopy:
      'Rooted in Sahyadri hill fort history, the Nauvari drape and Paithani peacock motifs carry the spirit of resilience, woven by 4th-generation guild weavers in Yeola.',
    regionCraftNote: 'GODAVARI BASIN WEAVES · PAITHANI & KOLHAPURI GUILD #MH-1892',
    accentColor: '#C81D11',
    borderPattern: 'repeating-linear-gradient(45deg, #C81D11 0, #C81D11 1px, transparent 0, transparent 8px)',
    bgTextureClass: 'bg-[#FDF6E9]',
    characterImage: '/dress-to-impress/marathi.png',
    pedestalTexture: 'Sahyadri Dark Basalt Stone',
    architecturalBackdrop: 'Shaniwar Wada & Raigad Fortress Archways',
    cropRatio: 0.62,
    accessories: [
      {
        id: 'marathi-nath',
        name: 'NATH',
        localName: 'ब्राह्मणी नथ / मोत्याची नथ',
        description: 'Traditional Maharashtrian nose ring, a symbol of grace and pride.',
        culturalSignificance:
          'Iconic paisley-shaped crescent studded with basra pearls, emeralds, and a central red ruby.',
        hotspot3D: { x: 0.04, y: 1.05, z: 0.22 },
        cameraFocus: { y: 1.05, zoom: 1.8 },
        maker: {
          id: 'maker-mh-1',
          name: 'Vaidya Bandhu Motwale Jewellers',
          artisanTitle: 'Peshwa Pearl Specialist',
          location: 'Laxmi Road, Ravivar Peth',
          city: 'Pune',
          state: 'Maharashtra',
          coordinates: '18.5167° N, 73.8562° E',
          craft: 'Basra Pearl Naths & Chinchpetis',
          heritageYears: 'Established 1918 in Pune Old City',
          description:
            'A legendary shop preserving the exact curved contour of the Brahmi nath, hand-knotting every cultured pearl on reinforced silk cord.',
          visitingHours: '10:00 AM – 7:30 PM (Closed Mondays)',
          storySnippet:
            '“The Maharashtrian nath is not round like in the North. It curves like a rising cashew blossom — pure Peshwai grace.”',
          address: 'Shop #28, Ravivar Peth, near Sonya Maruti Chowk, Pune'
        }
      },
      {
        id: 'marathi-jhumka',
        name: 'JHUMKA EARRINGS',
        localName: 'कुडी / झुमके',
        description: 'Classic temple-style earrings that add a timeless charm.',
        culturalSignificance:
          'Kudi studs with hanging bells, crafted with solid 22k gold granulation and floral motifs.',
        hotspot3D: { x: -0.22, y: 0.98, z: 0.18 },
        cameraFocus: { y: 0.98, zoom: 1.7 },
        maker: {
          id: 'maker-mh-2',
          name: 'Tambe & Sons Heritage Goldsmiths',
          artisanTitle: 'Traditional Maratha Metalworker',
          location: 'Sarafa Bazaar, Gujri',
          city: 'Kolhapur',
          state: 'Maharashtra',
          coordinates: '16.7050° N, 74.2433° E',
          craft: 'Kolhapuri Saaj & Antique Kudi Earrings',
          heritageYears: '78 years of royal artisan patronage',
          description:
            'Specializes in lightweight temple earrings that honor the deity Mahalakshmi of Kolhapur.',
          visitingHours: '10:30 AM – 8:00 PM',
          storySnippet:
            '“Every gold bead is individually soldered with a hand-blown kerosene torch. You cannot duplicate this sound in a modern factory.”',
          address: 'Gujri Sarafa Bazaar, Kolhapur'
        }
      },
      {
        id: 'thushi-necklace',
        name: 'MANGALSUTRA / THUSHI',
        localName: 'ठुशी / कोल्हापुरी साज',
        description: 'A sign of tradition, beauty and strength.',
        culturalSignificance:
          'Closely strung golden beads held on a velvet backing or red thread, forming a protective high choker.',
        hotspot3D: { x: 0.0, y: 0.78, z: 0.2 },
        cameraFocus: { y: 0.78, zoom: 1.5 },
        maker: {
          id: 'maker-mh-3',
          name: 'Patil Thushi Craftsman Guild',
          artisanTitle: 'Master Thushi Maker',
          location: 'Bhausinghji Road, Town Hall',
          city: 'Kolhapur',
          state: 'Maharashtra',
          coordinates: '16.7020° N, 74.2410° E',
          craft: 'Authentic 21-Symbol Kolhapuri Saaj',
          heritageYears: '3 Generations preserving sacred Maratha amulets',
          description:
            'Featuring 21 hand-pressed golden amulets representing the sun, sacred banyan, fish, and lotus blossoms.',
          visitingHours: '11:00 AM – 7:00 PM',
          storySnippet:
            '“A bride from the Deccan wearing our Saaj carries the entire universe around her throat — from the river to the stars.”',
          address: 'Near Bhavani Mandap, Kolhapur'
        }
      },
      {
        id: 'kamarpatta',
        name: 'KAMARPATTA',
        localName: 'कंबरपट्टा',
        description: 'Traditional waist belt that completes the look with elegance.',
        culturalSignificance:
          'Anchors the heavy silk Nauvari pleats at the hip with sculpted Lakshmi and floral medallions.',
        hotspot3D: { x: 0.0, y: 0.28, z: 0.2 },
        cameraFocus: { y: 0.28, zoom: 1.4 },
        maker: {
          id: 'maker-mh-4',
          name: 'Yeola Silver Guild Collective',
          artisanTitle: 'Silver Waistband Crafter',
          location: 'Paithani Weavers Colony',
          city: 'Yeola, Nashik',
          state: 'Maharashtra',
          coordinates: '20.0435° N, 74.4882° E',
          craft: 'Hand-linked Silver Kamarpatta Belts',
          heritageYears: 'Community of 80 master weavers and silversmiths',
          description:
            'Handcrafted linked silver belts engineered to hold the dynamic motion of folk Lavani and traditional wedding celebrations.',
          visitingHours: '9:00 AM – 6:00 PM',
          storySnippet:
            '“When you hike up the fort with a Nauvari, the kamarpatta is what gives you posture and pride.”',
          address: 'Weavers Lane, Yeola, Nashik District'
        }
      },
      {
        id: 'kolhapuri-sandals',
        name: 'KOLHAPURI SANDALS',
        localName: 'कोल्हापुरी चप्पल',
        description: 'Traditional, comfortable and always in style.',
        culturalSignificance:
          'Hand-punched buff-leather sandals tanned with natural harad and babool bark, with yellow silk pom-poms (gonde).',
        hotspot3D: { x: -0.05, y: -1.3, z: 0.15 },
        cameraFocus: { y: -1.2, zoom: 1.5 },
        maker: {
          id: 'maker-mh-5',
          name: 'Babasaheb Kamble Leather Guild',
          artisanTitle: 'GI-Certified Kolhapuri Artisan',
          location: 'Subhash Road, Shivaji Market',
          city: 'Kolhapur',
          state: 'Maharashtra',
          coordinates: '16.6980° N, 74.2380° E',
          craft: 'Vegetable-Tanned 100-Year Kolhapuri Chappals',
          heritageYears: '68 years of zero-chemical leather craft',
          description:
            'No iron nails. No chemical glue. Stitched entirely with hand-braided leather cords that squeak distinctively (kan-kan) when walking.',
          visitingHours: '9:30 AM – 8:30 PM',
          storySnippet:
            '“A genuine Kolhapuri is made with tree bark and cold water. It keeps your body cool in 45°C Deccan summers.”',
          address: 'Shop #34, Subhash Road, Kolhapur'
        }
      }
    ]
  },

  'tamil-nadu': {
    id: 'tamil-nadu',
    name: 'TAMIL NADU',
    hindiName: 'तमिलनाडु',
    tagline: 'Dravidian Gopurams, Silk Weaves & Chola Bronzes',
    editorialQuote: 'Silk, craft and devotion.',
    subCopy:
      'Born in temple courtyards and Carnatic sabhas, Kanchipuram mulberry silks and lost-wax Chola bronzes embody a thousand years of sacred craftsmanship.',
    regionCraftNote: 'COROMANDEL TEMPLE GUILDS · KANCHIPURAM SILK & BRONZE #TN-1901',
    accentColor: '#9C1A35',
    borderPattern: 'repeating-linear-gradient(45deg, #9C1A35 0, #9C1A35 1px, transparent 0, transparent 8px)',
    bgTextureClass: 'bg-[#FDF3EA]',
    characterImage: '/dress-to-impress/chennnai.png',
    pedestalTexture: 'Dravidian Granite Stone Plinth',
    architecturalBackdrop: 'Meenakshi Temple & Thanjavur Brihadisvara Gopuram',
    cropRatio: 0.62,
    accessories: [
      {
        id: 'temple-jewellery',
        name: 'TEMPLE JEWELLERY',
        localName: 'கோவில் நகைகள் (Kovil Nagai)',
        description: 'Traditional gold temple necklace and earrings, a timeless symbol of grace and heritage.',
        culturalSignificance:
          'Originating in the Chola dynasty to adorn temple deities, featuring pure silver dipped in 24k gold leaf and red kemp stones.',
        hotspot3D: { x: 0.0, y: 0.78, z: 0.2 },
        cameraFocus: { y: 0.78, zoom: 1.5 },
        maker: {
          id: 'maker-tn-1',
          name: 'Vembuli Sthapathi Temple Jewel Guild',
          artisanTitle: 'Hereditary Temple Goldsmith',
          location: 'Sannidhi Street, Mylapore',
          city: 'Chennai',
          state: 'Tamil Nadu',
          coordinates: '13.0334° N, 80.2694° E',
          craft: 'Hand-set Kemp Stone & 24k Gold Dip',
          heritageYears: '4 Generations serving Kapaleeshwarar Temple',
          description:
            'Carving Goddess Lakshmi and dancing peacock motifs into beeswax moulds before encrusting unheated Burmese kemp stones.',
          visitingHours: '10:00 AM – 7:30 PM (Closed on Tuesdays)',
          storySnippet:
            '“Our great-grandfather made ornaments for the temple deity. Today we make the same divine designs for travellers who cherish the sacred art.”',
          address: 'Door #12, Sannidhi Street, Mylapore, Chennai'
        }
      },
      {
        id: 'jasmine-flowers',
        name: 'JASMINE FLOWERS (GAJRA)',
        localName: 'மதுரை மல்லி (Madurai Malli)',
        description: 'Fresh jasmine flowers for a touch of natural elegance and tradition.',
        culturalSignificance:
          'GI-tagged Madurai Malli known worldwide for its thick petals and enduring natural fragrance that lasts for 36 hours.',
        hotspot3D: { x: -0.22, y: 1.15, z: 0.15 },
        cameraFocus: { y: 1.15, zoom: 1.7 },
        maker: {
          id: 'maker-tn-2',
          name: 'Meenakshi Flower Stringing Cooperative',
          artisanTitle: 'Master Flower Artisan Guild',
          location: 'Mattuthavani Flower Market',
          city: 'Madurai',
          state: 'Tamil Nadu',
          coordinates: '9.9324° N, 78.1489° E',
          craft: 'Uruttu Kattu & Kadhambam Stringing',
          heritageYears: 'Family cooperative active since 1952',
          description:
            'Using hand-spun banana fiber to knot fresh jasmine blossoms at dawn, creating unbroken scented garlands for weddings and festivals.',
          visitingHours: '5:00 AM – 2:00 PM',
          storySnippet:
            '“Madurai jasmine cannot be grown anywhere else — the soil and early morning Cauvery breeze give it a fragrance that stays with you forever.”',
          address: 'Stall 14, Mattuthavani Flower Bazaar, Madurai'
        }
      },
      {
        id: 'tamil-jhumka',
        name: 'JHUMKA EARRINGS',
        localName: 'ஜிமிக்கி (Jimikki)',
        description: 'Classic temple-style jhumkas that add charm and tradition.',
        culturalSignificance:
          'Cascading gold domes bordered by micro-pearl drops, made famous across generations in classical Bharatanatyam recital.',
        hotspot3D: { x: -0.22, y: 0.98, z: 0.18 },
        cameraFocus: { y: 0.98, zoom: 1.7 },
        maker: {
          id: 'maker-tn-3',
          name: 'Thanjavur Traditional Jewellers',
          artisanTitle: 'Classical Carnatic Jeweller',
          location: 'East Main Street, Palace Grounds',
          city: 'Thanjavur',
          state: 'Tamil Nadu',
          coordinates: '10.7870° N, 79.1378° E',
          craft: 'Granulated Gold Jimikkis & Maang Malai',
          heritageYears: '82 years of classical artisan patronage',
          description:
            'Creating hand-turned jimikkis with hollow domes that resonate with gentle musical chiming during classical dance steps.',
          visitingHours: '10:00 AM – 8:00 PM',
          storySnippet:
            '“A Jimikki must have acoustic balance. When the dancer moves, the pearls must brush the jawline like a whisper.”',
          address: 'East Main Street, near Maratha Palace, Thanjavur'
        }
      },
      {
        id: 'tamil-bangles',
        name: 'BANGLES',
        localName: 'வளையல் (Valaiyal)',
        description: 'Red and gold bangles that bring in prosperity and completeness to the look.',
        culturalSignificance:
          'Deep vermilion red glass bangles interspersed with pure gold-leaf kangan, celebrated in Tamil harvest traditions.',
        hotspot3D: { x: 0.25, y: 0.35, z: 0.2 },
        cameraFocus: { y: 0.35, zoom: 1.4 },
        maker: {
          id: 'maker-tn-4',
          name: 'Kanchipuram Silk & Valaiyal Haat',
          artisanTitle: 'Silk & Bangle Guild Guildmaster',
          location: 'Gandhi Road',
          city: 'Kanchipuram',
          state: 'Tamil Nadu',
          coordinates: '12.8342° N, 79.7036° E',
          craft: 'Traditional Lac & Glass Bangles',
          heritageYears: 'Generations of weaving and adornment guilds',
          description:
            'Supplying temple brides with heirloom sets of 16 handcrafted glass and brass bangles.',
          visitingHours: '9:00 AM – 8:00 PM',
          storySnippet:
            '“The sound of glass bangles in an old courtyarded agraharam house is the sound of prosperity.”',
          address: 'Shop #64, Gandhi Road, Kanchipuram'
        }
      }
    ]
  },

  gujarat: {
    id: 'gujarat',
    name: 'GUJARAT',
    hindiName: 'गुजरात',
    tagline: 'White Rann, Double-Ikat Patola & Garba Spirit',
    editorialQuote: 'Thread, mirror and desert rhythm.',
    subCopy:
      'Shaped by the salt expanse of Kutch and the stepwell corridors of Patan, double-ikat Patola weaves and Rabari mirrorwork transform fabric into protective folklore.',
    regionCraftNote: 'RANN OF KUTCH GUILDS · PATOLA & ROGAN REGISTRATION #GJ-1830',
    accentColor: '#C98A2E',
    borderPattern: 'repeating-linear-gradient(45deg, #C98A2E 0, #C98A2E 1px, transparent 0, transparent 8px)',
    bgTextureClass: 'bg-[#FDF3EA]',
    characterImage: '/dress-to-impress/gujarat.png',
    pedestalTexture: 'Sankheda Carved Teakwood Plinth',
    architecturalBackdrop: 'Rani ki Vav Stepwell & Sun Temple Modhera Carvings',
    cropRatio: 0.62,
    accessories: [
      {
        id: 'kutchi-damini',
        name: 'KUTCHI DAMINI',
        localName: 'दामिनी / बोर',
        description: 'Traditional head ornament with cascading silver chains and central medallion.',
        culturalSignificance:
          'Protective amulet worn across Kathiawar and Kutch during Navratri garba to frame the face with hand-cut mirrors.',
        hotspot3D: { x: -0.05, y: 1.25, z: 0.2 },
        cameraFocus: { y: 1.2, zoom: 1.6 },
        maker: {
          id: 'maker-gj-1',
          name: 'Naranji Jetha Silver Guild',
          artisanTitle: 'Tribal Kutchi Silversmith',
          location: 'Sarafa Bazaar, Bhuj Old Town',
          city: 'Bhuj',
          state: 'Gujarat',
          coordinates: '23.2420° N, 69.6669° E',
          craft: 'Solid Silver Damini & Hansli Chokers',
          heritageYears: '84 years in Kutch valley',
          description:
            'Hammering raw silver ingots into flexible braided chains adorned with hand-punched floral coins.',
          visitingHours: '10:00 AM – 7:00 PM',
          storySnippet:
            '“In the desert, silver reflects the moonlight and wards off the harsh glare of the salt flats.”',
          address: 'Sarafa Bazaar, near Prag Mahal, Bhuj, Kutch'
        }
      },
      {
        id: 'kathiawadi-nath',
        name: 'KATHIAWADI NATH',
        localName: 'नथडी / वाळी',
        description: 'Traditional nose ornament with delicate suspended pearls and silver wire.',
        culturalSignificance:
          'A lightweight hoop that echoes the circular sun and moon motifs of ancient Saurashtra folklore.',
        hotspot3D: { x: 0.04, y: 1.05, z: 0.22 },
        cameraFocus: { y: 1.05, zoom: 1.8 },
        maker: {
          id: 'maker-gj-2',
          name: 'Prabhudas Vithaldas Goldsmiths',
          artisanTitle: 'Kathiawadi Heritage Jeweller',
          location: 'Dharmendra Road',
          city: 'Rajkot',
          state: 'Gujarat',
          coordinates: '22.3039° N, 70.8022° E',
          craft: 'Handcrafted Gold & Silver Nathdis',
          heritageYears: '92 years of continuous master craftsmanship',
          description:
            'Famous across Saurashtra for microscopic pearl-setting around featherweight gold and silver hoops.',
          visitingHours: '10:30 AM – 8:00 PM',
          storySnippet:
            '“Every bride in Rajkot knows our door. Our nathdi rests gently and sparkles in the lantern light.”',
          address: 'Dharmendra Road, Old Rajkot Bazaar'
        }
      },
      {
        id: 'silver-hansli',
        name: 'SILVER HANSLI',
        localName: 'हंसली / हांसड़ी',
        description: 'Rigid torque collar necklace made of hand-hammered solid silver.',
        culturalSignificance:
          'Traditional collar worn by Rabari and Ahir pastoral women, engraved with tribal geometric zigzags and pea-fowl motifs.',
        hotspot3D: { x: 0.0, y: 0.8, z: 0.2 },
        cameraFocus: { y: 0.8, zoom: 1.5 },
        maker: {
          id: 'maker-gj-3',
          name: 'Kutch Tribal Silver Guild',
          artisanTitle: 'Nomadic Pastoral Metalcraftsman',
          location: 'Bhujodi Artisan Village',
          city: 'Bhujodi, Kutch',
          state: 'Gujarat',
          coordinates: '23.2389° N, 69.7212° E',
          craft: 'Hand-Cast Solid Silver Hanslis & Kadis',
          heritageYears: '120 years of nomadic desert metalwork',
          description:
            'Using river clay moulds and primitive foot-bellows to craft torque chokers that last for three generations.',
          visitingHours: '9:00 AM – 6:30 PM',
          storySnippet:
            '“Our jewellery is our bank and our poetry. A mother passes her hansli to her daughter as a shield of strength.”',
          address: 'Artisan Workshop #4, Bhujodi Craft Village, Kutch'
        }
      },
      {
        id: 'gujarat-potli',
        name: 'POTLI BAG',
        localName: 'आभला पोटली (Abhla Potli)',
        description: 'Hand-embroidered pouch with authentic Kutchi mirrorwork and vibrant silk tassels.',
        culturalSignificance:
          'Features hand-blown mirrors (abhla) caught in dense herringbone stitch (heer bharat) with vibrant turmeric and indigo threads.',
        hotspot3D: { x: -0.28, y: 0.25, z: 0.25 },
        cameraFocus: { y: 0.25, zoom: 1.4 },
        maker: {
          id: 'maker-gj-4',
          name: 'Shrujan Artisan Collective',
          artisanTitle: 'Master Rabari Embroiderer Guild',
          location: 'Ajrakhpur & Bhujodi Centers',
          city: 'Ajrakhpur, Kutch',
          state: 'Gujarat',
          coordinates: '23.2180° N, 69.8130° E',
          craft: 'Authentic 16-Stitch Kutchi Mirror Embroidery',
          heritageYears: 'Empowering 4,000+ village women artisans across 120 hamlets',
          description:
            'Preserving ancient embroidery traditions where mirrors catch the desert sun, stitched on handloom cotton with zero middlemen.',
          visitingHours: '9:30 AM – 6:00 PM',
          storySnippet:
            '“Every mirror is held by sixteen knots of thread. In the desert dust, it shines like water.”',
          address: 'Shrujan Campus, Post Bhujodi, Kutch'
        }
      }
    ]
  }
};
