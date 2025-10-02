import React, { useRef, useCallback } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Navigate, useNavigate } from "react-router";

import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import logoImg from "../../assets/logo.png";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Container, Content, AnimationContainer } from "./styles";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          password: Yup.string().required("Senha obrigatória"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        navigate("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro na autenticação",
          description: "Ocorreu um erro ao fazer login, cheque as credenciais.",
        });
      }
    },
    [signIn, addToast, navigate]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Admin Bizz" />
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <h1>Faça seu Login</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit">Entrar</Button>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
