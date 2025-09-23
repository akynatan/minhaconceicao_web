import React from "react";

import FormUser from "../../components/FormUser";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "./styles";

const AddUser: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />

          <h1>Novo Usuário</h1>

          <FormUser url="/users" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddUser;
