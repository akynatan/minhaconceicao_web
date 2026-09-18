import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormArtisan from "../../components/FormArtisan";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { Artisan } from "../../types/Artisan";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const EditArtisan: React.FC = () => {
  const { id } = useParams();
  const [artisan, setArtisan] = useState<Artisan | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadArtisan = async () => {
      try {
        const response = await api.get(`/artisans/${id}`);
        setArtisan(response.data);
      } catch {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados do artesão",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadArtisan();
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

  if (!artisan) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Artesão não encontrado</p>
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
          <h1>Editar Artesão</h1>
          <FormArtisan
            initialData={artisan}
            url={`/artisans/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditArtisan;
