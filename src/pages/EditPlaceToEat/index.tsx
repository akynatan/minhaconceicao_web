import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormPlaceToEat from "../../components/FormPlaceToEat";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { PlaceToEat } from "../../types/PlaceToEat";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "./styles";

const EditPlaceToEat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [placeToEat, setPlaceToEat] = useState<PlaceToEat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .get(`/places-to-eat/${id}`)
        .then((response) => {
          const placeToEatData = response.data;

          const mappedData = {
            ...placeToEatData,
            latitude: placeToEatData.latitude || "",
            longitude: placeToEatData.longitude || "",
            categories:
              placeToEatData.categories?.map((cat: any) => cat.categoryId) ||
              [],
            images: placeToEatData.images || [],
            schedules:
              placeToEatData.schedules?.map((schedule: any) => ({
                dayOfWeek: schedule.dayOfWeek,
                openingTime: schedule.openingTime?.substring(0, 5) || "08:00",
                closingTime: schedule.closingTime?.substring(0, 5) || "18:00",
                isClosed: schedule.isClosed || false,
              })) || [],
          };

          setPlaceToEat(mappedData);
        })
        .catch(() => {
          addToast({
            type: "error",
            title: "Erro",
            description: "Erro ao carregar dados do local",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, addToast]);

  if (loading) {
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

  if (!placeToEat) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <GoBack />
            <p>Local não encontrado</p>
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

          <h1>Editar Local para Comer</h1>

          <FormPlaceToEat
            url={`/places-to-eat/${id}`}
            method="edit"
            initialData={placeToEat}
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditPlaceToEat;
