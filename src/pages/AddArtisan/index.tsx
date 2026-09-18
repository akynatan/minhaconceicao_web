import React from "react";

import FormArtisan from "../../components/FormArtisan";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddArtisan: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Novo Artesão</h1>
          <FormArtisan url="/artisans" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddArtisan;
