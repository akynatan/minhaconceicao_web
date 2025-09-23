import React, { useCallback, useRef } from "react";
import { FiMail, FiUser, FiLock, FiArrowLeft } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";

import userImg from "../../assets/user.png";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";
import { useAuth } from "../../hooks/auth";

import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AvatarInput } from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          old_password: Yup.string(),
          password: Yup.string().when(
            "old_password",
            (old_password, schema) => {
              return old_password
                ? schema.required("Campo obrigatório")
                : schema;
            }
          ),
          password_confirmation: Yup.string()
            .when("old_password", (old_password, schema) => {
              return old_password
                ? schema.required("Campo obrigatório")
                : schema;
            })
            .oneOf([Yup.ref("password"), undefined], "Confirmação incorreta"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, old_password, password, password_confirmation } =
          data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put("/profile", formData);

        if (response.data) {
          updateUser(response.data);

          addToast({
            type: "success",
            title: "Perfil atualizado!",
            description:
              "Suas informações do perfil foram atualizadas com sucesso!",
          });
        }

        navigate("/contratos");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro na atualização!",
          description: "Ocorreu um erro ao atualizar  perfil, tente novamente.",
        });
      }
    },
    [updateUser, addToast, navigate]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/clientes">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user?.name,
            email: user?.email,
          }}
          onSubmit={handleSubmit}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <AvatarInput>
            <img src={userImg} alt={user?.name} />
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha Atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova Senha"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar Senha"
          />
          <Button type="submit">Confirmar Mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
