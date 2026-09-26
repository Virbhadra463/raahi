export const DESTINATIONS = [
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', subtitle: 'Walled City & Haveli Lanes' },
  { id: 'delhi', name: 'Old Delhi', state: 'Delhi NCR', subtitle: 'Spice Bazaars & Mughal Alleys' },
  { id: 'amritsar', name: 'Amritsar', state: 'Punjab', subtitle: 'Golden Sanctuaries & Dhabas' },
  { id: 'kochi', name: 'Kochi & Backwaters', state: 'Kerala', subtitle: 'Spiceways & Portuguese Quarters' }
];

export const DURATIONS = [
  { id: 'half', label: 'Half Day (3 hrs)' },
  { id: 'full', label: 'Full Day (7 hrs)' },
  { id: 'weekend', label: '2-Day Trail' }
];

export const PARTIES = [
  { id: 'solo', label: 'Solo Wayfarer' },
  { id: 'duo', label: 'Couple / Duo' },
  { id: 'friends', label: 'Gang of Friends' },
  { id: 'family', label: 'Family' }
];

export const VIBES = [
  { id: 'culture', label: 'Culture & History', icon: 'Landmark' },
  { id: 'foodie', label: 'Foodie', icon: 'Utensils' },
  { id: 'photo', label: 'Photography', icon: 'Camera' },
  { id: 'chill', label: 'Fun & Chill', icon: 'Coffee' },
  { id: 'nature', label: 'Nature', icon: 'Compass' },
  { id: 'adventure', label: 'Adventure', icon: 'Footprints' },
  { id: 'learn', label: 'Learn & Explore', icon: 'BookOpen' },
  { id: 'budget', label: 'Budget Explorer', icon: 'Coins' }
];

export const POLAROIDS = [
  {
    id: 'p1',
    src: '/assets/polaroids/1.jpg',
    caption: 'Hyderabad: Irani Chai & Charminar at 6:30 AM',
    note: 'The city awakens with fresh Osmania biscuits and cardamom steam',
    rotation: -4,
    tag: 'Culture · Morning'
  },
  {
    id: 'p2',
    src: '/assets/polaroids/2.jpg',
    caption: 'Kerala: Canoe through spice canals & toddy huts',
    note: 'Under coconut palms where kingfishers hunt silent waters',
    rotation: 3,
    tag: 'Nature · Spices'
  },
  {
    id: 'p3',
    src: '/assets/polaroids/3.jpg',
    caption: 'Punjab: Langar seva & sarson field winds',
    note: 'Rolling rotis with sevadars — unconditional love on a plate',
    rotation: -5,
    tag: 'Heritage · Community'
  },
  {
    id: 'p4',
    src: '/assets/polaroids/4.jpg',
    caption: 'Uttarakhand: Evening Ganga Aarti bells ringing',
    note: 'River reflection turns molten gold as temple conches blow',
    rotation: 4,
    tag: 'Rituals · Sacred'
  },
  {
    id: 'p5',
    src: '/assets/polaroids/1.jpg',
    caption: 'Chowk Bazaar: 3rd-generation brass carver at work',
    note: 'Hand-hammering floral motifs in the quiet shadow of the arches',
    rotation: -2,
    tag: 'Artisans · Craft'
  },
  {
    id: 'p6',
    src: '/assets/polaroids/2.jpg',
    caption: 'Alleppey: Clay-pot fish curry by grandmother Mary',
    note: 'Secret roasted coconut masala that takes 4 hours to grind',
    rotation: 5,
    tag: 'Foodie · Secret'
  }
];

