import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import FormTag, { TagFormData } from "../../components/FormTag";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import asArray from "../../utils/asArray";
import { normalizeHex } from "../../utils/hexColor";
import { Tag } from "../../types/Tag";
import { isTagType } from "../../enums/TagType";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const toForm = (tag: Tag): TagFormData => ({
  name: tag.name || "",
  icon: tag.icon || "",
  type: tag.type || "",
  colorPrimary: normalizeHex(tag.colorPrimary, "#198653"),
  colorSecondary: normalizeHex(tag.colorSecondary, "#E6F4EE"),
  weight:
    tag.weight === undefined || tag.weight === null ? "0" : String(tag.weight),
});

const EditTag: React.FC = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const typeParam = params.get("type");
  const type = isTagType(typeParam) ? typeParam : "";
  const [tag, setTag] = useState<Tag>();
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/tag", {
          params: type ? { type } : undefined,
        });
        let found = asArray<Tag>(response.data).find((item) => item.id === id);

        if (!found && type) {
          const all = await api.get("/tag");
          found = asArray<Tag>(all.data).find((item) => item.id === id);
        }

        setTag(found);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(error, "Erro ao carregar a tag"),
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

  if (!tag) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <GoBack />
            <p>Tag não encontrada</p>
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
          <h1>Editar Tag</h1>
          <FormTag
            url={`/tag/${tag.id}`}
            method="edit"
            initialData={toForm(tag)}
            recordKey={tag.key}
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditTag;
