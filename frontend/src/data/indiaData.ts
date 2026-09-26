import { IndiaState, Quest } from '../types';

export const INDIA_ZONES = [
  { id: 'All', label: 'All of India' },
  { id: 'North', label: 'Northern India' },
  { id: 'South', label: 'Southern India' },
  { id: 'West', label: 'Western India' },
  { id: 'East', label: 'Eastern India' },
  { id: 'Central', label: 'Central India' },
  { id: 'North-East', label: 'North-Eastern India' },
  { id: 'UT', label: 'Union Territories' }
];

export const ALL_INDIA_STATES: IndiaState[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'State',
    zone: 'North',
    capital: 'Jaipur',
    tagline: 'Land of Kings, Palaces & Desert Living Heritage',
    description: 'Home to majestic hill forts, Thar desert dunes, Blue Pottery, miniature painting guilds, and 500-year-old puppet troubadours.',
    colorHex: '#E85B70', // Crimson Red
    coords3D: [-2.1, 0.4, 0.6],
    coords2D: { x: 26, y: 34 },
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 4,
    culturalHighlights: {
      giCrafts: ['Jaipur Blue Pottery', 'Bagru Hand Block Print', 'Kathputli Puppets', 'Makrana Marble Art'],
      iconicDelicacies: ['Dal Baati Churma', 'Ker Sangri', 'Ghevar', 'Pyaaz Kachori'],
      folkTraditions: ['Ghoomar Dance', 'Kalbelia Troupe', 'Ravanahatha Ballads', 'Bhopa Epic Recitations'],
      heritageSites: ['Hawa Mahal', 'Amber Fort', 'Chand Baori Stepwell', 'Mehrangarh Fort']
    },
    crowdAlert: {
      hasAlert: true,
      location: 'Amber Fort Main Gate',
      multiplier: 2.2
    }
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    type: 'State',
    zone: 'West',
    capital: 'Mumbai',
    tagline: 'Gateway to Sahyadri Forts, Warli Art & Coastal Flavors',
    description: 'From rock-cut caves of Ajanta & Ellora to vibrant brass smith lanes of Pune and coastal Konkan spice orchards.',
    colorHex: '#C81D11', // Deep Sindoor Red
    coords3D: [-1.4, -0.6, 0.4],
    coords2D: { x: 30, y: 58 },
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 3,
    culturalHighlights: {
      giCrafts: ['Paithani Silk Sarees', 'Warli Tribal Painting', 'Kolhapuri Chappals', 'Tambat Hand-Hammered Copper'],
      iconicDelicacies: ['Misal Pav', 'Puran Poli', 'Malvani Fish Curry', 'Modak'],
      folkTraditions: ['Lavani Dance', 'Powada Ballad', 'Ganesh Utsav Dhol Tasha', 'Dhangari Gaja'],
      heritageSites: ['Gateway of India', 'Ajanta & Ellora Caves', 'Raigad Fort', 'Shaniwar Wada']
    },
    crowdAlert: {
      hasAlert: true,
      location: 'Gateway of India Wharf',
      multiplier: 2.0
    }
  },
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'State',
    zone: 'South',
    capital: 'Thiruvananthapuram',
    tagline: 'God’s Own Country, Backwaters & Kathakali Rhythms',
    description: 'Emerald backwaters, spice plantations in Wayanad, Aranmula metal mirrors, and sacred Theyyam fire rituals.',
    colorHex: '#E65100', // Saffron / Kesari
    coords3D: [-0.9, -2.2, 0.1],
    coords2D: { x: 35, y: 88 },
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 3,
    culturalHighlights: {
      giCrafts: ['Aranmula Kannadi (Metal Mirror)', 'Balaramapuram Handloom', 'Screw Pine Craft', 'Nettur Petti Jewelry Box'],
      iconicDelicacies: ['Appam with Stew', 'Sadya Feast', 'Malabar Biryani', 'Puttu & Kadala Curry'],
      folkTraditions: ['Kathakali Drama', 'Theyyam Rituals', 'Kalaripayattu Martial Art', 'Chenda Melam'],
      heritageSites: ['Alappuzha Backwaters', 'Mattancherry Palace', 'Bekal Fort', 'Padmanabhaswamy Temple']
    },
    crowdAlert: {
      hasAlert: false,
      location: 'Fort Kochi Beach',
      multiplier: 1.5
    }
  },
  {
    id: 'delhi',
    name: 'Delhi',
    type: 'Union Territory',
    zone: 'UT',
    capital: 'New Delhi',
    tagline: 'The Seven Cities, Spice Bazaars & Mughal Architecture',
    description: 'Centuries of empire converging in aromatic spice arcades of Old Delhi, Mehrauli stepwells, and artisanal craft haats.',
    colorHex: '#450915', // Garnet Red
    coords3D: [-0.8, 1.0, 0.4],
    coords2D: { x: 38, y: 28 },
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 3,
    culturalHighlights: {
      giCrafts: ['Old Delhi Zardozi Embroidery', 'Paper Mache Art', 'Inlay Stone Work', 'Chanderi Weaves'],
      iconicDelicacies: ['Old Delhi Saffron Jalebi', 'Butter Chicken', 'Nihari & Kulcha', 'Daulat ki Chaat'],
      folkTraditions: ['Qawwali at Nizamuddin', 'Dastangoi Storytelling', 'Shehnai Recitals', 'Ghazal Evenings'],
      heritageSites: ['Red Fort', 'Humayun’s Tomb', 'Qutub Minar', 'Agrasen ki Baoli']
    },
    crowdAlert: {
      hasAlert: true,
      location: 'Red Fort Lahori Gate',
      multiplier: 2.5
    }
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    type: 'State',
    zone: 'North',
    capital: 'Lucknow',
    tagline: 'Heartland of Ghats, Taj Marble & Chikankari Elegance',
    description: 'Sacred riverfronts of Varanasi, Awadhi royal culinary secrets, brass artisans of Moradabad, and Kannauj perfume distillers.',
    colorHex: '#F59E0B', // Deep Marigold Orange
    coords3D: [0.1, 0.8, 0.3],
    coords2D: { x: 48, y: 35 },
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 3,
    culturalHighlights: {
      giCrafts: ['Varanasi Zari & Brocade', 'Lucknow Chikankari', 'Moradabad Brassware', 'Kannauj Rose Attar (Mitti Attar)'],
      iconicDelicacies: ['Galouti Kebab', 'Banarasi Paan', 'Makhan Malai', 'Awadhi Biryani'],
      folkTraditions: ['Ganga Aarti at Dashashwamedh', 'Kathak Classical Dance', 'Biraha Ballads', 'Ramlila'],
      heritageSites: ['Taj Mahal', 'Kashi Vishwanath Ghats', 'Fatehpur Sikri', 'Bara Imambara']
    },
    crowdAlert: {
      hasAlert: true,
      location: 'Taj Mahal East Gate',
      multiplier: 2.4
    }
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'State',
    zone: 'South',
    capital: 'Chennai',
    tagline: 'Dravidian Gopurams, Carnatic Music & Chola Bronzes',
    description: 'Towering temple gopurams, ancient bronze casting techniques in Thanjavur, silk weavers of Kanchipuram, and Chettinad spice estates.',
    colorHex: '#9C1A35', // Indian Red
    coords3D: [-0.4, -2.1, -0.1],
    coords2D: { x: 44, y: 84 },
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 3,
    culturalHighlights: {
      giCrafts: ['Kanchipuram Silk Sarees', 'Thanjavur Paintings', 'Swamimalai Bronze Icons', 'Nachiarcoil Brass Lamps'],
      iconicDelicacies: ['Chettinad Pepper Chicken', 'Filter Coffee (Kaapi)', 'Idli Sambar', 'Tirunelveli Halwa'],
      folkTraditions: ['Bharatanatyam', 'Carnatic Margazhi Festival', 'Therukoothu Street Theatre', 'Villu Paatu'],
      heritageSites: ['Brihadeeswarar Temple', 'Meenakshi Amman Temple', 'Shore Temple Mamallapuram', 'Chettinad Mansions']
    },
    crowdAlert: {
      hasAlert: false,
      location: 'Meenakshi Temple East Gopuram',
      multiplier: 1.6
    }
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    type: 'State',
    zone: 'East',
    capital: 'Kolkata',
    tagline: 'City of Joy, Terracotta Temples & Baluchari Weaves',
    description: 'Bishnupur clay craftsmanship, Darjeeling Himalayan tea slopes, Dokra bell metal craft, and Baul mystical singers.',
    colorHex: '#E85B70', // Blood Orange
    coords3D: [1.6, 0.1, 0.1],
    coords2D: { x: 74, y: 47 },
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Bishnupur Terracotta Tiles', 'Baluchari Silk Weaves', 'Dokra Brass Casting', 'Shantiniketan Leather Goods'],
      iconicDelicacies: ['Rosogolla', 'Mishti Doi', 'Macher Jhol', 'Kolkata Kathi Roll'],
      folkTraditions: ['Baul Folk Music', 'Chhau Masked Dance', 'Durga Puja Pandal Art', 'Rabindra Sangeet'],
      heritageSites: ['Victoria Memorial', 'Bishnupur Terracotta Temples', 'Sundarbans Mangroves', 'Darjeeling Toy Train']
    }
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    type: 'State',
    zone: 'North',
    capital: 'Shimla',
    tagline: 'Land of Gods, Apple Valleys & Kathkuni Architecture',
    description: 'Earthquake-resistant timber-stone temples, Kullu shawl weavers, Kangra miniature art, and pristine pine trails.',
    colorHex: '#7A1026', // Copper Tulip
    coords3D: [-0.9, 1.8, 0.4],
    coords2D: { x: 34, y: 19 },
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Kullu Handwoven Shawls', 'Chamba Rumal Embroidery', 'Kangra Miniature Painting', 'Kinnauri Caps'],
      iconicDelicacies: ['Himachali Dham Feast', 'Siddu with Ghee', 'Babru', 'Madra Chickpea Curry'],
      folkTraditions: ['Nati Folk Dance', 'Kullu Dussehra Procession', 'Fagli Festival', 'Devta Parliaments'],
      heritageSites: ['Hidimba Devi Wooden Temple', 'Kangra Fort', 'Tabo Monastery', 'Viceregal Lodge']
    }
  },
  {
    id: 'assam',
    name: 'Assam',
    type: 'State',
    zone: 'North-East',
    capital: 'Dispur',
    tagline: 'Golden Muga Silk, Brahmaputra Whispers & Majuli Masks',
    description: 'World’s largest river island Majuli, shimmering golden Muga silk, Bihu drumbeats, and one-horned rhino sanctuaries.',
    colorHex: '#F59E0B', // Terracotta Orange
    coords3D: [2.5, 0.7, 0.0],
    coords2D: { x: 88, y: 38 },
    heroImage: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Muga Golden Silk', 'Majuli Bamboo & Clay Masks', 'Sarthebari Bell Metal', 'Assam Black Tea Orthodoxy'],
      iconicDelicacies: ['Masor Tenga', 'Khaar with Raw Papaya', 'Pitha Rice Rolls', 'Duck Meat Curry'],
      folkTraditions: ['Bihu Dance & Dhol', 'Sattriya Classical Dance', 'Borgeet Melodies', 'Mask Theatre (Mukha Chha)'],
      heritageSites: ['Kaziranga National Park', 'Majuli River Island', 'Kamakhya Temple', 'Rang Ghar Pavilion']
    }
  },
  {
    id: 'punjab',
    name: 'Punjab',
    type: 'State',
    zone: 'North',
    capital: 'Chandigarh',
    tagline: 'Land of Five Rivers, Golden Temple & Phulkari Embroidery',
    description: 'Vibrant golden mustard fields, 24/7 Langar community kitchen tradition, high-energy Bhangra, and hand-embroidered phulkari dupattas.',
    colorHex: '#FF8F00', // Marigold Amber
    coords3D: [-1.4, 1.4, 0.5],
    coords2D: { x: 30, y: 22 },
    heroImage: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Phulkari Floral Embroidery', 'Jalandhar Sports Goods', 'Punjabi Jutti Shoes', 'Handcrafted Parandi'],
      iconicDelicacies: ['Makki di Roti & Sarson da Saag', 'Amritsari Kulcha', 'Lassi in Big Earthen Glasses', 'Pinni'],
      folkTraditions: ['Bhangra & Giddha', 'Gatka Martial Art', 'Langar Seva (Community Cooking)', 'Kikli Dance'],
      heritageSites: ['Golden Temple (Harmandir Sahib)', 'Jallianwala Bagh', 'Qila Mubarak', 'Wagah Border']
    }
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    type: 'State',
    zone: 'West',
    capital: 'Gandhinagar',
    tagline: 'White Rann Salt Desert, Patola Weavers & Garba Nights',
    description: 'Double-ikat Patola silks requiring 6 months per saree, copper stepwells of Adalaj, Asiatic lion kingdom of Gir, and Kutchi mirror embroidery.',
    colorHex: '#C62828', // Deep Crimson
    coords3D: [-2.2, -0.1, 0.6],
    coords2D: { x: 18, y: 46 },
    heroImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Patan Double-Ikat Patola', 'Kutch Rogan Art on Fabric', 'Tangaliya Shawls', 'Sankheda Wooden Furniture'],
      iconicDelicacies: ['Dhokla & Khandvi', 'Gujarati Thali with Kadhi', 'Undhiyu', 'Fafda Jalebi'],
      folkTraditions: ['Garba & Dandiya Raas', 'Bhavai Folk Theatre', 'Siddi Dhamal Dance', 'Rann Utsav Crafts'],
      heritageSites: ['Rani ki Vav (Queen’s Stepwell)', 'Rann of Kutch', 'Sun Temple Modhera', 'Gir Sanctuary']
    }
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'State',
    zone: 'West',
    capital: 'Panaji',
    tagline: 'Portuguese Baroque, Spice Plantations & Azulejo Tiles',
    description: 'Hand-painted ceramic tiles, spice farms nestled in Sahyadris, Indo-Portuguese villas of Fontainhas, and rhythmic Ghode Modni dance.',
    colorHex: '#FF5722', // Fiery Orange Red
    coords3D: [-1.4, -1.5, 0.3],
    coords2D: { x: 28, y: 72 },
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Goan Azulejo Ceramic Tile Art', 'Goan Cashew Feni', 'Khaje Sweet', 'Moira Bananas'],
      iconicDelicacies: ['Fish Curry Rice', 'Pork Vindaloo', 'Bebinca Layered Pudding', 'Poi Bread'],
      folkTraditions: ['Fugdi Dance', 'Dhalo Song Circles', 'Ghode Modni Cavalcade', 'Shigmo Spring Festival'],
      heritageSites: ['Basilica of Bom Jesus', 'Fontainhas Latin Quarter', 'Aguada Fort', 'Tambdi Surla Temple']
    }
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    type: 'Union Territory',
    zone: 'UT',
    capital: 'Srinagar / Jammu',
    tagline: 'Crown of Saffron, Pashmina Weavers & Shikara Lore',
    description: 'Floating vegetable markets on Dal Lake, pure Cashmere pashmina looms, walnut wood carvers, and royal Wazwan banquet courses.',
    colorHex: '#A71C1C', // Saffron Sindoor
    coords3D: [-1.1, 2.3, 0.3],
    coords2D: { x: 31, y: 9 },
    heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Kashmir Pashmina Shawls', 'Kani Weaving', 'Walnut Wood Carving', 'Kashmir Saffron (Pampore)'],
      iconicDelicacies: ['Rogan Josh', 'Gushtaba in Yakhni', 'Kashmiri Kahwa with Almonds', 'Haakh Saag'],
      folkTraditions: ['Rouf Folk Dance', 'Bhand Pather Theatre', 'Sufiana Kalam Music', 'Shikara Boating Lore'],
      heritageSites: ['Dal Lake & Houseboats', 'Shalimar Mughal Garden', 'Gulmarg Valleys', 'Martand Sun Temple']
    }
  },
  {
    id: 'odisha',
    name: 'Odisha',
    type: 'State',
    zone: 'East',
    capital: 'Bhubaneswar',
    tagline: 'Sun Chariots, Raghurajpur Pattachitra & Silver Filigree',
    description: 'Artists who paint on palm leaves, the gigantic stone chariot of Konark, delicate Cuttack Tarakasi silver work, and sacred Jagannath Mahaprasad.',
    colorHex: '#D84315', // Rust Amber
    coords3D: [1.2, -0.5, 0.1],
    coords2D: { x: 62, y: 55 },
    heroImage: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Raghurajpur Pattachitra on Cloth & Palm', 'Cuttack Silver Filigree (Tarakasi)', 'Sambalpuri Ikat Silk', 'Pipili Applique Work'],
      iconicDelicacies: ['Chhena Poda (Burnt Cheese Cake)', 'Pakhala Bhata', 'Puri Temple Khaja', 'Dalma'],
      folkTraditions: ['Odissi Classical Dance', 'Gotipua Acrobatics', 'Chhau Dance', 'Rath Yatra Procession'],
      heritageSites: ['Konark Sun Temple', 'Jagannath Temple Puri', 'Udayagiri & Khandagiri Caves', 'Chilika Lake']
    }
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'State',
    zone: 'South',
    capital: 'Bengaluru',
    tagline: 'Ruins of Hampi, Mysore Sandalwood & Channapatna Toys',
    description: 'Monolithic boulders and royal pavilions of Vijayanagara, vegetable-dyed wooden toys of Channapatna, and fragrant Mysore rosewood inlays.',
    colorHex: '#C0392B',
    coords3D: [-0.9, -1.2, 0.2],
    coords2D: { x: 34, y: 72 },
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f4439c87?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Channapatna Wooden Toys', 'Mysore Silk Sarees', 'Bidriware Silver Inlay', 'Ilkal Handloom Sarees'],
      iconicDelicacies: ['Bisi Bele Bath', 'Mysore Pak', 'Benne Dosa', 'Coorg Pandi Curry'],
      folkTraditions: ['Yakshagana Dance Drama', 'Dollu Kunitha Drumming', 'Mysore Dasara Procession', 'Kambala Buffalo Race'],
      heritageSites: ['Hampi Boulder Monuments', 'Mysore Palace', 'Badami Cave Temples', 'Belur & Halebidu Sculptures']
    }
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    type: 'State',
    zone: 'Central',
    capital: 'Bhopal',
    tagline: 'Heart of India, Khajuraho Sculptures & Gond Tribal Art',
    description: 'Ancient rock shelters of Bhimbetka, Sanchi Buddhist stupas, Chanderi sheer silks, and vivid Gond tribal storytelling canvasses.',
    colorHex: '#E65100',
    coords3D: [-0.4, 0.1, 0.3],
    coords2D: { x: 42, y: 46 },
    heroImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 2,
    culturalHighlights: {
      giCrafts: ['Chanderi Silk & Cotton Weaves', 'Gond Tribal Paintings', 'Bagh Print Fabric', 'Batik Block Prints'],
      iconicDelicacies: ['Indori Poha & Jalebi', 'Bhopali Biryani', 'Mawa Bati', 'Dal Bafla'],
      folkTraditions: ['Matki Dance', 'Pandavani Ballads', 'Bhagoria Tribal Fair', 'Rai Dance'],
      heritageSites: ['Khajuraho Temples', 'Sanchi Stupa', 'Gwalior Fort', 'Bhimbetka Caves']
    }
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    type: 'State',
    zone: 'North',
    capital: 'Dehradun',
    tagline: 'Abode of Gods, Ganga River Headwaters & Aipan Folk Art',
    description: 'Sacred cedar valleys, white-water rapids, Bhotia wool weavers, and auspicious red-and-white Aipan geometric floor murals.',
    colorHex: '#FF7043',
    coords3D: [-0.2, 1.4, 0.4],
    coords2D: { x: 44, y: 22 },
    heroImage: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Kumaon Aipan Sacred Art', 'Ringal Bamboo Craft', 'Bhotia Woolen Rugs', 'Thulma Blankets'],
      iconicDelicacies: ['Kafli Spinach Curry', 'Bhatt ki Churkani', 'Bal Mithai with Roasted Mawa', 'Singori'],
      folkTraditions: ['Jhora & Chholiya Sword Dance', 'Ganga Aarti Haridwar', 'Nanda Devi Raj Jat', 'Pandav Nritya'],
      heritageSites: ['Rishikesh Suspension Bridges', 'Kedarnath Temple', 'Valley of Flowers', 'Jageshwar Temples']
    }
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    type: 'Union Territory',
    zone: 'UT',
    capital: 'Leh',
    tagline: 'Roof of the World, Buddhist Monasteries & High Passes',
    description: 'High altitude desert sanctuaries, monk mask dances (Cham), butter tea, and ancient Thangka scroll painters.',
    colorHex: '#991B1B',
    coords3D: [-0.6, 2.7, 0.2],
    coords2D: { x: 38, y: 6 },
    heroImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Ladakhi Pashmina', 'Thangka Buddhist Scrolls', 'Ladakhi Wood Carved Choktse Tables', 'Chamba Clay Sculptures'],
      iconicDelicacies: ['Thukpa Noodle Broth', 'Butter Tea (Gur Gur Chai)', 'Momos with Tingmo Bread', 'Khambir Fermented Bread'],
      folkTraditions: ['Hemis Cham Mask Dance', 'Ladakhi Losar Festival', 'Archery Competitions', 'Daman & Surna Music'],
      heritageSites: ['Pangong Tso Lake', 'Thiksey Monastery', 'Leh Palace', 'Nubra Valley Dunes']
    }
  },
  {
    id: 'telangana',
    name: 'Telangana',
    type: 'State',
    zone: 'South',
    capital: 'Hyderabad',
    tagline: 'City of Pearls, Charminar & Pochampally Ikat',
    description: 'Geometric Pochampally Ikat silk weaves, Dokra metal bells, aromatic Dum Biryani, and Golconda whispering galleries.',
    colorHex: '#B91C1C',
    coords3D: [-0.3, -0.7, 0.2],
    coords2D: { x: 44, y: 64 },
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Pochampally Ikat Silk', 'Nirmal Wooden Toys & Paintings', 'Gadwal Sarees', 'Pembarthi Brass Metal Craft'],
      iconicDelicacies: ['Hyderabadi Dum Biryani', 'Mirchi ka Salan', 'Double ka Meetha', 'Sarva Pindi'],
      folkTraditions: ['Bonalu Festival Procession', 'Bathukamma Flower Festival', 'Perini Shivatandavam Dance', 'Oggu Katha'],
      heritageSites: ['Charminar', 'Golconda Fort', 'Ramappa Kakatiya Temple', 'Chowmahalla Palace']
    }
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    type: 'State',
    zone: 'South',
    capital: 'Amaravati',
    tagline: 'Kalamkari Hand Paint, Kondapalli Toys & Kuchipudi',
    description: 'Natural vegetable-dyed mythological Kalamkari scrolls, soft wood Kondapalli toys, and spicy coastal delicacies.',
    colorHex: '#C2410C',
    coords3D: [0.1, -1.2, 0.1],
    coords2D: { x: 49, y: 72 },
    heroImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Srikalahasti Kalamkari', 'Kondapalli Wooden Toys', 'Machilipatnam Block Prints', 'Venkatagiri Sarees'],
      iconicDelicacies: ['Gongura Pachadi', 'Andhra Pesarattu', 'Pootharekulu Sweet Paper', 'Kakinada Kaja'],
      folkTraditions: ['Kuchipudi Classical Dance', 'Burra Katha', 'Tholu Bommalata (Shadow Puppetry)', 'Tappeta Gullu'],
      heritageSites: ['Tirupati Temple', 'Lepakshi Hanging Pillar', 'Borra Caves Araku', 'Undavalli Caves']
    }
  },
  {
    id: 'bihar',
    name: 'Bihar',
    type: 'State',
    zone: 'East',
    capital: 'Patna',
    tagline: 'Birthplace of Buddhism, Madhubani Art & Nalanda Ruins',
    description: 'Intricate Madhubani line art drawn with twigs and fingers, the world’s first residential university Nalanda, and Bodh Gaya Bodhi Tree.',
    colorHex: '#DC2626',
    coords3D: [1.0, 0.4, 0.2],
    coords2D: { x: 62, y: 38 },
    heroImage: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Madhubani (Mithila) Painting', 'Bhagalpuri Silk', 'Sikki Grass Craft', 'Khatwa Applique'],
      iconicDelicacies: ['Litti Chokha with Ghee', 'Sattu Paratha', 'Khaja of Silao', 'Tilkut of Gaya'],
      folkTraditions: ['Chhath Puja Sunset Rituals', 'Bhojpuri Lokgeet', 'Jat-Jatin Dance', 'Bidesia Folk Drama'],
      heritageSites: ['Mahabodhi Temple Bodh Gaya', 'Ancient Nalanda University', 'Vikramshila Ruins', 'Barabar Caves']
    }
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    type: 'State',
    zone: 'North-East',
    capital: 'Gangtok',
    tagline: 'Kanchenjunga Kingdom, Organic Spices & Lepcha Weaves',
    description: 'Framed by the world’s 3rd highest mountain peak, 100% organic cardamom valleys, and ancient Buddhist prayer wheels.',
    colorHex: '#EA580C',
    coords3D: [1.8, 1.0, 0.1],
    coords2D: { x: 74, y: 31 },
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Sikkim Large Cardamom', 'Lepcha Handloom Weaving', 'Choktse Carved Tables', 'Handmade Rice Paper'],
      iconicDelicacies: ['Gundruk Soup', 'Momos with Chhurpi Yak Cheese', 'Sel Roti', 'Phagshapa Pork & Radish'],
      folkTraditions: ['Singhi Chham (Snow Lion Dance)', 'Mask Dances of Rumtek', 'Pang Lhabsol Festival', 'Tamang Selo'],
      heritageSites: ['Rumtek Monastery', 'Nathula Pass', 'Gurudongmar Lake', 'Yuksom Coronation Throne']
    }
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya',
    type: 'State',
    zone: 'North-East',
    capital: 'Shillong',
    tagline: 'Abode of Clouds, Living Root Bridges & Matrilineal Lore',
    description: 'Centuries-old living tree root bridges grown across raging gorges, sacred groves of Mawphlang, and rock music capital vibes.',
    colorHex: '#D97706',
    coords3D: [2.3, 0.3, 0.0],
    coords2D: { x: 84, y: 44 },
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=900&auto=format&fit=crop&q=80',
    activeQuestsCount: 1,
    culturalHighlights: {
      giCrafts: ['Khasi Handwoven Shawls', 'Cane & Bamboo Baskets', 'Black Clay Pottery of Larnai', 'Lakadong High-Curcumin Turmeric'],
      iconicDelicacies: ['Jadoh Rice with Spices', 'Dohneiiong Pork in Black Sesame', 'Tungrymbai Fermented Soya', 'Pukhlein Sweet Bread'],
      folkTraditions: ['Nongkrem Dance', 'Wangala 100 Drums Festival', 'Shad Suk Mynsiem', 'Khasi Archery (Teer)'],
      heritageSites: ['Nongriat Double Decker Root Bridge', 'Dawki Crystal Umngot River', 'Mawsmai Caves', 'Mawphlang Sacred Forest']
    }
  }
];

