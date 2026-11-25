import React, { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
} from "react-icons/fi";
import { v4 as uuid } from "uuid";

import api from "../../services/api";
import apipublic from "../../services/apipublic";
import FileUpload from "../FileUpload";
import {
  ItineraryItemForm,
  ItineraryItemType,
  ItineraryResourceType,
} from "../../types/Itinerary";

import {
  ItemsContainer,
  Hint,
  AddRow,
  AddButton,
  ItemCard,
  ItemHeader,
  ItemTitle,
  ItemActions,
  IconButton,
  RemoveButton,
  Field,
  Area,
  SelectField,
  ResultList,
  ResultButton,
  SelectedPlace,
  ErrorText,
} from "./styles";

const ITEM_TYPES: { type: ItineraryItemType; label: string }[] = [
  { type: "heading", label: "Subtítulo" },
  { type: "text", label: "Texto" },
  { type: "image", label: "Imagem" },
  { type: "video", label: "Vídeo" },
  { type: "link", label: "Link" },
];

const RESOURCE_OPTIONS: { value: ItineraryResourceType; label: string }[] = [
  { value: "attraction", label: "Atração" },
  { value: "place_to_eat", label: "Lugar para comer" },
  { value: "place_to_sleep", label: "Lugar para dormir" },
  { value: "artisan", label: "Artesão" },
  { value: "guide", label: "Guia" },
  { value: "producer", label: "Produtor" },
  { value: "event", label: "Evento" },
  { value: "public_service", label: "Serviço público" },
  { value: "url", label: "Link externo" },
];

const RESOURCE_ENDPOINTS: Record<
  Exclude<ItineraryResourceType, "url">,
  string
> = {
  attraction: "/attractions",
  place_to_eat: "/places-to-eat",
  place_to_sleep: "/places-to-sleep",
  artisan: "/artisans",
  guide: "/guides",
  producer: "/producers",
  event: "/events",
  public_service: "/public-services",
};

interface CatalogOption {
  id: string;
  name: string;
}

interface ItineraryItemsProps {
  items: ItineraryItemForm[];
  onChange: (items: ItineraryItemForm[]) => void;
  error?: string;
}

const emptyItem = (type: ItineraryItemType): ItineraryItemForm => ({
  clientId: uuid(),
  type,
  content: "",
  image: "",
  imageUrl: "",
  url: "",
  resourceType: type === "link" ? "attraction" : "",
  resourceId: "",
  resourceName: "",
  linkLabel: "",
});

const asCatalog = (payload: unknown): CatalogOption[] => {
  const rows = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? ((payload as { data?: unknown; artisans?: unknown }).data ??
          (payload as { artisans?: unknown }).artisans ??
          [])
      : [];

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => {
      if (!row || typeof row !== "object" || !("id" in row)) {
        return null;
      }
      const item = row as { id: string; name?: string; title?: string };
      return { id: item.id, name: item.name || item.title || "Sem nome" };
    })
    .filter((row): row is CatalogOption => Boolean(row));
};