export const SAMPLE_QUESTS = [
  {
    id: 'quest-1',
    title: 'Hawa Mahal Breezeway & The Whispering Jharokhas',
    subtitle: 'Iconic Landmark',
    narrativeClue: 'Look for the honeycomb facade. Climb to the top balcony where royal women listened to the bazaar without being seen. Count the wind vents.',
    baseReward: 120,
    crowdedReward: 50,
    location: 'Badi Chaupar, Walled City',
    cityId: 'jaipur',
    vibes: ['culture', 'photo'],
    timeEstimate: '45 mins',
    difficulty: 'Easy',
    isLandmark: true,
    verificationMethod: 'GPS Check-in or Ticket Scan',
    actionPrompt: 'Verify proximity to the north courtyard to complete this quest'
  },
  {
    id: 'quest-2',
    title: "Panditji's 90-Year Saffron Kulhad & Silver Leaf Haveli",
    subtitle: 'Artisan Hidden Gem (3 min walk from Hawa Mahal)',
    narrativeClue: 'Slip away from the crowd into Ghee Walon Ka Rasta. Follow the smell of crushed cardamom to a tiny blue arch where 4 generations have simmered milk over charcoal.',
    baseReward: 140,
    surgeReward: 280,
    bonusPerk: 'Free Artisan Mawa Samosa + 2x Credits',
    location: 'Ghee Walon Ka Rasta, Jaipur (180m away)',
    cityId: 'jaipur',
    vibes: ['foodie', 'culture', 'budget'],
    timeEstimate: '20 mins',
    difficulty: 'Hidden Alley',
    isDynamicAlternative: true,
    verificationMethod: 'Merchant QR Scan or Photo Note',
    actionPrompt: 'Taste the clay-cup tea and snap the master recipe plaque'
  },
  {
    id: 'quest-3',
    title: 'The Indigo Dyer of Gopalji Byway',
    subtitle: 'Living Heritage Workshop',
    narrativeClue: 'Find the wooden door adorned with two carved peacocks. Ask Master Weaver Ramdas to show you the 120-year-old wooden block print stamps.',
    baseReward: 175,
    location: 'Gopalji Ka Rasta, Jaipur',
    cityId: 'jaipur',
    vibes: ['culture', 'learn', 'photo'],
    timeEstimate: '35 mins',
    difficulty: 'Medium',
    verificationMethod: 'Artisan Stamp / Photo Upload',
    actionPrompt: 'Photograph a finished hand-block pattern on handloom khadi'
  },
  {
    id: 'quest-4',
    title: 'Khari Baoli Spice Rooftop & Secret Minaret Vista',
    subtitle: 'Panoramic Sensory Quest',
    narrativeClue: 'Ascend the twisting stone stairs behind shop #42 before midday. Inhale roasted cloves and black pepper while looking out over Mughal dome rooftops.',
    baseReward: 160,
    location: 'Khari Baoli, Old Delhi',
    cityId: 'delhi',
    vibes: ['photo', 'adventure', 'culture'],
    timeEstimate: '30 mins',
    difficulty: 'Moderate Climb',
    verificationMethod: 'Skyline Photo Check-in',
    actionPrompt: 'Capture the panoramic view from the spice merchants terrace'
  },
  {
    id: 'quest-5',
    title: 'Golden Sanctuary Langar & The 10,000 Roti Hearth',
    subtitle: 'Selfless Community Service',
    narrativeClue: 'Enter through the western gate with head covered. Join the rolling station with the sevadars and knead blessing dough for 15 minutes.',
    baseReward: 200,
    location: 'Golden Temple Complex, Amritsar',
    cityId: 'amritsar',
    vibes: ['culture', 'chill', 'learn'],
    timeEstimate: '40 mins',
    difficulty: 'Easy',
    verificationMethod: 'Seva Badge Check',
    actionPrompt: 'Participate in the community langar preparation'
  },
  {
    id: 'quest-6',
    title: 'Captain Thomas’s Backwater Clay-Pot Feast',
    subtitle: 'Canalside Culinary Secret',
    narrativeClue: 'Steer the wooden rowboat past the emerald church bend. Look for the banana leaf sign where toddy fish curry simmers over fragrant coconut husks.',
    baseReward: 190,
    location: 'Kuttanad Waterways, Alleppey',
    cityId: 'kochi',
    vibes: ['foodie', 'nature', 'adventure'],
    timeEstimate: '50 mins',
    difficulty: 'Boat Route',
    verificationMethod: 'Merchant Code Entry',
    actionPrompt: 'Enter the 4-digit guestbook code from Captain Thomas'
  }
];

export const STAKEHOLDERS = [
  {
    id: 'tourist',
    role: 'Tourist ("Raahi")',
    title: 'The Explorer',
    benefit: 'A personalised, surprising, low-effort trip that feels like an unfolding story, not a spreadsheet.',
    icon: 'Compass',
    tag: 'Story-Driven Freedom'
  },
  {
    id: 'business',
    role: 'Local Businesses',
    title: 'Dhabas & Artisans',
    benefit: 'Real footfall, instant digital visibility, and measurable revenue from travellers walking right past.',
    icon: 'Store',
    tag: '100% Direct Spend'
  },
  {
    id: 'hotels',
    role: 'Hotels & Homestays',
    title: 'Hospitality Hubs',
    benefit: 'Higher guest engagement, longer multi-day stays, and an authentic bridge into local street culture.',
    icon: 'Building2',
    tag: 'Experience Hubs'
  },
  {
    id: 'transport',
    role: 'Local Transport',
    title: 'Drivers & Autos',
    benefit: 'Predictable, forecastable demand routed to off-peak hubs instead of waiting on blind luck.',
    icon: 'Car',
    tag: 'Smarter Dispatch'
  },
  {
    id: 'tourism',
    role: 'Tourism Boards',
    title: 'City Custodians',
    benefit: 'Real-time crowd redistribution and destination intelligence to end congestion bottlenecks forever.',
    icon: 'Landmark',
    tag: 'Balanced Footfall'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Accept a Quest',
    subtitle: 'Pick Your Story',
    desc: 'Choose from story-driven quests curated around your chosen vibes, time, and walking radius.',
    example: '"Find the 100-year-old haveli hidden behind the spice market"',
    icon: 'Sparkles'
  },
  {
    step: '02',
    title: 'Follow Narrative Clues',
    subtitle: 'Street-Level Navigation',
    desc: 'Turn-by-turn storytelling navigation ("look for the blue wooden door past the brass samovar") instead of cold GPS pins.',
    example: '"Follow the aroma of roasting cinnamon into the second lane"',
    icon: 'Map'
  },
  {
    step: '03',
    title: 'Do the Real Thing',
    subtitle: 'Authentic Human Connection',
    desc: 'Taste the secret recipe, watch the artisan carve marble, participate in rituals, or discover hidden architecture.',
    example: 'Meet the 4th-generation weaver and hear the heritage backstory',
    icon: 'HeartHandshake'
  },
  {
    step: '04',
    title: 'Earn & Unlock Next',
    subtitle: 'Continuous Discovery Loop',
    desc: 'Scan QR or verify arrival to instantly receive Raahi Credits, redeemable discounts, and the next chapter reveals itself.',
    example: 'Earn 140 Credits + unlock the sunset rooftop quest nearby',
    icon: 'Award'
  }
];
