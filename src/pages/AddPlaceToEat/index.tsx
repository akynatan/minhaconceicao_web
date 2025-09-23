import React from "react";

import FormPlaceToEat from "../../components/FormPlaceToEat";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "./styles";

const AddPlaceToEat: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />

          <h1>Novo Local para Comer</h1>

          <FormPlaceToEat url="/places-to-eat" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddPlaceToEat;
