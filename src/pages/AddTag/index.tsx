import React from "react";
import { useSearchParams } from "react-router";

import FormTag from "../../components/FormTag";
import GoBack from "../../components/GoBack";
import { TagType, isTagType } from "../../enums/TagType";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddTag: React.FC = () => {
  const [params] = useSearchParams();
  const typeParam = params.get("type");
  const type = isTagType(typeParam) ? typeParam : TagType.PLACE_TO_EAT;

  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Nova Tag</h1>
          <FormTag
            url="/tag"
            method="add"
            initialData={{
              name: "",
              icon: "",
              type,
              colorPrimary: "#198653",
              colorSecondary: "#E6F4EE",
              weight: "0",
            }}
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddTag;