const ItineraryItems: React.FC<ItineraryItemsProps> = ({
  items,
  onChange,
  error,
}) => {
  const [catalogs, setCatalogs] = useState<
    Partial<Record<Exclude<ItineraryResourceType, "url">, CatalogOption[]>>
  >({});
  const [queries, setQueries] = useState<Record<string, string>>({});

  useEffect(() => {
    const types = new Set(
      items
        .map((item) => item.resourceType)
        .filter(
          (type): type is Exclude<ItineraryResourceType, "url"> =>
            Boolean(type) && type !== "url"
        )
    );

    types.forEach((type) => {
      if (catalogs[type]) {
        return;
      }

      const request =
        type === "public_service"
          ? apipublic.get(RESOURCE_ENDPOINTS[type])
          : api.get(RESOURCE_ENDPOINTS[type]);

      request
        .then((response) => {
          setCatalogs((current) => ({
            ...current,
            [type]: asCatalog(response.data),
          }));
        })
        .catch(() => {
          setCatalogs((current) => ({ ...current, [type]: [] }));
        });
    });
  }, [catalogs, items]);

  const updateItem = (clientId: string, fields: Partial<ItineraryItemForm>) => {
    onChange(
      items.map((item) =>
        item.clientId === clientId ? { ...item, ...fields } : item
      )
    );
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) {
      return;
    }
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  return (
    <ItemsContainer>
      <Hint>
        A ordem desta lista é a ordem do roteiro. Subtítulo, texto, imagem,
        vídeo ou link.
      </Hint>
      <AddRow>
        {ITEM_TYPES.map((itemType) => (
          <AddButton
            key={itemType.type}
            type="button"
            onClick={() => onChange([...items, emptyItem(itemType.type)])}
          >
            {itemType.label}
          </AddButton>
        ))}
      </AddRow>

      {items.map((item, index) => {
        const resourceType = item.resourceType;
        const catalog =
          resourceType && resourceType !== "url"
            ? catalogs[resourceType] || []
            : [];
        const query = (queries[item.clientId] || "").trim().toLowerCase();
        const results = catalog
          .filter((option) => option.name.toLowerCase().includes(query))
          .slice(0, 8);

        return (
          <ItemCard key={item.clientId}>
            <ItemHeader>
              <ItemTitle>
                {index + 1}.{" "}
                {ITEM_TYPES.find((type) => type.type === item.type)?.label}
              </ItemTitle>
              <ItemActions>
                <IconButton
                  type="button"
                  title="Subir"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                >
                  <FiChevronUp size={16} />
                </IconButton>
                <IconButton
                  type="button"
                  title="Descer"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                >
                  <FiChevronDown size={16} />
                </IconButton>
                <RemoveButton
                  type="button"
                  onClick={() =>
                    onChange(items.filter((current) => current.clientId !== item.clientId))
                  }
                >
                  <FiTrash2 size={16} />
                  Remover
                </RemoveButton>
              </ItemActions>
            </ItemHeader>

            {(item.type === "heading" || item.type === "text") &&
              (item.type === "text" ? (
                <Area
                  value={item.content}
                  placeholder="Texto do parágrafo"
                  onChange={(event) =>
                    updateItem(item.clientId, { content: event.target.value })
                  }
                />
              ) : (
                <Field
                  value={item.content}
                  placeholder="Texto do subtítulo"
                  onChange={(event) =>
                    updateItem(item.clientId, { content: event.target.value })
                  }
                />
              ))}

            {item.type === "image" && (
              <>
                <FileUpload
                  name={`item-image-${item.clientId}`}
                  placeholder="Selecione a imagem do item"
                  accept="image/*"
                  maxSize={5}
                  existingPhoto={
                    item.image && item.imageUrl
                      ? { key: item.image, photoUrl: item.imageUrl }
                      : undefined
                  }
                  onUploadSuccess={(fileData) =>
                    updateItem(item.clientId, {
                      image: fileData.key,
                      imageUrl: fileData.imageUrl,
                    })
                  }
                />
                <Field
                  value={item.content}
                  placeholder="Legenda (opcional)"
                  onChange={(event) =>
                    updateItem(item.clientId, { content: event.target.value })
                  }
                />
              </>
            )}

            {item.type === "video" && (
              <>
                <Field
                  value={item.url}
                  placeholder="URL do YouTube (https://...)"
                  onChange={(event) =>
                    updateItem(item.clientId, { url: event.target.value })
                  }
                />
                <Field
                  value={item.content}
                  placeholder="Legenda (opcional)"
                  onChange={(event) =>
                    updateItem(item.clientId, { content: event.target.value })
                  }
                />
              </>
            )}

            {item.type === "link" && (
              <>
                <SelectField
                  value={item.resourceType}
                  onChange={(event) =>
                    updateItem(item.clientId, {
                      resourceType: event.target.value as ItineraryResourceType,
                      resourceId: "",
                      resourceName: "",
                      url: "",
                    })
                  }
                >
                  {RESOURCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>

                {item.resourceType === "url" ? (
                  <Field
                    value={item.url}
                    placeholder="https://..."
                    onChange={(event) =>
                      updateItem(item.clientId, { url: event.target.value })
                    }
                  />
                ) : (
                  <>
                    <Field
                      value={queries[item.clientId] || ""}
                      placeholder="Buscar lugar cadastrado"
                      onChange={(event) =>
                        setQueries((current) => ({
                          ...current,
                          [item.clientId]: event.target.value,
                        }))
                      }
                    />
                    {item.resourceId && (
                      <SelectedPlace>
                        Selecionado: {item.resourceName || item.resourceId}
                      </SelectedPlace>
                    )}
                    <ResultList>
                      {results.length === 0 ? (
                        <ResultButton type="button" disabled>
                          Nenhum lugar encontrado
                        </ResultButton>
                      ) : (
                        results.map((option) => (
                          <ResultButton
                            key={option.id}
                            type="button"
                            onClick={() =>
                              updateItem(item.clientId, {
                                resourceId: option.id,
                                resourceName: option.name,
                              })
                            }
                          >
                            {option.name}
                          </ResultButton>
                        ))
                      )}
                    </ResultList>
                  </>
                )}

                <Field
                  value={item.linkLabel}
                  placeholder="Texto do link (opcional)"
                  onChange={(event) =>
                    updateItem(item.clientId, { linkLabel: event.target.value })
                  }
                />
              </>
            )}
          </ItemCard>
        );
      })}

      {error && <ErrorText>{error}</ErrorText>}
    </ItemsContainer>
  );
};

export default ItineraryItems;
