import React from "react";

import FormGuide from "../../components/FormGuide";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "./styles";

const AddGuide: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />

          <h1>Novo Guia</h1>

          <FormGuide url="/guides" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddGuide;
