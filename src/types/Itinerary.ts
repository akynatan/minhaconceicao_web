export type ItineraryDifficulty = "easy" | "moderate" | "hard";

export type ItineraryItemType = "heading" | "text" | "image" | "video" | "link";

export type ItineraryResourceType =
  | "attraction"
  | "place_to_eat"
  | "place_to_sleep"
  | "artisan"
  | "guide"
  | "producer"
  | "event"
  | "public_service"
  | "url";

export interface ItineraryCategoryRelation {
  id: string;
  categoryId: string;
  category?: { id: string; name: string };
}

export interface ItineraryTagRelation {
  id: string;
  tagId: string;
  tag?: { id: string; name: string };
}

export interface ItineraryResource {
  id: string;
  name: string;
  slug?: string | null;
  photoUrl?: string;
}

export interface ItineraryItem {
  id: string;
  type: ItineraryItemType;
  position: number;
  content?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  resourceType?: ItineraryResourceType | null;
  resourceId?: string | null;
  linkLabel?: string | null;
  resource?: ItineraryResource | null;
}

export interface Itinerary {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string | null;
  coverImageUrl?: string | null;
  duration?: string | null;
  difficulty?: ItineraryDifficulty | null;
  bestSeason?: string | null;
  estimatedCost?: string | null;
  transport?: string | null;
  distance?: string | null;
  weight: number;
  publishedAt?: string | null;
  isActive: boolean;
  placeCount?: number;
  categories?: ItineraryCategoryRelation[];
  tags?: ItineraryTagRelation[];
  items?: ItineraryItem[];
}

export interface ItineraryItemForm {
  clientId: string;
  type: ItineraryItemType;
  content: string;
  image: string;
  imageUrl: string;
  url: string;
  resourceType: ItineraryResourceType | "";
  resourceId: string;
  resourceName: string;
  linkLabel: string;
}

export interface ItineraryFormData {
  name: string;
  slug: string;
  description: string;
  duration: string;
  difficulty: string;
  bestSeason: string;
  estimatedCost: string;
  transport: string;
  distance: string;
  weight: string;
  publishedAt: string;
  categories: string[];
  tags: string[];
  coverImage?: string | null;
  coverImageUrl?: string | null;
  items: ItineraryItemForm[];
}
