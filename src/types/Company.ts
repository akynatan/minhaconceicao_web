import { Job } from "./Job";

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  jobs?: Job[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyData {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateCompanyData {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive?: boolean;
}

export interface CompanyListResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyListFilters {
  name?: string;
  city?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
