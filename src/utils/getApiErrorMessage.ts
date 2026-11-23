import { isAxiosError } from "axios";

export default function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const data = error.response?.data as
    | { error?: unknown; message?: unknown }
    | undefined;
  const message = data?.error ?? data?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    const texts = message.filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    );
    if (texts.length > 0) {
      return texts.join(", ");
    }
  }

  return fallback;
}
