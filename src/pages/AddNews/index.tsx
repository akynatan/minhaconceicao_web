import React from "react";

import FormNews from "../../components/FormNews";
import GoBack from "../../components/GoBack";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddNews: React.FC = () => {
  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>Nova Notícia</h1>
          <FormNews url="/news" method="add" />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddNews;
