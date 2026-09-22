import React, { useCallback, useRef } from "react";
import { FiArrowLeft, FiSave, FiType, FiCalendar } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../Input";
import Textarea from "../Textarea";
import Select from "../Select";
import FileUploadMultiple from "../FileUploadMultiple";
import MultiSelectCategories from "../MultiSelectCategories";
import { CategoryType } from "../../enums/CategoryType";
import { NewsFormData } from "../../types/News";

import {
  Container,
  FormStep,
  StepNumber,
  StepTitle,
  StepContent,
  FormActions,
  BackButton,
  SaveButton,
} from "../FormProducer/styles";

interface FormNewsProps {
  initialData?: NewsFormData;
  method: "edit" | "add";
  url: string;
}

interface FormNewsSubmit {
  name: string;
  description: string;
  date: string;
  kind?: "news" | "guide";
  categories?: string[];
  images?: string[];
}

const KIND_OPTIONS = [
  { label: "Notícia", value: "news" },
  { label: "Guia", value: "guide" },
];

const FormNews: React.FC<FormNewsProps> = ({ initialData, method, url }) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: FormNewsSubmit) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Título obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          date: Yup.string().required("Data obrigatória"),
          kind: Yup.string().oneOf(["news", "guide"]),
          categories: Yup.array(),
          images: Yup.array(),
        });

        await schema.validate(data, { abortEarly: false });

        const jsonData = {
          name: data.name,
          description: data.description,
          date: data.date ? new Date(data.date).toISOString() : undefined,
          kind: data.kind || "news",
          isActive: method === "add" ? true : initialData?.isActive ?? true,
          categoryIds: data.categories || [],
          images: data.images || [],
        };

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        await methods[method]();

        addToast({
          type: "success",
          title: "Notícia salva",
          description: "Notícia cadastrada/alterada com sucesso!",
        });

        navigate("/noticias");
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: "error",
          title: "Erro no cadastro",
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
            <StepTitle>Informações</StepTitle>
            <Input name="name" icon={FiType} placeholder="Título da notícia" />
            <div className="form-grid">
              <Input
                name="date"
                type="datetime-local"
                icon={FiCalendar}
                placeholder="Data"
              />
              <Select
                name="kind"
                placeholder="Tipo"
                options={KIND_OPTIONS}
                defaultValue={
                  KIND_OPTIONS.find(
                    (option) => option.value === (initialData?.kind || "news")
                  ) || KIND_OPTIONS[0]
                }
              />
            </div>
            <Textarea
              name="description"
              placeholder="Conteúdo da notícia"
              {...{ rows: 8 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Categorias</StepTitle>
            <MultiSelectCategories
              name="categories"
              placeholder="Selecione as categorias"
              categoryType={CategoryType.NEWS}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Imagens</StepTitle>
            <FileUploadMultiple
              name="images"
              placeholder="Selecione imagens da notícia"
              accept="image/*"
              maxSize={5}
              existingImages={
                initialData?.images?.map((img) => ({
                  key: img.image,
                  imageUrl: img.imageUrl,
                  name: img.image,
                })) || []
              }
            />
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/noticias")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Notícia" : "Atualizar Notícia"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormNews;
