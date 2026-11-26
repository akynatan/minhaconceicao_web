import {
  LegalDocument,
  LegalDocumentSeed,
  LegalDocumentStatus,
  LegalDocumentType,
} from "../types/LegalDocument";

export const LEGAL_DOCUMENT_TYPES: LegalDocumentType[] = [
  "terms_of_use",
  "privacy_policy",
];

export const LEGAL_DOCUMENT_TYPE_LABEL: Record<LegalDocumentType, string> = {
  terms_of_use: "Termos de Uso",
  privacy_policy: "Política de Privacidade",
};

export const LEGAL_DOCUMENT_TYPE_OPTIONS = LEGAL_DOCUMENT_TYPES.map((type) => ({
  value: type,
  label: LEGAL_DOCUMENT_TYPE_LABEL[type],
}));

export const LEGAL_DOCUMENT_STATUS_LABEL: Record<LegalDocumentStatus, string> =
  {
    draft: "Rascunho",
    published: "Publicado",
    current: "Vigente",
  };

const PUBLISH_CONFIRM_MESSAGE = [
  "Publicar esta versão?",
  "",
  "Na próxima abertura do aplicativo, os usuários serão solicitados a aceitar esta nova versão.",
  "",
  "Um documento publicado não pode ser editado. Para mudar o texto, crie uma nova versão.",
].join("\n");

export function confirmPublishLegalDocument(): boolean {
  return window.confirm(PUBLISH_CONFIRM_MESSAGE);
}

export function legalDocumentTypeLabel(
  type?: LegalDocumentType | string
): string {
  if (type === "terms_of_use" || type === "privacy_policy") {
    return LEGAL_DOCUMENT_TYPE_LABEL[type];
  }

  return "Documento";
}

export function asLegalDocuments(payload: unknown): LegalDocument[] {
  if (Array.isArray(payload)) {
    return payload as LegalDocument[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: LegalDocument[] }).data;
  }

  return [];
}

export function isLegalDocumentSeed(value: unknown): value is LegalDocumentSeed {
  if (!value || typeof value !== "object") {
    return false;
  }

  const seed = value as Partial<LegalDocumentSeed>;

  return (
    (seed.type === "terms_of_use" || seed.type === "privacy_policy") &&
    typeof seed.title === "string" &&
    typeof seed.content === "string" &&
    typeof seed.version === "number" &&
    Number.isInteger(seed.version) &&
    seed.version >= 1
  );
}

export function legalDocumentSeed(item: LegalDocument): LegalDocumentSeed {
  return {
    type: item.type,
    title: item.title,
    content: item.content,
    version: item.version + 1,
  };
}

export function resolveNextVersion(
  documents: LegalDocument[],
  minimum: number
): number {
  const maxVersion = documents.reduce(
    (max, item) => Math.max(max, item.version),
    0
  );

  return Math.max(minimum, maxVersion + 1);
}

function publishedTime(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

export function currentLegalDocumentIds(
  documents: LegalDocument[]
): Set<string> {
  const current = new Map<LegalDocumentType, LegalDocument>();

  documents.forEach((item) => {
    const time = publishedTime(item.publishedAt);
    if (time === null) {
      return;
    }

    const existing = current.get(item.type);
    if (!existing) {
      current.set(item.type, item);
      return;
    }

    const existingTime = publishedTime(existing.publishedAt) ?? 0;
    if (
      time > existingTime ||
      (time === existingTime && item.version > existing.version)
    ) {
      current.set(item.type, item);
    }
  });

  return new Set(Array.from(current.values()).map((item) => item.id));
}

export function legalDocumentStatus(
  item: LegalDocument,
  currentIds: Set<string>
): LegalDocumentStatus {
  if (!item.publishedAt) {
    return "draft";
  }

  if (currentIds.has(item.id)) {
    return "current";
  }

  return "published";
}

export function formatPublishedAt(value: string | null): string {
  if (!value) {
    return "Não publicado";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Não publicado";
  }

  return date.toLocaleString("pt-BR");
}

export function formatAcceptanceCount(count: number): string {
  if (count === 1) {
    return "1 aceite";
  }

  return `${count} aceites`;
}
