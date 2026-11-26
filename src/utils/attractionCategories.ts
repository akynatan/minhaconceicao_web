import { Category } from "../types/Category";
import {
  Attraction,
  AttractionCategoryRelation,
} from "../types/Attraction";

type AttractionCategorySource = Pick<
  Attraction,
  "categories" | "category" | "categoryId"
>;

const categoryIdFromRow = (
  row: AttractionCategoryRelation | Category | string
): string | undefined => {
  if (typeof row === "string") {
    return row || undefined;
  }

  if ("category" in row && row.category?.id) {
    return row.category.id;
  }

  if ("categoryId" in row && row.categoryId) {
    return row.categoryId;
  }

  if ("name" in row && row.id) {
    return row.id;
  }

  return undefined;
};

const categoryNameFromRow = (
  row: AttractionCategoryRelation | Category | string
): string | undefined => {
  if (typeof row === "string") {
    return undefined;
  }

  if ("category" in row && row.category?.name) {
    return row.category.name;
  }

  if ("name" in row && row.name && !("categoryId" in row)) {
    return row.name;
  }

  return undefined;
};

export const attractionFormCategoryIds = (
  attraction: AttractionCategorySource
): string[] => {
  const mainId = attraction.category?.id || attraction.categoryId || undefined;
  const linkedIds = (attraction.categories || [])
    .map((row) => categoryIdFromRow(row))
    .filter((id): id is string => !!id);

  if (linkedIds.length === 0) {
    return mainId ? [mainId] : [];
  }

  const ids: string[] = [];

  if (mainId) {
    ids.push(mainId);
  }

  linkedIds.forEach((id) => {
    if (!ids.includes(id)) {
      ids.push(id);
    }
  });

  return ids;
};

export const attractionCategoryIds = attractionFormCategoryIds;

export const attractionMatchesCategory = (
  attraction: AttractionCategorySource,
  categoryId: string
): boolean => {
  if (!categoryId) {
    return true;
  }

  return attractionCategoryIds(attraction).includes(categoryId);
};

export const attractionCategoryLabels = (
  attraction: AttractionCategorySource
): { id: string; name: string }[] => {
  const names = new Map<string, string>();

  if (attraction.category?.id && attraction.category.name) {
    names.set(attraction.category.id, attraction.category.name);
  }

  (attraction.categories || []).forEach((row) => {
    const id = categoryIdFromRow(row);
    const name = categoryNameFromRow(row);

    if (id && name) {
      names.set(id, name);
    }
  });

  return attractionFormCategoryIds(attraction)
    .filter((id) => names.has(id))
    .map((id) => ({
      id,
      name: names.get(id) as string,
    }));
};
