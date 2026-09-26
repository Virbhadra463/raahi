export type QuestCategory = 'all' | 'artisan' | 'food' | 'heritage' | 'nature' | 'night';

export type Difficulty = 'Easy' | 'Moderate' | 'Adventurer';

export type IndiaZone = 'North' | 'South' | 'West' | 'East' | 'Central' | 'North-East' | 'Islands' | 'UT';

export interface IndiaState {
  id: string;
  name: string;
  type: 'State' | 'Union Territory';
  zone: IndiaZone;
  capital: string;
  tagline: string;
  description: string;
  colorHex: string;
  coords3D: [number, number, number]; // [x, y, z] on 3D India model
  coords2D: { x: number; y: number }; // Percentage [0..100] for 2D fallback map
  heroImage: string;
  activeQuestsCount: number;
  culturalHighlights: {
    giCrafts: string[];
    iconicDelicacies: string[];
    folkTraditions: string[];
    heritageSites: string[];
  };
  crowdAlert?: {
    hasAlert: boolean;
    location: string;
    multiplier: number;
  };
}

export interface QuestStop {
  id: string;
  name: string;
  category: 'artisan' | 'food' | 'landmark' | 'craft' | 'scenic';
  description: string;
  historicalFact: string;
  artisanName?: string;
  artisanStory?: string;
  location: string;
  lat: number;
  lng: number;
  challengeType: 'trivia' | 'photo' | 'dialogue' | 'checkin';
  trivia?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  artisanDialogue?: {
    speaker: string;
    quote: string;
    actionPrompt: string;
  };
  rewardXp: number;
  rewardCoins: number;
  image: string;
}

export interface Quest {
  id: string;
  stateId: string;
  stateName: string;
  title: string;
  tagline: string;
  description: string;
  category: QuestCategory;
  difficulty: Difficulty;
  estimatedTime: string;
  totalXp: number;
  totalCoins: number;
  heroImage: string;
  badgeReward: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
  };
  stops: QuestStop[];
  isCrowdBalancingBoosted?: boolean;
  crowdMultiplier?: number; // e.g., 2.0x for off-peak artisan redirection
  crowdReason?: string;
  highlightArtisan?: string;
  coords3D: [number, number, number]; // [x, y, z] for 3D map
}

export interface CrowdHotspot {
  id: string;
  name: string;
  currentCongestionPercent: number; // 0-100
  status: 'Critical Overcrowding' | 'Busy' | 'Moderate' | 'Serene & Recommended';
  waitTimeMinutes: number;
  redirectedQuestId: string;
  redirectedQuestName: string;
  bonusMultiplier: number;
  artisanHighlight: string;
}

export interface ArtisanVendor {
  id: string;
  name: string;
  craft: string;
  shopName: string;
  bio: string;
  yearsOfTradition: number;
  location: string;
  image: string;
  voucherDiscount: string;
  tokenCost: number;
  verifiedLocal: boolean;
  specialtyProduct: string;
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  unlockedAt?: string;
  is3dUnlocked?: boolean;
  category: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  title: string;
  coins: number;
  streakDays: number;
  completedQuestIds: string[];
  unlockedBadges: UserBadge[];
  redeemedVouchers: {
    id: string;
    artisanName: string;
    discount: string;
    code: string;
    date: string;
  }[];
  localImpactDollars: number;
  stepsWalked: number;
}
