import React from "react";
import { Container, Content, HeaderPage } from "./styles";
import FormCompany from "../../components/FormCompany";
import GoBack from "../../components/GoBack";

const AddCompany: React.FC = () => {
  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <GoBack />
            <h1>Nova Empresa</h1>
            <hr />
          </div>
        </HeaderPage>

        <FormCompany method="add" />
      </Content>
    </Container>
  );
};

export default AddCompany;
