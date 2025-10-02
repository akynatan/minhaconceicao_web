export interface Guide {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  whatsapp?: string;
  instagram?: string;
  experience?: string;
  specialties?: string;
  photo?: string;
  photoUrl?: string;
  isActive: boolean;
  attractions?: {
    id: string;
    name: string;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateGuideData {
  name: string;
  description: string;
  phone: string;
  email: string;
  whatsapp?: string;
  instagram?: string;
  experience?: string;
  specialties?: string;
  photo?: string;
  attractions?: string[];
}

export interface UpdateGuideData extends CreateGuideData {
  id: string;
  isActive?: boolean;
}

export interface GuideTrail {
  id: string;
  guideId: string;
  attractionId: string;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  guide?: Guide;
  attraction?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CreateGuideTrailData {
  guideId: string;
  attractionId: string;
  notes?: string;
}

export interface UpdateGuideTrailData {
  notes?: string;
  isActive?: boolean;
}
