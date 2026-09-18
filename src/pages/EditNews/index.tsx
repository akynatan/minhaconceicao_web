import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import FormNews from "../../components/FormNews";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { News, NewsFormData } from "../../types/News";
import { useToast } from "../../hooks/toast";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const toDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const EditNews: React.FC = () => {
  const { id } = useParams();
  const [news, setNews] = useState<NewsFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        const data: News = response.data;
        setNews({
          ...data,
          date: toDateTimeLocal(data.date),
          categories: data.categories?.map((item) => item.categoryId) || [],
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar dados da notícia",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadNews();
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

  if (!news) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Notícia não encontrada</p>
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
          <h1>Editar Notícia</h1>
          <FormNews initialData={news} url={`/news/${id}`} method="edit" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditNews;
