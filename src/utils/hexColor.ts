const HEX = /^#([0-9A-Fa-f]{6})$/;

export function isHexColor(value: string | null | undefined): value is string {
  return !!value && HEX.test(value.trim());
}

export function normalizeHex(
  value: string | null | undefined,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }

  const match = value.trim().match(HEX);
  if (!match) {
    return fallback;
  }

  return `#${match[1].toUpperCase()}`;
}
