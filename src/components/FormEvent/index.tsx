import React, { useCallback, useRef } from "react";
import { FiArrowLeft, FiSave, FiType, FiCalendar, FiMapPin } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../Input";
import Textarea from "../Textarea";
import FileUploadMultiple from "../FileUploadMultiple";
import MultiSelectCategories from "../MultiSelectCategories";
import { CategoryType } from "../../enums/CategoryType";
import { EventFormData } from "../../types/Event";

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

interface FormEventProps {
  initialData?: EventFormData;
  method: "edit" | "add";
  url: string;
}

interface FormEventSubmit {
  name: string;
  description: string;
  date: string;
  location: string;
  address: string;
  latitude?: string | number;
  longitude?: string | number;
  categories?: string[];
  images?: string[];
}

const FormEvent: React.FC<FormEventProps> = ({ initialData, method, url }) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: FormEventSubmit) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          date: Yup.string().required("Data obrigatória"),
          location: Yup.string().required("Local obrigatório"),
          address: Yup.string().required("Endereço obrigatório"),
          latitude: Yup.string(),
          longitude: Yup.string(),
          categories: Yup.array(),
          images: Yup.array(),
        });

        await schema.validate(data, { abortEarly: false });

        const jsonData = {
          name: data.name,
          description: data.description,
          date: data.date ? new Date(data.date).toISOString() : undefined,
          location: data.location,
          address: data.address,
          latitude: data.latitude ? Number(data.latitude) : undefined,
          longitude: data.longitude ? Number(data.longitude) : undefined,
          isActive:
            method === "add" ? true : initialData?.isActive ?? true,
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
          title: "Evento salvo",
          description: "Evento cadastrado/alterado com sucesso!",
        });

        navigate("/eventos");
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
            <Input name="name" icon={FiType} placeholder="Nome do evento" />
            <Input
              name="date"
              type="datetime-local"
              icon={FiCalendar}
              placeholder="Data"
            />
            <Textarea
              name="description"
              placeholder="Descrição do evento"
              {...{ rows: 6 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Local</StepTitle>
            <Input
              name="location"
              icon={FiMapPin}
              placeholder="Local (ex.: Praça Central)"
            />
            <Input name="address" icon={FiMapPin} placeholder="Endereço" />
            <div className="form-flex">
              <Input
                name="latitude"
                type="number"
                icon={FiMapPin}
                placeholder="Latitude (opcional)"
                step="any"
              />
              <Input
                name="longitude"
                type="number"
                icon={FiMapPin}
                placeholder="Longitude (opcional)"
                step="any"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Categorias</StepTitle>
            <MultiSelectCategories
              name="categories"
              placeholder="Selecione as categorias"
              categoryType={CategoryType.EVENTS}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Imagens</StepTitle>
            <FileUploadMultiple
              name="images"
              placeholder="Selecione imagens do evento"
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
          <BackButton type="button" onClick={() => navigate("/eventos")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Evento" : "Atualizar Evento"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormEvent;
