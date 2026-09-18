import { Category } from "./Category";

export interface EventImage {
  id: string;
  image: string;
  imageUrl: string;
  eventId: string;
}

export interface EventCategoryRelation {
  id: string;
  eventId: string;
  categoryId: string;
  category?: Category;
}

export interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  address: string;
  latitude?: number;
  longitude?: number;
  images?: EventImage[];
  categories?: EventCategoryRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData extends Omit<EventItem, "categories"> {
  categories?: string[];
}
