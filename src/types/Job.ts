import { Company } from "./Company";
import { Category } from "./Category";

export enum ContractType {
  CLT = "CLT",
  PJ = "PJ",
  INTERNSHIP = "INTERNSHIP",
  TEMPORARY = "TEMPORARY",
  FREELANCER = "FREELANCER",
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

export enum SalaryPeriod {
  MONTH = "MONTH",
  YEAR = "YEAR",
  DAY = "DAY",
  HOUR = "HOUR",
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
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: SalaryPeriod;
  location: string;
  categoryId: string;
  category?: Category;
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
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: SalaryPeriod;
  location: string;
  categoryId: string;
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
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: SalaryPeriod;
  location?: string;
  categoryId?: string;
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
  categoryId?: string;
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

export const SALARY_PERIOD_OPTIONS = [
  { value: SalaryPeriod.MONTH, label: "Por mês" },
  { value: SalaryPeriod.YEAR, label: "Por ano" },
  { value: SalaryPeriod.DAY, label: "Por dia" },
  { value: SalaryPeriod.HOUR, label: "Por hora" },
];

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const getSalaryPeriodText = (period: SalaryPeriod): string => {
  const labels: Record<SalaryPeriod, string> = {
    [SalaryPeriod.MONTH]: "/mês",
    [SalaryPeriod.YEAR]: "/ano",
    [SalaryPeriod.DAY]: "/dia",
    [SalaryPeriod.HOUR]: "/hora",
  };

  return labels[period];
};

export const formatJobSalary = (job: {
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: SalaryPeriod;
}): string => {
  const min = job.salaryMin != null ? Number(job.salaryMin) : undefined;
  const max = job.salaryMax != null ? Number(job.salaryMax) : undefined;

  if (min == null && max == null) {
    return "A combinar";
  }

  const periodText = job.salaryPeriod
    ? getSalaryPeriodText(job.salaryPeriod)
    : getSalaryPeriodText(SalaryPeriod.MONTH);

  if (min != null && max != null && min !== max) {
    return `${formatCurrency(min)} - ${formatCurrency(max)} ${periodText}`;
  }

  const value = min ?? max!;
  return `${formatCurrency(value)} ${periodText}`;
};
