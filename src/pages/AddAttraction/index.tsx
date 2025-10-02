import React from "react";

import FormAttraction from "../../components/FormAttraction";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "./styles";

const AddAttraction: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />

          <h1>Nova Atração Turística</h1>

          <FormAttraction url="/attractions" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddAttraction;
