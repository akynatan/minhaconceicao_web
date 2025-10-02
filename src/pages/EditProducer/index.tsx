import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormProducer from "../../components/FormProducer";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { Producer } from "../../types/Producer";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "./styles";

const EditProducer: React.FC = () => {
  const { id } = useParams();
  const [producer, setProducer] = useState<Producer | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadProducer = async () => {
      try {
        const response = await api.get(`/producers/${id}`);
        setProducer(response.data);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados do produtor",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProducer();
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

  if (!producer) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Produtor não encontrado</p>
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

          <h1>Editar Produtor</h1>

          <FormProducer
            initialData={producer}
            url={`/producers/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditProducer;
