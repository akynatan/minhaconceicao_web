import { Category } from "./Category";
import { Tag } from "./Tag";
export interface PlaceToEatImage {
  id: string;
  image: string;
  imageUrl: string;
  placeToEatId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToEatCategory {
  id: string;
  placeToEatId: string;
  categoryId: string;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToEatTag {
  id: string;
  placeToEatId: string;
  tagId: string;
  tag?: Tag;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToEatAttraction {
  id: string;
  placeToEatId: string;
  attractionId: string;
  attraction?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToEatSchedule {
  id: string;
  placeToEatId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToEat {
  id: string;
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  averagePrice?: number;
  isActive: boolean;
  photo?: string;
  photoUrl?: string;
  images?: PlaceToEatImage[];
  categories: PlaceToEatCategory[];
  tags: PlaceToEatTag[];
  attractions: PlaceToEatAttraction[];
  schedules: PlaceToEatSchedule[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreatePlaceToEatData {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  averagePrice?: number;
  isActive?: boolean;
  tags?: string[];
  photo?: string;
}

export interface UpdatePlaceToEatData extends CreatePlaceToEatData {
  id: string;
}
