import React, { useCallback, useRef } from "react";
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiGlobe,
  FiArrowLeft,
  FiSave,
  FiMapPin,
} from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../Input";
import InputPhone from "../InputPhone";
import Textarea from "../Textarea";
import FileUpload from "../FileUpload";
import {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
} from "../../types/Company";

import {
  Container,
  FormStep,
  StepNumber,
  StepTitle,
  StepContent,
  FormActions,
  BackButton,
  SaveButton,
} from "./styles";

interface FormCompanyProps {
  initialData?: Company;
  method: "edit" | "add";
}

const FormCompany: React.FC<FormCompanyProps> = ({ initialData, method }) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: CreateCompanyData | UpdateCompanyData) => {
      formRef.current?.setErrors({});
      try {
        console.log("FormCompany - Dados capturados:", data);

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          description: Yup.string(),
          email: Yup.string().email("Email inválido"),
          phone: Yup.string(),
          website: Yup.string().url("Website deve ser uma URL válida"),
          address: Yup.string(),
          city: Yup.string(),
          state: Yup.string(),
          zipCode: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (method === "add") {
          await api.post("/companies", data);
          addToast({
            type: "success",
            title: "Empresa criada",
            description: "Empresa criada com sucesso!",
          });
        } else {
          await api.put(`/companies/${initialData!.id}`, data);
          addToast({
            type: "success",
            title: "Empresa atualizada",
            description: "Empresa atualizada com sucesso!",
          });
        }

        navigate("/empresas");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        console.error("Erro:", err);
        addToast({
          type: "error",
          title: "Erro",
          description: `Erro ao ${
            method === "add" ? "criar" : "atualizar"
          } empresa.`,
        });
      }
    },
    [addToast, method, navigate, initialData]
  );

  return (
    <Container>
      <Form
        initialData={initialData}
        ref={formRef}
        onSubmit={handleSubmit}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <FormStep>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Nome da Empresa</StepTitle>
            <Input
              name="name"
              placeholder="Nome da empresa"
              icon={FiBriefcase}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Descrição</StepTitle>
            <Textarea
              name="description"
              placeholder="Descreva a empresa, seus serviços, missão..."
              {...{ rows: 6 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Logo da Empresa</StepTitle>
            <FileUpload
              name="logo"
              placeholder="Selecione o logo da empresa"
              accept="image/*"
              maxSize={5}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Contato</StepTitle>
            <div className="form-grid">
              <Input name="email" placeholder="Email" icon={FiMail} />
              <InputPhone name="phone" placeholder="Telefone" icon={FiPhone} />
              <Input
                name="website"
                placeholder="Website"
                icon={FiGlobe}
                prefix="https://"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Endereço</StepTitle>
            <Input
              name="address"
              placeholder="Endereço completo"
              icon={FiMapPin}
            />
            <div className="form-grid">
              <Input name="city" placeholder="Cidade" />
              <Input name="state" placeholder="Estado" />
              <Input name="zipCode" placeholder="CEP" />
            </div>
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/empresas")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Criar Empresa" : "Salvar Alterações"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormCompany;
