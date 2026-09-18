import { Category } from "./Category";

export interface NewsImage {
  id: string;
  image: string;
  imageUrl: string;
  newsId: string;
}

export interface NewsCategoryRelation {
  id: string;
  newsId: string;
  categoryId: string;
  category?: Category;
}

export interface News {
  id: string;
  name: string;
  description: string;
  kind?: "news" | "guide";
  date: string;
  isActive: boolean;
  images?: NewsImage[];
  categories?: NewsCategoryRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData extends Omit<News, "categories"> {
  categories?: string[];
}
