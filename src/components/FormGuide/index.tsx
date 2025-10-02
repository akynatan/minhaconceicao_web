import React, { useCallback, useRef } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiInstagram,
  FiArrowLeft,
  FiSave,
  FiAward,
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
import MultiSelectAttractions from "../MultiSelectAttractions";
import { Guide, CreateGuideData, UpdateGuideData } from "../../types/Guide";

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

interface FormGuideProps {
  initialData?: Guide;
  method: "edit" | "add";
  url: string;
}

const FormGuide: React.FC<FormGuideProps> = ({ initialData, method, url }) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  // Removido estado local de attractions - MultiSelectAttractions gerencia seu próprio estado

  const handleSubmit = useCallback(
    async (data: CreateGuideData | UpdateGuideData) => {
      formRef.current?.setErrors({});
      try {
        console.log("FormGuide - Todos os dados capturados pelo Unform:", data);
        const formDataWithAttractions = {
          ...data,
          // attractions será capturado diretamente pelo Unform do MultiSelectAttractions
        };

        console.log(
          "FormGuide - Dados do formulário:",
          formDataWithAttractions
        );
        console.log("FormGuide - Campo photo original:", data.photo);
        console.log("FormGuide - Tipo do campo photo:", typeof data.photo);
        console.log(
          "FormGuide - Campo photo é string vazia?",
          data.photo === ""
        );
        console.log(
          "FormGuide - Campo photo processado:",
          formDataWithAttractions.photo
        );

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          email: Yup.string()
            .email("Email inválido")
            .required("Email obrigatório"),
          whatsapp: Yup.string().required("WhatsApp obrigatório"),
          instagram: Yup.string(),
          experience: Yup.string(),
          specialties: Yup.string(),
          photo: Yup.string(),
          attractions: Yup.array(),
        });

        await schema.validate(formDataWithAttractions, {
          abortEarly: false,
        });

        const jsonData = {
          name: formDataWithAttractions.name,
          description: formDataWithAttractions.description,
          email: formDataWithAttractions.email,
          whatsapp: formDataWithAttractions.whatsapp,
          instagram: formDataWithAttractions.instagram,
          experience: formDataWithAttractions.experience,
          specialties: formDataWithAttractions.specialties,
          photo: formDataWithAttractions.photo,
          attractions: formDataWithAttractions.attractions,
        };

        console.log("FormGuide - JSON Data enviado:", jsonData);

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: "success",
            title: "Guia Cadastrado/Alterado!",
            description: "Guia cadastrado/alterado com sucesso!",
          });
        }

        navigate("/guias");
      } catch (err: any) {
        console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro no Cadastro/Atualização!",
          description: err.response?.data?.error || "Erro inesperado",
        });
      }
    },
    [addToast, url, method, navigate]
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
            <StepTitle>Informações Básicas</StepTitle>
            <Input name="name" icon={FiUser} placeholder="Nome do Guia" />
            <Textarea
              name="description"
              placeholder="Descreva o guia, sua experiência, especialidades..."
              {...{ rows: 4 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Contato</StepTitle>
            <div className="form-grid">
              <Input
                name="email"
                type="email"
                icon={FiMail}
                placeholder="Email"
                prefix="@"
              />
              <InputPhone
                name="whatsapp"
                icon={FiPhone}
                placeholder="WhatsApp"
              />
              <Input
                name="instagram"
                icon={FiInstagram}
                placeholder="instagram (opcional)"
                prefix="@"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Experiência e Especialidades</StepTitle>
            <div className="form-grid">
              <Input
                name="experience"
                icon={FiAward}
                placeholder="Anos de experiência (opcional)"
                prefix="+"
              />
            </div>
            <Textarea
              name="specialties"
              placeholder="Especialidades do guia (opcional)"
              {...{ rows: 3 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Atrações que Trabalha</StepTitle>
            <MultiSelectAttractions
              name="attractions"
              placeholder="Selecione as atrações que o guia trabalha"
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Foto do Guia</StepTitle>
            <FileUpload
              name="photo"
              placeholder="Selecione a foto do guia"
              accept="image/*"
              maxSize={5}
              existingPhoto={
                initialData?.photo && initialData?.photoUrl
                  ? {
                      key: initialData.photo,
                      photoUrl: initialData.photoUrl,
                    }
                  : undefined
              }
            />
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/guias")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>

          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Guia" : "Atualizar Guia"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormGuide;
