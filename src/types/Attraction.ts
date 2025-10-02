export interface AttractionImage {
  id: string;
  image: string;
  imageUrl: string;
  attractionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttractionCategory {
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

export interface AttractionSchedule {
  id: string;
  attractionId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  distance: number;
  howToArrive: string;
  elevationGain?: number;
  tags?: string;
  isActive: boolean;
  photo?: string;
  photoUrl?: string;
  images?: AttractionImage[];
  schedules: AttractionSchedule[];
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateAttractionData {
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  distance: number;
  howToArrive: string;
  elevationGain?: number;
  tags?: string;
  categoryId: string;
}

export interface UpdateAttractionData extends CreateAttractionData {
  id: string;
}
