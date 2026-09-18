import { Category } from "./Category";

export interface ProductArtisan {
  id: string;
  name: string;
  description: string;
  value?: number;
  image: string;
  imageUrl?: string;
  categoryId: string;
  artisanId: string;
  category?: Category;
}

export interface Artisan {
  id: string;
  name: string;
  description: string;
  photo?: string;
  photoUrl?: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  city?: string;
  neighborhood?: string;
  address?: string;
  number?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  cover?: string;
  coverUrl?: string;
  products?: ProductArtisan[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductArtisanData {
  name: string;
  categoryId: string;
  description: string;
  value?: number;
  image: string;
  imageUrl?: string;
}
