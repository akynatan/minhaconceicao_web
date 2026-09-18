import React from "react";

import FormEvent from "../../components/FormEvent";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddEvent: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Novo Evento</h1>
          <FormEvent url="/events" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddEvent;
