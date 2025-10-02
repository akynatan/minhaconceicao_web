export interface ProductProducer {
  id: string;
  description: string;
  value: number;
  image: string;
  imageUrl?: string;
  productId: string;
  producerId: string;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  key: string;
  name: string;
  icon: string;
  iconClass: string;
  colorPrimary: string;
  colorSecondary: string;
  createdAt: string;
  updatedAt: string;
}

export interface Producer {
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
  products?: ProductProducer[];
  isActive: boolean;
  specialties?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProducerData {
  name: string;
  description: string;
  photo?: string;
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
  specialties?: string;
  experience?: string;
  products?: CreateProductProducerData[];
}

export interface UpdateProducerData {
  name?: string;
  description?: string;
  photo?: string;
  phone?: string;
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
  specialties?: string;
  experience?: string;
  products?: CreateProductProducerData[];
}

export interface CreateProductProducerData {
  productId: string;
  description: string;
  value: number;
  image: string;
  imageUrl?: string;
}
