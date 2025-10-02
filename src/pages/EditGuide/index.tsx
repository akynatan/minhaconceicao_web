import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormGuide from "../../components/FormGuide";
import GoBack from "../../components/GoBack";
import { Guide } from "../../types/Guide";
import api from "../../services/api";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "./styles";

const EditGuide: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (id) {
      api
        .get(`/guides/${id}`)
        .then((response) => {
          setGuide(response.data);
        })
        .catch(() => {
          addToast({
            type: "error",
            title: "Erro ao carregar",
            description: "Erro ao carregar dados do guia",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
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

  if (!guide) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Guia não encontrado</p>
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

          <h1>Editar Guia</h1>

          <FormGuide initialData={guide} url={`/guides/${id}`} method="edit" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditGuide;
