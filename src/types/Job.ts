import { Company } from "./Company";

export enum ContractType {
  CLT = "CLT",
  PJ = "PJ",
  INTERNSHIP = "INTERNSHIP",
  TEMPORARY = "TEMPORARY",
}

export enum WorkModel {
  ON_SITE = "ON_SITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
}

export enum WorkSchedule {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  FLEXIBLE = "FLEXIBLE",
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  contractType: ContractType;
  workModel: WorkModel;
  workSchedule: WorkSchedule;
  salary?: number;
  location: string;
  area: string;
  companyId: string;
  company: Company;
  isActive: boolean;
  publicationDate: string;
  expirationDate?: string;
  quantity: number;
  applicationEmail?: string;
  applicationPhone?: string;
  applicationLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  contractType: ContractType;
  workModel: WorkModel;
  workSchedule: WorkSchedule;
  salary?: number;
  location: string;
  area: string;
  companyId: string;
  publicationDate: string;
  expirationDate?: string;
  quantity?: number;
  applicationEmail?: string;
  applicationPhone?: string;
  applicationLink?: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  contractType?: ContractType;
  workModel?: WorkModel;
  workSchedule?: WorkSchedule;
  salary?: number;
  location?: string;
  area?: string;
  companyId?: string;
  isActive?: boolean;
  publicationDate?: string;
  expirationDate?: string;
  quantity?: number;
  applicationEmail?: string;
  applicationPhone?: string;
  applicationLink?: string;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobListFilters {
  title?: string;
  location?: string;
  area?: string;
  contractType?: ContractType;
  workModel?: WorkModel;
  workSchedule?: WorkSchedule;
  isActive?: boolean;
  companyId?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}
