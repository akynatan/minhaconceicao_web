/* eslint-disable no-alert */
import React, { useEffect, useState } from "react";

import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiPlusCircle } from "react-icons/fi";
import { Container, Content, HeaderPage } from "./styles";
import api from "../../services/api";
import { User } from "../../types/User";
import Button from "../../components/Button";
import { useToast } from "../../hooks/toast";

const roles: Record<string, string> = {
  admin: "Admin",
  seller: "Vendedor",
  user: "App",
};

const Users: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const { addToast } = useToast();

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

  const handleToggleBlocked = async (user: User) => {
    const action = user.blocked ? "desbloquear" : "bloquear";
    const confirmed = window.confirm(
      `Deseja ${action} o usuário ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await api.patch(`/users/${user.id}/toggle-blocked`);

      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? response.data : item))
      );

      addToast({
        type: "success",
        title: user.blocked ? "Usuário desbloqueado" : "Usuário bloqueado",
        description: user.blocked
          ? "O usuário poderá acessar o aplicativo novamente."
          : "O usuário não poderá mais acessar o aplicativo.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Erro ao alterar bloqueio",
        description: "Não foi possível alterar o status do usuário.",
      });
    }
  };

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
              <th>Status</th>
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
                    {user.role ? roles[user.role] ?? user.role : "-"}
                  </td>
                  <td className="column1">
                    <span
                      className={
                        user.blocked ? "status-blocked" : "status-active"
                      }
                    >
                      {user.blocked ? "Bloqueado" : "Ativo"}
                    </span>
                  </td>
                  <td style={{ width: "140px" }}>
                    <div className="actions-cell">
                      {user.role === "user" && (
                        <button
                          type="button"
                          className={`block-button${
                            user.blocked ? " unlock" : ""
                          }`}
                          onClick={() => handleToggleBlocked(user)}
                        >
                          {user.blocked ? "Desbloquear" : "Bloquear"}
                        </button>
                      )}
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
                    </div>
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
