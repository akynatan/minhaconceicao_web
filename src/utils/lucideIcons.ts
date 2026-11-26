const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface LucideIconOption {
  kebab: string;
  pascal: string;
}

export interface LucideCatalog {
  known: Set<string>;
  options: LucideIconOption[];
}

export function pascalToKebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export function kebabToPascal(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toLucideKebab(
  stored: string | null | undefined
): string | null {
  const value = stored?.trim();
  if (!value) {
    return null;
  }

  if (KEBAB.test(value)) {
    return value;
  }

  const kebab = pascalToKebab(value);
  if (KEBAB.test(kebab)) {
    return kebab;
  }

  return null;
}

export function canonicalIconOptions(
  names: readonly string[],
  sourceOf: (name: string) => string
): LucideIconOption[] {
  const groups = new Map<string, string[]>();

  for (const name of names) {
    const source = sourceOf(name);
    const match = source.match(
      /assets\/([^"'()\s]+\.js)|icons\/([^"'()\s]+\.mjs)/
    );
    const chunk = match?.[1] || match?.[2] || source;
    const group = groups.get(chunk);

    if (group) {
      group.push(name);
    } else {
      groups.set(chunk, [name]);
    }
  }

  const options: LucideIconOption[] = [];

  for (const [chunk, group] of groups) {
    const file = chunk.split("/").pop() ?? chunk;
    const matches = group.filter(
      (name) => file.startsWith(`${name}-`) || file.startsWith(`${name}.`)
    );
    matches.sort((left, right) => right.length - left.length);
    const kebab = matches[0] ?? group[0];
    options.push({ kebab, pascal: kebabToPascal(kebab) });
  }

  options.sort((left, right) => left.pascal.localeCompare(right.pascal, "en"));
  return options;
}

let catalogPromise: Promise<LucideCatalog> | null = null;

export function loadLucideCatalog(): Promise<LucideCatalog> {
  if (!catalogPromise) {
    catalogPromise = import("lucide-react/dynamic").then(
      ({ iconNames, dynamicIconImports }) => ({
        known: new Set<string>(iconNames),
        options: canonicalIconOptions(iconNames, (name) =>
          dynamicIconImports[name as keyof typeof dynamicIconImports].toString()
        ),
      })
    );
  }

  return catalogPromise;
}
