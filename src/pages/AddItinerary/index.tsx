import React from "react";

import FormItinerary from "../../components/FormItinerary";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddItinerary: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Novo Roteiro</h1>
          <FormItinerary url="/itineraries" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddItinerary;
