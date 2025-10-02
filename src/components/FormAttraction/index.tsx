import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  FiMapPin,
  FiClock,
  FiTrendingUp,
  FiTag,
  FiArrowLeft,
  FiSave,
} from "react-icons/fi";
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
import FileUpload from "../FileUpload";
import FileUploadMultiple from "../FileUploadMultiple";
import ScheduleForm, { ScheduleData } from "../ScheduleForm";
import { CategoryType } from "../../enums/CategoryType";

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
import { Attraction } from "../../types/Attraction";
import { DIFICULTY_OPTIONS } from "../../enums/Dificulty";

interface FormAttractionData {
  name: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
  distance: number;
  howToArrive: string;
  elevationGain?: number;
  tags?: string;
  categoryId: string;
  photo?: string;
  images: string[];
  schedules: ScheduleData[];
}

interface FormAttractionProps {
  initialData?: Attraction;
  method: "edit" | "add";
  url: string;
}

const FormAttraction: React.FC<FormAttractionProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  useEffect(() => {
    if (initialData?.schedules) {
      const mappedSchedules = initialData.schedules.map((schedule: any) => ({
        dayOfWeek: schedule.dayOfWeek,
        openingTime: schedule.openingTime || "08:00",
        closingTime: schedule.closingTime || "18:00",
        isClosed: schedule.isClosed || false,
      }));
      setSchedules(mappedSchedules);
    }
  }, [initialData]);

  const handleSubmit = useCallback(
    async (data: FormAttractionData) => {
      formRef.current?.setErrors({});
      try {
        const formDataWithSchedules = {
          ...data,
          schedules: schedules,
          images: data.images || [],
        };

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          difficulty: Yup.string()
            .oneOf(["easy", "medium", "hard"], "Dificuldade inválida")
            .required("Dificuldade obrigatória"),
          estimatedTime: Yup.number()
            .positive("Tempo estimado deve ser positivo")
            .required("Tempo estimado obrigatório"),
          distance: Yup.number()
            .positive("Distância deve ser positiva")
            .required("Distância obrigatória"),
          howToArrive: Yup.string().required("Como chegar obrigatório"),
          elevationGain: Yup.number()
            .positive("Elevação deve ser positiva")
            .nullable(),
          tags: Yup.string(),
          categoryId: Yup.string().required("Categoria obrigatória"),
          photo: Yup.string(),
          images: Yup.array(),
          schedules: Yup.array(),
        });

        await schema.validate(formDataWithSchedules, {
          abortEarly: false,
        });

        const jsonData = {
          name: formDataWithSchedules.name,
          description: formDataWithSchedules.description,
          difficulty: formDataWithSchedules.difficulty,
          estimatedTime: formDataWithSchedules.estimatedTime,
          distance: formDataWithSchedules.distance,
          howToArrive: formDataWithSchedules.howToArrive,
          elevationGain: formDataWithSchedules.elevationGain,
          tags: formDataWithSchedules.tags,
          categoryId: formDataWithSchedules.categoryId,
          photo: formDataWithSchedules.photo,
          images: formDataWithSchedules.images,
          schedules: formDataWithSchedules.schedules,
        };

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: "success",
            title: "Atração Cadastrada/Alterada!",
            description: "Atração cadastrada/alterada com sucesso!",
          });
        }

        navigate("/atracoes");
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
    [addToast, url, method, navigate, schedules]
  );

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    api
      .get(`/category?type=${CategoryType.ATTRACTIONS}`)
      .then((res) => {
        const categoryOptions = res.data.map((category: any) => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(categoryOptions);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar categorias",
        });
      });
  }, [addToast]);

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
            <Input name="name" icon={FiMapPin} placeholder="Nome da Atração" />
            <Textarea
              name="description"
              placeholder="Descreva a atração, suas características, o que o visitante pode esperar..."
              {...{ rows: 6 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Categoria</StepTitle>
            <Select
              name="categoryId"
              options={categories}
              placeholder="Selecione a categoria da atração"
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Características da Atração</StepTitle>
            <div className="form-grid">
              <Select
                name="difficulty"
                options={DIFICULTY_OPTIONS}
                placeholder="Selecione a dificuldade"
                defaultValue={
                  initialData?.difficulty
                    ? DIFICULTY_OPTIONS.find(
                        (option) => option.value === initialData.difficulty
                      )
                    : undefined
                }
              />
              <Input
                name="estimatedTime"
                type="number"
                icon={FiClock}
                placeholder="Tempo estimado (minutos)"
              />
              <Input
                name="distance"
                type="number"
                icon={FiMapPin}
                placeholder="Distância (metros)"
              />
              <Input
                name="elevationGain"
                type="number"
                icon={FiTrendingUp}
                placeholder="Elevação (metros) - opcional"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Como Chegar</StepTitle>
            <Textarea
              name="howToArrive"
              placeholder="Descreva como chegar à atração, instruções detalhadas, pontos de referência..."
              {...{ rows: 4 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Tags</StepTitle>
            <Input
              name="tags"
              icon={FiTag}
              placeholder="Tags (separadas por vírgula)"
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>6</StepNumber>
          <StepContent>
            <StepTitle>Foto Principal</StepTitle>
            <FileUpload
              name="photo"
              placeholder="Selecione a foto principal da atração"
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

        <FormStep>
          <StepNumber>7</StepNumber>
          <StepContent>
            <StepTitle>Horários de Funcionamento</StepTitle>
            <ScheduleForm
              name="schedules"
              schedules={schedules}
              onChange={setSchedules}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>8</StepNumber>
          <StepContent>
            <StepTitle>Imagens</StepTitle>
            <FileUploadMultiple
              name="images"
              placeholder="Selecione imagens ou arraste os arquivos aqui."
              accept="image/*"
              maxSize={5}
              existingImages={
                initialData?.images?.map((img) => {
                  return {
                    key: img.image,
                    imageUrl: img.imageUrl,
                    name: img.image,
                  };
                }) || []
              }
            />
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/atracoes")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>

          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Atração" : "Atualizar Atração"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormAttraction;
