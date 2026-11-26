export enum CategoryType {
  ATTRACTIONS = "attractions",
  PLACE_TO_EAT = "place_to_eat",
  PLACE_TO_SLEEP = "place_to_sleep",
  EVENTS = "events",
  NEWS = "news",
  PUBLIC_SERVICES = "public_services",
  PRODUCERS = "producers",
  ARTISANS = "artisans",
  GUIDES = "guides",
  JOBS = "jobs",
  CHALLENGES = "challenges",
  ITINERARY = "itinerary",
}

export const categoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.ATTRACTIONS]: "Atrações",
  [CategoryType.PLACE_TO_EAT]: "Lugares para comer",
  [CategoryType.PLACE_TO_SLEEP]: "Lugares para dormir",
  [CategoryType.EVENTS]: "Eventos",
  [CategoryType.NEWS]: "Notícias",
  [CategoryType.PUBLIC_SERVICES]: "Serviços públicos",
  [CategoryType.PRODUCERS]: "Produtores",
  [CategoryType.ARTISANS]: "Artesãos",
  [CategoryType.GUIDES]: "Guias",
  [CategoryType.JOBS]: "Vagas",
  [CategoryType.CHALLENGES]: "Desafios",
  [CategoryType.ITINERARY]: "Roteiros",
};

const categoryTypeValues = new Set<string>(Object.values(CategoryType));

export function isCategoryType(
  value: string | null | undefined
): value is CategoryType {
  return !!value && categoryTypeValues.has(value);
}

export function categoryTypeLabel(type: string): string {
  if (isCategoryType(type)) {
    return categoryTypeLabels[type];
  }

  return type;
}

export const categoryTypeOptions = (
  Object.values(CategoryType) as CategoryType[]
).map((value) => ({
  value,
  label: categoryTypeLabels[value],
}));
