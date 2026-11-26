export enum TagType {
  PLACE_TO_EAT = "place_to_eat",
  PLACE_TO_SLEEP = "place_to_sleep",
  PLACE_TO_SLEEP_ROOM = "place_to_sleep_room",
  ATTRACTIONS = "attractions",
  ITINERARY = "itinerary",
}

export const tagTypeLabels: Record<TagType, string> = {
  [TagType.PLACE_TO_EAT]: "Lugares para comer",
  [TagType.PLACE_TO_SLEEP]: "Lugares para dormir",
  [TagType.PLACE_TO_SLEEP_ROOM]: "Quartos",
  [TagType.ATTRACTIONS]: "Atrações",
  [TagType.ITINERARY]: "Roteiros",
};

const tagTypeValues = new Set<string>(Object.values(TagType));

export function isTagType(value: string | null | undefined): value is TagType {
  return !!value && tagTypeValues.has(value);
}

export function tagTypeLabel(type: string): string {
  if (isTagType(type)) {
    return tagTypeLabels[type];
  }

  return type;
}

export const tagTypeOptions = (Object.values(TagType) as TagType[]).map(
  (value) => ({
    value,
    label: tagTypeLabels[value],
  })
);
