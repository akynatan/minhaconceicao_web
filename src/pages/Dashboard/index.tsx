import React from "react";
import { Link } from "react-router";

import { Container, Content, Menu, MenuItem } from "./styles";

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Content>
        <Menu>
          <Link to="/clientes">
            <MenuItem>Clientes</MenuItem>
          </Link>
          <Link to="/">
            <MenuItem>Contratos</MenuItem>
          </Link>
          <Link to="/lugares-para-comer">
            <MenuItem>Lugares para Comer</MenuItem>
          </Link>
          <Link to="/lugares-para-dormir">
            <MenuItem>Lugares para Dormir</MenuItem>
          </Link>
          <Link to="/atracoes">
            <MenuItem>Atrações Turísticas</MenuItem>
          </Link>
          <Link to="/guias">
            <MenuItem>Guias</MenuItem>
          </Link>
        </Menu>
      </Content>
    </Container>
  );
};

export default Dashboard;
