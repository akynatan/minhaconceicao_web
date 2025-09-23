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
          <Link to="/contratos">
            <MenuItem>Contratos</MenuItem>
          </Link>
        </Menu>
      </Content>
    </Container>
  );
};

export default Dashboard;
