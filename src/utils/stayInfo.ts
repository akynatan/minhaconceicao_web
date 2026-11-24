import * as Yup from "yup";

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function cleanedTime(value?: string | null): string {
  return (value ?? "").replace(/_/g, "").trim();
}

export function timeOrNull(value?: string | null): string | null {
  const cleaned = cleanedTime(value);
  return TIME_PATTERN.test(cleaned) ? cleaned : null;
}

export function emptyToNull(value?: string | null): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed ? trimmed : null;
}

export function toTimeInput(value?: string | null): string {
  return timeOrNull(value) ?? "";
}

export function optionalTimeSchema(label: string) {
  return Yup.string().test(
    "hhmm",
    `${label} deve estar no formato HH:mm`,
    (value) => {
      const cleaned = cleanedTime(value);
      if (!cleaned || cleaned === ":") {
        return true;
      }
      return TIME_PATTERN.test(cleaned);
    }
  );
}

export function optionalStayTextSchema() {
  return Yup.string().trim().max(120, "Máximo de 120 caracteres");
}
