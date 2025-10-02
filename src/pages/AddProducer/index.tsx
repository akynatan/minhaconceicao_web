import React from "react";

import FormProducer from "../../components/FormProducer";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "./styles";

const AddProducer: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />

          <h1>Novo Produtor</h1>

          <FormProducer url="/producers" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddProducer;
