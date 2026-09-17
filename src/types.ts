export type TrailDifficulty = 'easy' | 'moderate' | 'hard';

export type TrailCategory = 'forest' | 'valley' | 'coast' | 'ridge' | 'heritage' | 'healing';

export type Region = 'all' | 'seoul' | 'gyeonggi' | 'gangwon' | 'chungcheong' | 'jeolla' | 'gyeongsang' | 'jeju';

export interface Waypoint {
  name: string;
  description: string;
  lat: number;
  lng: number;
  altitude: number;
  isKeyStop?: boolean;
}

export interface Review {
  id: string;
  trailId: string;
  author: string;
  rating: number; // 1 to 5
  content: string;
  visitDate: string;
  tags: string[];
  likes: number;
  createdAt: string;
  isUserCreated?: boolean;
}

export type LandscapeType = 'mountain' | 'river' | 'forest' | 'coast' | 'valley' | 'heritage';

export interface CustomPreference {
  difficulty: 'all' | TrailDifficulty;
  distanceRange: 'all' | 'under5' | '5to10' | '10to15' | 'over15';
  landscapes: LandscapeType[];
}

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
}

export interface Trail {
  id: string;
  name: string;
  subtitle: string;
  mountainOrArea: string;
  region: Region;
  regions?: Region[];
  regionName: string;
  difficulty: TrailDifficulty;
  distanceKm: number;
  durationMinutes: number;
  elevationGainM: number;
  maxElevationM: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  tags: string[];
  bestSeason: string[];
  description: string;
  courseRoute: string;
  startPoint: { lat: number; lng: number; name: string };
  endPoint: { lat: number; lng: number; name: string };
  waypoints: Waypoint[];
  routeCoords: [number, number][]; // [lat, lng] array
  elevationProfile: ElevationPoint[];
  facilities: {
    parking: boolean;
    restroom: boolean;
    drinkingWater: boolean;
    publicTransit: boolean;
    petFriendly: boolean;
  };
  tips: string[];
  transitInfo: string;
  parkingInfo: string;
  nearestSubwayOrBus?: string;
  youtubeVideoId?: string;
  youtubeVideoTitle?: string;
  youtubeChannel?: string;
  youtubeUrl?: string;
}

export interface AIRecommendationResponse {
  title: string;
  summary: string;
  recommendedTrails: Array<{
    name: string;
    difficulty: string;
    distance: string;
    duration: string;
    highlights: string;
    whyRecommended: string;
  }>;
  tips: string[];
}

export interface FilterState {
  searchQuery: string;
  region: Region;
  difficulty: 'all' | TrailDifficulty;
  theme: string;
  maxDurationMinutes: number;
  maxDistanceKm: number;
  sortBy: 'popular' | 'distance_asc' | 'duration_asc' | 'rating' | 'near_me';
  facilities: {
    publicTransitOnly: boolean;
    parkingOnly: boolean;
    petFriendlyOnly: boolean;
  };
}
