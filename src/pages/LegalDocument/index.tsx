import React from "react";
import { Link } from "react-router";

import logoImg from "../../assets/logo.png";

import { Container, Content, Document, Header } from "./styles";

interface LegalDocumentProps {
  title: string;
  children: React.ReactNode;
}

const LegalDocument: React.FC<LegalDocumentProps> = ({ title, children }) => {
  return (
    <Container>
      <Content>
        <Header>
          <img src={logoImg} alt="Minha Conceição" />
          <h1>{title}</h1>
        </Header>
        <Document>{children}</Document>
        <Link to="/signin">Voltar ao login</Link>
      </Content>
    </Container>
  );
};

export default LegalDocument;
