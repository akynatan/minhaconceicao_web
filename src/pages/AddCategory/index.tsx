import React from "react";
import { useSearchParams } from "react-router";

import FormCategory from "../../components/FormCategory";
import GoBack from "../../components/GoBack";
import { CategoryType, isCategoryType } from "../../enums/CategoryType";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddCategory: React.FC = () => {
  const [params] = useSearchParams();
  const typeParam = params.get("type");
  const type = isCategoryType(typeParam) ? typeParam : CategoryType.ATTRACTIONS;

  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Nova Categoria</h1>
          <FormCategory
            url="/category"
            method="add"
            initialData={{
              name: "",
              description: "",
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

export default AddCategory;
