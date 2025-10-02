import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Content, HeaderPage } from "./styles";
import FormCompany from "../../components/FormCompany";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { Company } from "../../types/Company";
import { useToast } from "../../hooks/toast";

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | undefined>();
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadCompany = async () => {
      if (!id) return;

      try {
        const response = await api.get(`/companies/${id}`);
        setCompany(response.data);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados da empresa",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [id, addToast]);

  if (loading) {
    return (
      <Container>
        <Content>
          <p style={{ textAlign: "center", padding: "40px" }}>
            Carregando dados da empresa...
          </p>
        </Content>
      </Container>
    );
  }

  if (!company) {
    return (
      <Container>
        <Content>
          <p style={{ textAlign: "center", padding: "40px" }}>
            Empresa não encontrada
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
            <h1>Editar Empresa</h1>
            <hr />
          </div>
        </HeaderPage>

        <FormCompany method="edit" initialData={company} />
      </Content>
    </Container>
  );
};

export default EditCompany;
