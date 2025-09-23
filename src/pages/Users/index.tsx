/* eslint-disable no-alert */
import React, { useEffect, useState } from "react";

import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiPlusCircle } from "react-icons/fi";
import { Container, Content, HeaderPage } from "./styles";
import api from "../../services/api";
import { User } from "../../types/User";
import Button from "../../components/Button";

const roles = {
  admin: "Admin",
  seller: "Vendedor",
};

const Users: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Lista de Users</h1>
            <hr />
          </div>
          <Link to="/usuarios/add">
            <Button type="button">Adicionar Cliente</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <table>
          <thead>
            <tr className="table100-head">
              <th>Nome</th>
              <th>Email</th>
              <th>Função</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.id}>
                  <td className="column2">{user.name}</td>
                  <td className="column1">{user.email}</td>
                  <td className="column1">
                    {user.role ? roles[user.role] : "-"}
                  </td>
                  <td style={{ width: "50px" }}>
                    <Link
                      style={{
                        textDecoration: "none",
                        fontWeight: 600,
                        color: "#ff9000",
                      }}
                      to={`/usuarios/${user.id}`}
                      title="Editar Cliente"
                    >
                      <HiPencil />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isFetching && <p className="fetching">Carregando...</p>}
      </Content>
    </Container>
  );
};

export default Users;
