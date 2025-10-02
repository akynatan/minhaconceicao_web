import React from "react";
import { Container, Content, HeaderPage } from "./styles";
import FormJob from "../../components/FormJob";
import GoBack from "../../components/GoBack";

const AddJob: React.FC = () => {
  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <GoBack />
            <h1>Nova Vaga de Emprego</h1>
            <hr />
          </div>
        </HeaderPage>

        <FormJob method="add" />
      </Content>
    </Container>
  );
};

export default AddJob;
