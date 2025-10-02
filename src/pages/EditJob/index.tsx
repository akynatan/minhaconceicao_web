import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Content, HeaderPage } from "./styles";
import FormJob from "../../components/FormJob";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { Job } from "../../types/Job";
import { useToast } from "../../hooks/toast";

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | undefined>();
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados da vaga",
        });
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, addToast]);

  if (loading) {
    return (
      <Container>
        <Content>
          <p style={{ textAlign: "center", padding: "40px" }}>
            Carregando dados da vaga...
          </p>
        </Content>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <Content>
          <p style={{ textAlign: "center", padding: "40px" }}>
            Vaga não encontrada
          </p>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <GoBack />
            <h1>Editar Vaga de Emprego</h1>
            <hr />
          </div>
        </HeaderPage>

        <FormJob method="edit" initialData={job} />
      </Content>
    </Container>
  );
};

export default EditJob;
