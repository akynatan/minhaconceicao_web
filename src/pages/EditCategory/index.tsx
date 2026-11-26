import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import FormCategory, {
  CategoryFormData,
} from "../../components/FormCategory";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import asArray from "../../utils/asArray";
import { normalizeHex } from "../../utils/hexColor";
import { Category } from "../../types/Category";
import { isCategoryType } from "../../enums/CategoryType";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const toForm = (category: Category): CategoryFormData => ({
  name: category.name || "",
  description: category.description || "",
  icon: category.icon || "",
  type: category.type || "",
  colorPrimary: normalizeHex(category.colorPrimary, "#198653"),
  colorSecondary: normalizeHex(category.colorSecondary, "#E6F4EE"),
  weight:
    category.weight === undefined || category.weight === null
      ? "0"
      : String(category.weight),
});

const EditCategory: React.FC = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const typeParam = params.get("type");
  const type = isCategoryType(typeParam) ? typeParam : "";
  const [category, setCategory] = useState<Category>();
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/category", {
          params: type ? { type } : undefined,
        });
        let found = asArray<Category>(response.data).find(
          (item) => item.id === id
        );

        if (!found && type) {
          const all = await api.get("/category");
          found = asArray<Category>(all.data).find((item) => item.id === id);
        }

        setCategory(found);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(
            error,
            "Erro ao carregar a categoria"
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [addToast, id, type]);

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

  if (!category) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <GoBack />
            <p>Categoria não encontrada</p>
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
          <h1>Editar Categoria</h1>
          <FormCategory
            url={`/category/${category.id}`}
            method="edit"
            initialData={toForm(category)}
            recordKey={category.key}
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditCategory;
