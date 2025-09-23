import React, { useCallback, useRef } from "react";
import { FiMail, FiUser, FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";

import getValidationErrors from "../../utils/getValidationErrors";

import Select from "../Select";
import Input from "../Input";
import Button from "../Button";

import { FormGroup, FormGroupBlock } from "./styles";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Vendedor", value: "seller" },
];

interface AddUserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  new_password?: string;
}

interface FormUserProps {
  initialData?: any;
  method: "edit" | "add";
  url: string;
}

const FormUser: React.FC<FormUserProps> = ({ initialData, method, url }) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: AddUserFormData) => {
      formRef.current?.setErrors({});
      try {
        const shapes: any = {
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          role: Yup.string().required("Papel obrigatório"),
        };

        if (method === "add") {
          shapes.password = Yup.string().required("Senha obrigatório");
        }

        if (method === "edit") {
          shapes.new_password = Yup.string();
        }

        const schema = Yup.object().shape(shapes);

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, password, role, new_password } = data;

        const formData: any = {
          name,
          email,
          role: role !== "" ? role : null,
        };

        if (method === "add") {
          formData.password = password;
        }

        if (method === "edit") {
          formData.new_password = new_password !== "" ? new_password : null;
        }

        const methods = {
          edit: async () => api.put(url, formData),
          add: async () => api.post(url, formData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: "success",
            title: "Usuário Cadastrado/Alterado!",
            description: "Novo usuário cadastrado/alterado com sucesso!",
          });
        }

        navigate("/usuarios");
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro no Cadastro/Atualização!",
          description: err.response?.data?.error,
        });
      }
    },
    [addToast, url, method]
  );

  return (
    <Form
      initialData={initialData}
      ref={formRef}
      onSubmit={handleSubmit}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <FormGroup>
        <FormGroupBlock>
          <h2>Dados pessoais:</h2>
          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="Email" />
          {method === "add" && (
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
          )}
          <Select name="role" placeholder="Tipo" options={roles} />
          {method === "edit" && (
            <Input
              name="new_password"
              icon={FiLock}
              type="password"
              placeholder="Nova Senha (reset)"
            />
          )}
        </FormGroupBlock>
      </FormGroup>

      <div>
        <Button type="submit">Atualizar Usuário</Button>
      </div>
    </Form>
  );
};

export default FormUser;
