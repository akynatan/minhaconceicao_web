export type LegalDocumentType = "terms_of_use" | "privacy_policy";

export type LegalDocumentStatus = "draft" | "published" | "current";

export interface LegalDocument {
  id: string;
  type: LegalDocumentType;
  version: number;
  title: string;
  content: string;
  publishedAt: string | null;
  acceptanceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LegalDocumentSeed {
  type: LegalDocumentType;
  title: string;
  content: string;
  version: number;
}