export const STATE_SPECIFIC_QUESTS: Quest[] = [
  // --- RAJASTHAN QUESTS ---
  {
    id: 'quest-rajasthan-pottery',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    title: 'Clay, Wheel & Soul: Jaipur Blue Pottery & Miniature Art',
    tagline: 'Meet 4th-generation potters & shape your own earthen lamp',
    description: 'Bypass the overcrowded tourist malls and journey into the vibrant lanes of Sanganer and Kumhar Colony. Experience living quartz clay heritage, witness master block printers, and support local women cooperatives.',
    category: 'artisan',
    difficulty: 'Easy',
    estimatedTime: '45 mins',
    totalXp: 380,
    totalCoins: 140,
    heroImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    coords3D: [-2.1, 0.4, 0.6],
    isCrowdBalancingBoosted: true,
    crowdMultiplier: 2.2,
    crowdReason: '⚡ 2.2X CROWD BOOSTER: Amber Fort is at 92% capacity. Explore this quiet artisan alley for double rewards!',
    highlightArtisan: 'Master Potter Babulal & Soniya Devi',
    badgeReward: {
      id: 'badge-clay-master',
      name: 'Earth Sculptor',
      icon: 'Palette',
      color: '#7A1026',
      description: 'Mastered the ancient quartz clay pottery & supported 3 local artisan families.'
    },
    stops: [
      {
        id: 'stop-raj-1',
        name: 'The 100-Year Wheel: Babulal Workshop',
        category: 'artisan',
        description: 'Watch Master Babulal spin raw clay and ground quartz into exquisite vessels in under 3 minutes.',
        historicalFact: 'Unlike ordinary clay, Jaipur Blue Pottery uses quartz stone powder, Fuller’s earth, and natural gum with zero clay.',
        artisanName: 'Babulal Prajapati (45 yrs experience)',
        location: 'Lane 4, Sanganer Heritage Colony, Jaipur',
        lat: 26.9124,
        lng: 75.7873,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Master Babulal',
          quote: '"The quartz mixture breathes when fired in wood kilns. Natural cobalt oxide gives that royal turquoise sheen."',
          actionPrompt: 'Ask Babulal what natural oxide produces the famous royal blue hue.'
        },
        rewardXp: 110,
        rewardCoins: 40,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-raj-2',
        name: 'Bagru Natural Turmeric Block Print Guild',
        category: 'craft',
        description: 'Discover how hand-carved rosewood blocks are pressed with natural turmeric and madder root dyes.',
        historicalFact: 'Traditional block printing techniques date back over 800 years and use 100% biodegradable plant pigments.',
        artisanName: 'Meera & The Shilpkar Women Cooperative',
        location: 'Bagru Loom Courtyard, Jaipur',
        lat: 26.8124,
        lng: 75.5473,
        challengeType: 'trivia',
        trivia: {
          question: 'What natural ingredient is historically boiled to produce the deep golden "Haldi" yellow dye?',
          options: ['Raw Saffron & Turmeric root', 'Crushed pomegranate peel', 'Indigo leaf extract', 'Marigold blossoms'],
          correctIndex: 0,
          explanation: 'Raw turmeric root and saffron threads were traditionally boiled in copper cauldrons to create durable golden hues.'
        },
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-raj-3',
        name: 'Chand Baori Subterranean Hydro-Geometry',
        category: 'landmark',
        description: 'Descend into the cool subterranean breezes of a 1,200-year-old stepwell with 3,500 symmetrical steps.',
        historicalFact: 'The subterranean architecture created a natural microclimate that remained 10°F cooler than surface temperatures.',
        location: 'Abhaneri Precinct, Dausa',
        lat: 27.0069,
        lng: 76.6062,
        challengeType: 'checkin',
        rewardXp: 140,
        rewardCoins: 55,
        image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'quest-rajasthan-kathputli',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    title: 'Lanterns & Lore: Twilight Kathputli & Desert Ravanahatha',
    tagline: 'Follow torch-lit havelis, play the coconut-shell violin & hear desert epics',
    description: 'As twilight blankets the golden sandstone fortresses, wander into the historic puppet settlement. Learn string manipulations from 7th-gen puppeteers and listen to bowed ballads.',
    category: 'night',
    difficulty: 'Easy',
    estimatedTime: '40 mins',
    totalXp: 320,
    totalCoins: 110,
    heroImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    coords3D: [-2.3, 0.2, 0.4],
    highlightArtisan: 'Master Puppeteer Ramdas Bhat & Troupe',
    badgeReward: {
      id: 'badge-puppet-bard',
      name: 'Puppet Troubadour',
      icon: 'Moon',
      color: '#450915',
      description: 'Preserved the endangered wooden string puppetry songs of the Thar Desert.'
    },
    stops: [
      {
        id: 'stop-raj-k1',
        name: 'The Bhat Colony String Master Haveli',
        category: 'artisan',
        description: 'Watch Master Ramdas carve mango wood faces and dress puppets in antique brocade fabric.',
        historicalFact: 'Kathputli puppetry originated over 1,000 years ago as a nomadic balladeer medium praising legendary Rajasthani kings.',
        artisanName: 'Ramdas Bhat',
        location: 'Kathputli Nagar, Old Bastion',
        lat: 26.9200,
        lng: 75.8200,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Ramdas Bhat',
          quote: '"A puppet has no voice of its own until the bamboo whistle (boli) whistles in the performer’s mouth."',
          actionPrompt: 'Ask Ramdas how the high-pitched whistle voice is created during the show.'
        },
        rewardXp: 100,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-raj-k2',
        name: 'The Coconut Shell Ravanahatha Luthier',
        category: 'craft',
        description: 'Try your hand at playing the bowed goat-skin instrument believed to be the ancestral ancestor of the violin.',
        historicalFact: 'According to Hindu folklore, King Ravana created the Ravanahatha using his own arm as the bow and hair as strings.',
        location: 'Heritage Folk Arcade #9',
        lat: 26.9215,
        lng: 75.8220,
        challengeType: 'trivia',
        trivia: {
          question: 'What natural material forms the primary resonating bowl of a traditional Ravanahatha instrument?',
          options: ['Dried Coconut Shell & Goat hide', 'Carved Teak block', 'Hollow Pumpkin gourd', 'Clay resonator'],
          correctIndex: 0,
          explanation: 'A split half-coconut shell covered with goat hide skin provides the rustic, haunting resonance of the Thar desert.'
        },
        rewardXp: 110,
        rewardCoins: 40,
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-raj-k3',
        name: 'Charcoal Ker Sangri & Bajra Roti Hearth',
        category: 'food',
        description: 'Taste wild desert desert-bean Ker Sangri cooked with dry mango powder and hot ghee-soaked pearl millet flatbreads.',
        historicalFact: 'Ker berries and Sangri pods grow on hardy Khejri trees that survive intense 48°C desert droughts without irrigation.',
        location: 'Sandstone Courtyard Kitchen',
        lat: 26.9230,
        lng: 75.8240,
        challengeType: 'checkin',
        rewardXp: 110,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- MAHARASHTRA QUESTS ---
  {
    id: 'quest-maharashtra-coppersmith',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    title: 'The Beaten Beat: Pune Tambat Copper Smiths & Warli Art',
    tagline: 'Experience 3,000 rhythmic hammer strikes and sacred tribal rice-paste paintings',
    description: 'Trek into the narrow lanes of Tambat Ali where coppersmiths have hammered brass and copper for Maratha royalty since the 17th century, then paint your own Warli geometry.',
    category: 'artisan',
    difficulty: 'Moderate',
    estimatedTime: '50 mins',
    totalXp: 400,
    totalCoins: 150,
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    coords3D: [-1.4, -0.6, 0.4],
    isCrowdBalancingBoosted: true,
    crowdMultiplier: 2.0,
    crowdReason: '🔥 REROUTE BONUS: Shaniwar Wada queue is congested. Take this coppersmith heritage walk for +200 bonus XP!',
    highlightArtisan: 'Master Coppersmith Kishor Tambat & Warli Elder Jivya',
    badgeReward: {
      id: 'badge-copper-smith',
      name: 'Tambat Master',
      icon: 'Shield',
      color: '#9C1A35',
      description: 'Learned the 17th-century hand-hammered copper craft of the Maratha Empire.'
    },
    stops: [
      {
        id: 'stop-mah-1',
        name: 'The 3,000 Hammer Strikes: Tambat Khadki',
        category: 'artisan',
        description: 'Listen to the rhythmic ring of the "Matharkaam" indentation technique that strengthens copper utensils.',
        historicalFact: 'Tambat coppersmiths were originally brought to Pune by the Peshwas in the 1700s to cast weapons, coins, and royal water vessels.',
        artisanName: 'Kishor Tambat (38 yrs trade)',
        location: 'Tambat Ali, Kasba Peth, Pune',
        lat: 18.5204,
        lng: 73.8567,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Kishor Tambat',
          quote: '"Every dimple you see on this copper water dispenser is struck by eye and wrist memory without measuring tape."',
          actionPrompt: 'Ask Kishor why water stored in hand-hammered copper vessels retains natural antimicrobial properties.'
        },
        rewardXp: 130,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-mah-2',
        name: 'Warli Bamboo & Rice Paste Mural Studio',
        category: 'craft',
        description: 'Paint the sacred circle, triangle, and square representing Sun, Mountain, and Mother Earth using chewed bamboo twigs.',
        historicalFact: 'Warli tribal painting dates back to 2500 BCE and uses only ground rice paste with water and gum on cow-dung treated walls.',
        artisanName: 'Sarita & Sahyadri Tribal Women Guild',
        location: 'Heritage Loom Courtyard, Pune',
        lat: 18.5230,
        lng: 73.8590,
        challengeType: 'trivia',
        trivia: {
          question: 'In traditional Warli tribal art, what do the circle and triangle geometric shapes symbolize?',
          options: ['Sun / Moon and Mountains / Trees', 'King and Queen', 'Chariot and Spear', 'Rain and River'],
          correctIndex: 0,
          explanation: 'The circle represents celestial bodies (Sun/Moon), while the triangle represents mountains and conical trees.'
        },
        rewardXp: 130,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-mah-3',
        name: 'Spiced Kolhapuri Misal & Pav Cauldron',
        category: 'food',
        description: 'Taste fiery sprouted moth bean curry topped with crunchy farsan, chopped onions, and fresh lime with soft bakery pav.',
        historicalFact: 'The spicy red "Kat" or "Rassa" gravy gets its vibrant color from roasted Byadgi chilies and 16 stone-ground spices.',
        location: 'Katta Lane Corner, Kasba Peth',
        lat: 18.5245,
        lng: 73.8610,
        challengeType: 'checkin',
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- KERALA QUESTS ---
  {
    id: 'quest-kerala-spices-backwaters',
    stateId: 'kerala',
    stateName: 'Kerala',
    title: 'Emerald Waters & Secret Spice Orchards of Kumarakom',
    tagline: 'Row traditional cedar canoes, smell green cardamom & witness Kathakali makeup',
    description: 'Leave the crowded speedboat docks behind and glide into hidden backwater canals. Discover organic black pepper vines, smell crushed nutmeg, and witness the 4-hour face painting ritual of Kathakali actors.',
    category: 'nature',
    difficulty: 'Easy',
    estimatedTime: '55 mins',
    totalXp: 410,
    totalCoins: 145,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
    coords3D: [-0.9, -2.2, 0.1],
    highlightArtisan: 'Kathakali Chutti Master Raman & Spice Farmer Joy',
    badgeReward: {
      id: 'badge-kerala-lotus',
      name: 'Backwater Alchemist',
      icon: 'Leaf',
      color: '#E65100',
      description: 'Navigated the living mangrove waterways and documented ancient Malabar spice farming.'
    },
    stops: [
      {
        id: 'stop-ker-1',
        name: 'The King of Spices: Black Gold Canopy',
        category: 'landmark',
        description: 'Smell fresh green pepper berries and crack open yellow nutmeg fruit with its crimson mace web.',
        historicalFact: 'Malabar black pepper was known as "Black Gold" in Rome and was once used to pay ransom during the fall of Rome.',
        artisanName: 'Farmer Joy & Family',
        location: 'Kuttanad Spice Agro-Guild',
        lat: 9.5916,
        lng: 76.5222,
        challengeType: 'trivia',
        trivia: {
          question: 'What is the delicate, vibrant red lace surrounding a nutmeg seed known as?',
          options: ['Mace (Javitri)', 'Cardamom sheath', 'Cinnamon bark', 'Star Anise petal'],
          correctIndex: 0,
          explanation: 'Mace (known locally as Jathipathri) is the crimson aril web that encases the inner nutmeg seed.'
        },
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-ker-2',
        name: 'The 4-Hour Kathakali "Chutti" Facial Makeup',
        category: 'artisan',
        description: 'Watch Master Raman apply natural ground limestone, rice flour paste, and vermillion pigments to depict the heroic Paccha character.',
        historicalFact: 'Kathakali facial makeup colors denote moral character: Green (Paccha) for nobility/gods, Red (Katti) for ambition, and Black (Kari) for wickedness.',
        artisanName: 'Kalamandalam Raman',
        location: 'Heritage Natana Kalari Hall',
        lat: 9.5930,
        lng: 76.5250,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Guru Raman',
          quote: '"The actor lies motionless on the reed mat for three hours while we build the rice-paste ridges along their jawline."',
          actionPrompt: 'Ask Guru Raman which natural berry seed is placed in the eye to create the dramatic divine crimson hue.'
        },
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-ker-3',
        name: 'Clay Hearth Steamed Appam & Stew Cauldron',
        category: 'food',
        description: 'Taste bowl-shaped fermented rice pancakes with crisp lacy edges and soft centers dipped in coconut milk vegetable stew.',
        historicalFact: 'Appam batter was historically fermented overnight with fresh sweet palm toddy to achieve its airy spongy center.',
        location: 'Canal-side Amma Kitchen',
        lat: 9.5950,
        lng: 76.5280,
        challengeType: 'checkin',
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- DELHI QUESTS ---
  {
    id: 'quest-delhi-oldtown-spices',
    stateId: 'delhi',
    stateName: 'Delhi',
    title: 'The Mughal Alchemist: Khari Baoli Spices & Secret Ittar Perfumes',
    tagline: 'Explore Asia’s largest 500-year spice market & smell pure Mitti Attar',
    description: 'Wander through fragrant spice alleys dating to Shah Jahan’s era, taste slow-brewed saffron kahwa, and discover secret petrichor perfume distilled in copper cauldrons.',
    category: 'food',
    difficulty: 'Easy',
    estimatedTime: '35 mins',
    totalXp: 300,
    totalCoins: 110,
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    coords3D: [-0.8, 1.0, 0.4],
    isCrowdBalancingBoosted: true,
    crowdMultiplier: 2.5,
    crowdReason: '⚡ 2.5X MEGA BONUS: Red Fort ticket queue exceeds 70 mins. Divert into this aromatic spice trail for massive XP!',
    highlightArtisan: '3rd Gen Masala Blender Haji Nizam & Gulab Singh Johrimal',
    badgeReward: {
      id: 'badge-spice-master',
      name: 'Spice Alchemist',
      icon: 'Sparkles',
      color: '#F59E0B',
      description: 'Discovered the centuries-old hidden spice blends of Khari Baoli and Mitti Attar.'
    },
    stops: [
      {
        id: 'stop-del-1',
        name: 'The 7-Spice Vault: Nizam & Sons (Est. 1924)',
        category: 'food',
        description: 'Sample wild mountain cumin, smoked green cardamom, and stone-ground Kashmiri chilies.',
        historicalFact: 'Khari Baoli stepwell was built in the 1650s beside the Fatehpuri Mosque by Khwaja Khwaja and grew into Asia’s largest spice hub.',
        artisanName: 'Haji Nizamuddin',
        location: 'Khari Baoli Spice Arcade #12, Chandni Chowk',
        lat: 28.6560,
        lng: 77.2240,
        challengeType: 'trivia',
        trivia: {
          question: 'Which spice is harvested by hand from the delicate crimson stigmas of a purple crocus flower?',
          options: ['Nutmeg', 'Saffron (Kesar)', 'Star Anise', 'Mace'],
          correctIndex: 1,
          explanation: 'It takes roughly 75,000 crocus flowers hand-picked at dawn to produce just one pound of pure saffron!'
        },
        rewardXp: 100,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-del-2',
        name: 'The 1816 Petrichor Deg: Gulab Singh Johrimal',
        category: 'artisan',
        description: 'Smell "Mitti Attar" — the intoxicating scent of first monsoon rain on parched baked earth distilled in antique copper pots (deg).',
        historicalFact: 'Mitti Attar captures real baked clay cakes distilled over sandalwood oil base for 15 continuous days.',
        location: 'Dariba Kalan Perfumers Row',
        lat: 28.6575,
        lng: 77.2260,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Perfumery Master Johri',
          quote: '"We capture the smell of Indian summer earth welcoming the monsoon cloud. No synthetic chemical can match it."',
          actionPrompt: 'Ask the master perfumer what base oil absorbs the delicate petrichor vapors.'
        },
        rewardXp: 100,
        rewardCoins: 35,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-del-3',
        name: 'The 80-Year Golden Jalebi & Rabri Hearth',
        category: 'food',
        description: 'Taste spiral golden jalebis fried in desi ghee over charcoal and soaked in wild honey & rose water syrup.',
        historicalFact: 'The spiral dessert journeyed through the Silk Route from Persian "Zulbiya" to Indian Jalebi over 600 years ago.',
        location: 'Dariba Kalan Crossing, Old Delhi',
        lat: 28.6582,
        lng: 77.2270,
        challengeType: 'checkin',
        rewardXp: 100,
        rewardCoins: 40,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- UTTAR PRADESH QUESTS ---
  {
    id: 'quest-up-varanasi-silk',
    stateId: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    title: 'Wefts of Gold: Varanasi Silk Weavers & Ancient Ghat Legends',
    tagline: 'Witness real silver Zari handlooms & hear ancient riverfront chants',
    description: 'Journey into the labyrinthine alleys behind Manikarnika and Dashashwamedh Ghats. Meet 5th-generation master weavers who interlock real gold and silver threads into heirloom Banarasi sarees.',
    category: 'heritage',
    difficulty: 'Moderate',
    estimatedTime: '50 mins',
    totalXp: 390,
    totalCoins: 140,
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    coords3D: [0.1, 0.8, 0.3],
    isCrowdBalancingBoosted: true,
    crowdMultiplier: 2.4,
    crowdReason: '🔥 REROUTE PERK: Dashashwamedh main steps are at peak crowd. Experience quiet weaver lanes for 2.4x rewards!',
    highlightArtisan: 'Master Weaver Ansari & Silk Guild',
    badgeReward: {
      id: 'badge-kashi-weaver',
      name: 'Silk Brocade Seeker',
      icon: 'Award',
      color: '#450915',
      description: 'Mastered the intricate jacquard punch-card weaving of pure Banarasi gold zari.'
    },
    stops: [
      {
        id: 'stop-up-1',
        name: 'The Jacquard Loom: Ansari Silk Cellar',
        category: 'artisan',
        description: 'Watch two weavers coordinate feet pedals and shuttles to weave Persian floral motifs (Kalka) with electro-plated silver wire.',
        historicalFact: 'A single bridal Banarasi silk saree can take between 15 days to 6 months of continuous hand-loom weaving.',
        artisanName: 'Master Weaver Maqbool Ansari',
        location: 'Madanpura Weaver Colony, Varanasi',
        lat: 25.3176,
        lng: 82.9739,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Maqbool Ansari',
          quote: '"Every punch card tells the thread when to rise and when to sleep. It is like poetry in motion."',
          actionPrompt: 'Ask Ansari how many individual punch cards are required for one royal saree border.'
        },
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-up-2',
        name: 'The Clay Cup Banarasi Malai Toast & Paan',
        category: 'food',
        description: 'Taste charcoal-toasted thick bread slathered with clotted milk cream and sprinkled with sugar, followed by sweet Magahi betel leaf.',
        historicalFact: 'Magahi paan leaves are grown in shaded thatched betel vines and are famous for melting tenderly on the tongue.',
        location: 'Gowdowlia Crossing, Varanasi',
        lat: 25.3100,
        lng: 83.0080,
        challengeType: 'trivia',
        trivia: {
          question: 'What is the festive winter dessert of Varanasi whipped into frothy clouds overnight under open moonlit dews?',
          options: ['Malayo (Makhan Malai)', 'Rasmalai', 'Shahi Tukda', 'Phirni'],
          correctIndex: 0,
          explanation: 'Malayo is prepared by boiling raw milk, exposing it to morning winter dew, and churning it into saffron-flavored foam.'
        },
        rewardXp: 130,
        rewardCoins: 45,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-up-3',
        name: 'Chet Singh Fort Ghat Twilight Bastion',
        category: 'landmark',
        description: 'Stand atop the historic fortress overlooking the sweeping crescent of the holy Ganges during twilight bell chimes.',
        historicalFact: 'Chet Singh Fort witnessed a fierce battle between Maharaja Chet Singh and Warren Hastings in 1781.',
        location: 'Chet Singh Ghat, Varanasi',
        lat: 25.2950,
        lng: 83.0030,
        challengeType: 'checkin',
        rewardXp: 130,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- TAMIL NADU QUESTS ---
  {
    id: 'quest-tn-swamimalai-bronze',
    stateId: 'tamil-nadu',
    stateName: 'Tamil Nadu',
    title: 'The Chola Bronze Alchemist: Lost-Wax Casting & Temple Gopurams',
    tagline: 'Experience 1,000-year-old lost-wax bronze casting & Thanjavur art',
    description: 'Journey to the sacred riverbanks of the Cauvery where Sthapathis (sculptors) have cast bronze Nataraja icons using beeswax and river silt since the reign of Raja Raja Chola.',
    category: 'artisan',
    difficulty: 'Moderate',
    estimatedTime: '55 mins',
    totalXp: 420,
    totalCoins: 155,
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    coords3D: [-0.4, -2.1, -0.1],
    highlightArtisan: 'Master Sthapathi Radhakrishna & Temple Sculptors',
    badgeReward: {
      id: 'badge-chola-bronze',
      name: 'Chola Bronze Sculptor',
      icon: 'Trophy',
      color: '#9C1A35',
      description: 'Mastered the sacred Shilpa Shastra proportions of lost-wax bronze icon casting.'
    },
    stops: [
      {
        id: 'stop-tn-1',
        name: 'The Beeswax Model: Swamimalai Foundry',
        category: 'artisan',
        description: 'Watch the sculptor hand-shape pure beeswax mixed with dammar resin into an intricate divine figure.',
        historicalFact: 'In the "Madhuchehishtavidhana" (Lost-Wax) technique, molten bronze alloy replaces melted wax inside a hardened Cauvery clay mold.',
        artisanName: 'Sthapathi Radhakrishna',
        location: 'Swamimalai Artisan Guild, Thanjavur',
        lat: 10.9577,
        lng: 79.3242,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Master Radhakrishna',
          quote: '"Each icon is one-of-a-kind. When we pour the five sacred metals (Panchaloha), the clay mold breaks — it cannot be duplicated."',
          actionPrompt: 'Ask the sculptor what five metals constitute sacred Panchaloha alloy.'
        },
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-tn-2',
        name: 'Thanjavur Gold Leaf & Semi-Precious Gem Studio',
        category: 'craft',
        description: 'See 22-carat pure gold foil being pressed over tamarind paste relief work and adorned with Jaipur stones.',
        historicalFact: 'Thanjavur paintings are crafted on seasoned jackfruit wood planks and remain vibrant for over 200 years without fading.',
        location: 'Palace Road Atelier, Thanjavur',
        lat: 10.7870,
        lng: 79.1378,
        challengeType: 'trivia',
        trivia: {
          question: 'What distinctive feature sets Thanjavur paintings apart from other Indian classical styles?',
          options: ['22K Gold foil embossing & stone inlays', 'Charcoal only sketching', 'Vegetable spray painting', 'Reverse oil on glass only'],
          correctIndex: 0,
          explanation: 'Thanjavur paintings feature high-relief "Gesso" paste work gilded with authentic 22K gold foil and embedded glass gems.'
        },
        rewardXp: 140,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-tn-3',
        name: 'Frothy Brass Filter Coffee (Kaapi) & Murukku',
        category: 'food',
        description: 'Sip dark chicory-blended coffee poured back and forth from stainless tumbler to davarah from arm’s height.',
        historicalFact: 'Filter coffee was popularized in South India during the 19th century using dark-roasted plantation peaberry beans.',
        location: 'Old Bus Stand Coffee House',
        lat: 10.7890,
        lng: 79.1390,
        challengeType: 'checkin',
        rewardXp: 140,
        rewardCoins: 55,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },

  // --- ASSAM & NORTH EAST QUESTS ---
  {
    id: 'quest-assam-muga-majuli',
    stateId: 'assam',
    stateName: 'Assam',
    title: 'Golden Shimmer: Muga Silk Looms & Majuli Mask Theater',
    tagline: 'Discover the silk that outlasts its owner & wear mythological river masks',
    description: 'Venture to Sualkuchi (the Manchester of Assam) and the world’s largest river island Majuli. Witness wild golden silkworms and handmade bamboo-clay theatrical masks.',
    category: 'artisan',
    difficulty: 'Adventurer',
    estimatedTime: '60 mins',
    totalXp: 450,
    totalCoins: 160,
    heroImage: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&auto=format&fit=crop&q=80',
    coords3D: [2.5, 0.7, 0.0],
    highlightArtisan: 'Mask Master Goswami & Sualkuchi Silk Cooperative',
    badgeReward: {
      id: 'badge-muga-golden',
      name: 'Golden Thread Guardian',
      icon: 'Sparkles',
      color: '#F59E0B',
      description: 'Documented the endemic Golden Muga silk and Majuli monastery mask traditions.'
    },
    stops: [
      {
        id: 'stop-as-1',
        name: 'The Endemic Golden Muga Looms: Sualkuchi',
        category: 'artisan',
        description: 'Touch the naturally golden silk fiber harvested from wild caterpillars feeding on aromatic Som and Sualu trees.',
        historicalFact: 'Muga silk is exclusive to Assam and is known as the strongest natural silk in the world — its golden shine increases with every wash.',
        artisanName: 'Pratima & The Silk Weavers Cooperative',
        location: 'Sualkuchi Silk Village, Kamrup',
        lat: 26.1738,
        lng: 91.5724,
        challengeType: 'dialogue',
        artisanDialogue: {
          speaker: 'Pratima Das',
          quote: '"Muga needs no artificial dye. The golden sunshine is born inside the cocoon itself."',
          actionPrompt: 'Ask Pratima how many years a single Muga Mekhela Chador can be worn before fading.'
        },
        rewardXp: 150,
        rewardCoins: 50,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-as-2',
        name: 'The Bamboo & Cow-Dung Mask Monastery: Majuli',
        category: 'craft',
        description: 'Watch monastery artists weave split bamboo frames, cover them with clay-soaked cloth, and paint expressive faces of demons and gods.',
        historicalFact: 'Majuli mask-making (Mukha) was established by the saint-reformer Srimanta Sankardeva in the 16th century for traditional Bhaona dance drama.',
        location: 'Samaguri Satra, Majuli Island',
        lat: 26.9530,
        lng: 94.2180,
        challengeType: 'trivia',
        trivia: {
          question: 'What natural material forms the flexible structural ribbing of a Majuli island theatrical mask?',
          options: ['Split Bamboo cane & Cloth', 'Carved Rosewood', 'Sheet Metal', 'Dried Palm Fronds'],
          correctIndex: 0,
          explanation: 'Split local bamboo (Bhaluka) provides the lightweight, flexible skeleton for wearable monastery masks.'
        },
        rewardXp: 150,
        rewardCoins: 55,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'stop-as-3',
        name: 'Smoked Bamboo Hollow Fish & Steamed Pitha',
        category: 'food',
        description: 'Taste fresh river carp smoked inside green bamboo cylinders with wild coriander and sweet rice flour pitha rolls.',
        historicalFact: 'Cooking inside raw green bamboo infuses the meal with natural sweet bamboo water without needing any cooking oil.',
        location: 'Brahmaputra Bank Hearth',
        lat: 26.9560,
        lng: 94.2210,
        challengeType: 'checkin',
        rewardXp: 150,
        rewardCoins: 55,
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export function getStateById(id: string): IndiaState | undefined {
  return ALL_INDIA_STATES.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export function getQuestsForState(stateId: string): Quest[] {
  const stateQuests = STATE_SPECIFIC_QUESTS.filter((q) => q.stateId.toLowerCase() === stateId.toLowerCase());
  if (stateQuests.length > 0) return stateQuests;

  // Fallback generic quests tailored to state
  const state = getStateById(stateId);
  if (!state) return [];

  return [
    {
      id: `quest-${state.id}-heritage-trail`,
      stateId: state.id,
      stateName: state.name,
      title: `${state.name} Living Heritage & Craft Trail`,
      tagline: `Discover the GI-tagged ${state.culturalHighlights.giCrafts[0] || 'handicrafts'} and regional secrets`,
      description: `Embark on an immersive cultural discovery across ${state.name}. Experience traditional art forms, taste ${state.culturalHighlights.iconicDelicacies[0] || 'local cuisine'}, and support verified regional master artisans.`,
      category: 'heritage',
      difficulty: 'Easy',
      estimatedTime: '40 mins',
      totalXp: 350,
      totalCoins: 125,
      heroImage: state.heroImage,
      coords3D: state.coords3D,
      isCrowdBalancingBoosted: true,
      crowdMultiplier: 2.0,
      crowdReason: `⚡ 2.0X CROWD BALANCER: Disperse from crowded central sites to quiet artisan hubs in ${state.name}!`,
      highlightArtisan: `${state.name} Master Guild Artisans`,
      badgeReward: {
        id: `badge-${state.id}-guardian`,
        name: `${state.name} Cultural Explorer`,
        icon: 'Award',
        color: state.colorHex,
        description: `Unlocked cultural milestones and supported local artisan communities in ${state.name}.`
      },
      stops: [
        {
          id: `stop-${state.id}-1`,
          name: `${state.culturalHighlights.giCrafts[0] || 'Handloom'} Master Workshop`,
          category: 'artisan',
          description: `Witness local artisans handcrafting ${state.culturalHighlights.giCrafts[0] || 'traditional goods'} using generational knowledge.`,
          historicalFact: `${state.name} has preserved unique folk crafts for centuries through close-knit family guilds.`,
          artisanName: `${state.name} Master Craftsman`,
          location: `${state.capital} Heritage District`,
          lat: 20.0,
          lng: 78.0,
          challengeType: 'dialogue',
          artisanDialogue: {
            speaker: 'Master Artisan',
            quote: `"Our ancestors passed this craft through hands and heart, keeping our cultural identity alive."`,
            actionPrompt: `Ask the craftsman how many generations their family has practiced this craft.`
          },
          rewardXp: 120,
          rewardCoins: 40,
          image: state.heroImage
        },
        {
          id: `stop-${state.id}-2`,
          name: `Authentic ${state.culturalHighlights.iconicDelicacies[0] || 'Regional Cuisine'} Tasting`,
          category: 'food',
          description: `Taste the authentic regional flavors of ${state.culturalHighlights.iconicDelicacies[0] || 'specialty delicacies'} cooked using traditional wood-fire techniques.`,
          historicalFact: `Traditional culinary methods in ${state.name} prioritize seasonal produce and wild herbs.`,
          location: `Old Bazaar, ${state.capital}`,
          lat: 20.01,
          lng: 78.01,
          challengeType: 'trivia',
          trivia: {
            question: `Which of these is a world-renowned cultural heritage feature of ${state.name}?`,
            options: [
              state.culturalHighlights.folkTraditions[0] || 'Folk Art',
              'Plastic Factory',
              'Synthetic Carpet Mill',
              'Imported Glass Warehouse'
            ],
            correctIndex: 0,
            explanation: `${state.culturalHighlights.folkTraditions[0] || 'The local folk art'} represents centuries of regional cultural expression!`
          },
          rewardXp: 110,
          rewardCoins: 40,
          image: state.heroImage
        },
        {
          id: `stop-${state.id}-3`,
          name: `${state.culturalHighlights.heritageSites[0] || 'Historic Monument'} Sunset Check-in`,
          category: 'landmark',
          description: `End your trail with breathtaking architecture and views at ${state.culturalHighlights.heritageSites[0] || 'the iconic heritage site'}.`,
          historicalFact: `This site stands as a testament to the architectural prowess of historical dynasties in ${state.name}.`,
          location: `${state.capital} Historic Enclave`,
          lat: 20.02,
          lng: 78.02,
          challengeType: 'checkin',
          rewardXp: 120,
          rewardCoins: 45,
          image: state.heroImage
        }
      ]
    }
  ];
}
