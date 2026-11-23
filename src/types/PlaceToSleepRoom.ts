import { Tag } from "./Tag";

export interface PlaceToSleepRoomImage {
  id: string;
  image: string;
  imageUrl: string;
  position: number;
  placeToSleepRoomId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceToSleepRoomTag {
  id: string;
  placeToSleepRoomId: string;
  tagId: string;
  position: number;
  tag?: Tag;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceToSleepRoomRule {
  id?: string;
  placeToSleepRoomId?: string;
  text: string;
  isAllowed: boolean;
  icon?: string | null;
  position?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaceToSleepRoomRuleInput {
  text: string;
  isAllowed: boolean;
  icon: string;
}

export interface PlaceToSleepRoom {
  id: string;
  placeToSleepId: string;
  name: string;
  slug: string;
  description: string;
  capacity: number;
  beds: string;
  position: number;
  isActive: boolean;
  photo?: string | null;
  photoUrl?: string;
  imageCount?: number;
  images?: PlaceToSleepRoomImage[];
  tags?: PlaceToSleepRoomTag[];
  rules?: PlaceToSleepRoomRule[];
  createdAt: string;
  updatedAt: string;
}
