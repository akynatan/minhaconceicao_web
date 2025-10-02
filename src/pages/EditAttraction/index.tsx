import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormAttraction from "../../components/FormAttraction";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { Attraction } from "../../types/Attraction";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "./styles";

const EditAttraction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .get(`/attractions/${id}`)
        .then((response) => {
          const attractionData = response.data;
          console.log({ attractionData });

          // const mappedData = {
          //   ...attractionData,
          //   categoryId: {
          //     value: attractionData.categoryId,
          //     label: attractionData.category.name,
          //   },
          //   difficulty: {
          //     value: attractionData.difficulty,
          //     label: DificultyText[attractionData.difficulty as Dificulty],
          //   },
          //   images: attractionData.images || [],
          //   schedules:
          //     attractionData.schedules?.map((schedule: any) => ({
          //       dayOfWeek: schedule.dayOfWeek,
          //       openingTime: schedule.openingTime?.substring(0, 5) || "08:00",
          //       closingTime: schedule.closingTime?.substring(0, 5) || "18:00",
          //       isClosed: schedule.isClosed,
          //     })) || [],
          // };

          setAttraction(attractionData);
        })
        .catch(() => {
          addToast({
            type: "error",
            title: "Erro",
            description: "Erro ao carregar dados da atração",
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

  if (!attraction) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <GoBack />
            <p>Atração não encontrada</p>
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

          <h1>Editar Atração Turística</h1>

          <FormAttraction
            url={`/attractions/${id}`}
            method="edit"
            initialData={attraction}
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditAttraction;
