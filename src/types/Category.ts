export interface Category {
  id: string;
  name: string;
  key: string;
  description?: string | null;
  icon: string;
  weight: number;
  type: string;
  colorPrimary: string;
  colorSecondary: string;
}
