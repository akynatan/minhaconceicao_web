import { Category } from "./Category";
export interface PlaceToSleepImage {
  id: string;
  image: string;
  imageUrl: string;
  placeToSleepId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToSleepCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  iconClass: string;
  colorPrimary: string;
  colorSecondary: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToSleepCategory {
  id: string;
  placeToSleepId: string;
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToSleepAttraction {
  id: string;
  name: string;
  description: string;
  placeToSleepId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToSleepSchedule {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  placeToSleepId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceToSleep {
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
  tags?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  averagePrice?: number;
  isActive: boolean;
  photo?: string;
  photoUrl?: string;
  images?: PlaceToSleepImage[];
  categories: PlaceToSleepCategory[];
  attractions: PlaceToSleepAttraction[];
  schedules: PlaceToSleepSchedule[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreatePlaceToSleepData {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  tags?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  averagePrice?: number;
  isActive?: boolean;
}

export interface UpdatePlaceToSleepData extends CreatePlaceToSleepData {
  id: string;
}
