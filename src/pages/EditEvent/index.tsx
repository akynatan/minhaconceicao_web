import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormEvent from "../../components/FormEvent";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { EventFormData, EventItem } from "../../types/Event";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const EditEvent: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const data: EventItem = response.data;
        setEvent({
          ...data,
          date: toDateTimeLocal(data.date),
          categories: data.categories?.map((item) => item.categoryId) || [],
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados do evento",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id, addToast]);

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

  if (!event) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Evento não encontrado</p>
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
          <h1>Editar Evento</h1>
          <FormEvent initialData={event} url={`/events/${id}`} method="edit" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditEvent;
