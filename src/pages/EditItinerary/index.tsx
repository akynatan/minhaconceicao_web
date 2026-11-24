import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormItinerary from "../../components/FormItinerary";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import {
  Itinerary,
  ItineraryFormData,
  ItineraryItem,
  ItineraryItemForm,
} from "../../types/Itinerary";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const toDateTimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const mapItem = (item: ItineraryItem): ItineraryItemForm => ({
  clientId: item.id,
  type: item.type,
  content: item.content || "",
  image: item.image || "",
  imageUrl: item.imageUrl || "",
  url: item.url || "",
  resourceType: item.resourceType || "",
  resourceId: item.resourceId || "",
  resourceName: item.resource?.name || "",
  linkLabel: item.linkLabel || "",
});

const EditItinerary: React.FC = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState<ItineraryFormData>();
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadItinerary = async () => {
      try {
        const response = await api.get<Itinerary>(`/itineraries/${id}`);
        const data = response.data;
        setItinerary({
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          duration: data.duration || "",
          difficulty: data.difficulty || "",
          bestSeason: data.bestSeason || "",
          estimatedCost: data.estimatedCost || "",
          transport: data.transport || "",
          distance: data.distance || "",
          weight:
            data.weight === undefined || data.weight === null
              ? "0"
              : String(data.weight),
          publishedAt: toDateTimeLocal(data.publishedAt),
          categories: data.categories?.map((item) => item.categoryId) || [],
          tags: data.tags?.map((item) => item.tagId) || [],
          coverImage: data.coverImage || "",
          coverImageUrl: data.coverImageUrl || "",
          items: [...(data.items || [])]
            .sort((left, right) => left.position - right.position)
            .map(mapItem),
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(
            error,
            "Erro ao carregar dados do roteiro"
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadItinerary();
    } else {
      setIsLoading(false);
    }
  }, [addToast, id]);

  if (isLoading) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Carregando...</p>
          </Content>
        </ContentPage>
      </Container>
    );
  }

  if (!itinerary) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Roteiro não encontrado</p>
          </Content>
        </ContentPage>
      </Container>
    );
  }

  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Editar Roteiro</h1>
          <FormItinerary
            url={`/itineraries/${id}`}
            method="edit"
            initialData={itinerary}
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditItinerary;
