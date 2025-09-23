import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import api from "../../services/api";

import FormUser from "../../components/FormUser";
import GoBack from "../../components/GoBack";

import { User } from "../../types";

import { Container, ContentPage, Content } from "./styles";

const roles = {
  admin: "Admin",
  seller: "Vendedor",
};

const EditUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/users/${id}`).then((response) => {
      setUser(response.data);
    });
  }, [id]);

  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />

          <h1>Editar Usuário</h1>

          <FormUser
            initialData={{
              name: user?.name,
              email: user?.email,
              password: user?.password,
              role: user?.role
                ? {
                    label: roles[user?.role],
                    value: user?.role,
                  }
                : null,
            }}
            url={`/users/${id}`}
            method="edit"
          />
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditUser;
