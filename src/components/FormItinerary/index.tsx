import React, { useCallback, useRef, useState } from "react";
import { FiArrowLeft, FiCalendar, FiSave, FiType } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import { CategoryType } from "../../enums/CategoryType";
import { TagType } from "../../enums/TagType";
import {
  ItineraryFormData,
  ItineraryItemForm,
} from "../../types/Itinerary";

import Input from "../Input";
import Textarea from "../Textarea";
import Select from "../Select";
import FileUpload from "../FileUpload";
import MultiSelectCategories from "../MultiSelectCategories";
import MultiSelectTags from "../MultiSelectTags";
import ItineraryItems from "../ItineraryItems";

import {
  Container,
  FormStep,
  StepNumber,
  StepTitle,
  StepContent,
  FormActions,
  BackButton,
  SaveButton,
} from "../FormPlaceToSleep/styles";

interface FormItineraryProps {
  initialData?: ItineraryFormData;
  method: "edit" | "add";
  url: string;
}

interface FormItinerarySubmit {
  name: string;
  slug?: string;
  description: string;
  duration?: string;
  difficulty?: string;
  bestSeason?: string;
  estimatedCost?: string;
  transport?: string;
  distance?: string;
  weight?: string;
  publishedAt?: string;
  categories?: string[];
  tags?: string[];
  coverImage?: string;
}

const DIFFICULTY_OPTIONS = [
  { label: "Fácil", value: "easy" },
  { label: "Moderado", value: "moderate" },
  { label: "Difícil", value: "hard" },
];

const DURATION_OPTIONS = [
  "Algumas horas",
  "Meio período",
  "1 dia",
  "Fim de semana",
  "3 dias ou mais",
].map((label) => ({ label, value: label }));

const emptyToNull = (value?: string | null) => {
  const trimmed = (value ?? "").trim();
  return trimmed || null;
};

const validateItems = (items: ItineraryItemForm[]) => {
  for (const [index, item] of items.entries()) {
    const label = `Item ${index + 1}`;

    if (
      (item.type === "heading" || item.type === "text") &&
      !item.content.trim()
    ) {
      return `${label}: o texto é obrigatório`;
    }

    if (item.type === "image" && !item.image) {
      return `${label}: a foto é obrigatória`;
    }

    if (
      item.type === "video" &&
      !/^https?:\/\//i.test(item.url.trim())
    ) {
      return `${label}: o vídeo precisa de uma URL http(s)`;
    }

    if (item.type === "link") {
      if (!item.resourceType) {
        return `${label}: escolha o tipo do link`;
      }

      if (
        item.resourceType === "url" &&
        !/^https?:\/\//i.test(item.url.trim())
      ) {
        return `${label}: o link externo precisa de uma URL http(s)`;
      }

      if (item.resourceType !== "url" && !item.resourceId) {
        return `${label}: escolha o lugar cadastrado`;
      }
    }
  }

  return "";
};

const FormItinerary: React.FC<FormItineraryProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [items, setItems] = useState<ItineraryItemForm[]>(
    initialData?.items || []
  );
  const [itemsError, setItemsError] = useState("");

  const handleSubmit = useCallback(
    async (data: FormItinerarySubmit) => {
      formRef.current?.setErrors({});
      setItemsError("");

      const itemError = validateItems(items);
      if (itemError) {
        setItemsError(itemError);
        return;
      }

      try {
        const schema = Yup.object().shape({
          name: Yup.string().trim().required("Nome do roteiro é obrigatório"),
          description: Yup.string()
            .trim()
            .required("Introdução do roteiro é obrigatória"),
          slug: Yup.string().trim(),
          duration: Yup.string().trim(),
          difficulty: Yup.string().test(
            "difficulty",
            "Dificuldade inválida",
            (value) =>
              !value || ["easy", "moderate", "hard"].includes(value)
          ),
          bestSeason: Yup.string().trim(),
          estimatedCost: Yup.string().trim(),
          transport: Yup.string().trim(),
          distance: Yup.string().trim(),
          weight: Yup.number()
            .transform((value, originalValue) =>
              originalValue === "" ||
              originalValue === undefined ||
              originalValue === null
                ? 0
                : value
            )
            .typeError("Peso inválido")
            .integer("Peso inválido")
            .min(0, "Peso inválido")
            .max(9999, "Peso inválido"),
          publishedAt: Yup.string().test(
            "date",
            "Data de publicação inválida",
            (value) => !value || !Number.isNaN(new Date(value).getTime())
          ),
          categories: Yup.array().of(Yup.string()),
          tags: Yup.array().of(Yup.string()),
          coverImage: Yup.string(),
        });

        const validated = await schema.validate(
          { ...data, categories: data.categories || [], tags: data.tags || [] },
          { abortEarly: false }
        );

        const jsonData = {
          name: validated.name,
          description: validated.description,
          ...(validated.slug ? { slug: validated.slug } : {}),
          coverImage: emptyToNull(validated.coverImage),
          duration: emptyToNull(validated.duration),
          difficulty: emptyToNull(validated.difficulty),
          bestSeason: emptyToNull(validated.bestSeason),
          estimatedCost: emptyToNull(validated.estimatedCost),
          transport: emptyToNull(validated.transport),
          distance: emptyToNull(validated.distance),
          weight: validated.weight ?? 0,
          publishedAt: validated.publishedAt
            ? new Date(validated.publishedAt).toISOString()
            : null,
          categories: (validated.categories || []).filter(
            (id): id is string => Boolean(id)
          ),
          tags: (validated.tags || []).filter((id): id is string => Boolean(id)),
          items: items.map((item) => ({
            type: item.type,
            content: emptyToNull(item.content),
            image: item.type === "image" ? emptyToNull(item.image) : null,
            url:
              item.type === "video" ||
              (item.type === "link" && item.resourceType === "url")
                ? emptyToNull(item.url)
                : null,
            resourceType: item.type === "link" ? item.resourceType : null,
            resourceId:
              item.type === "link" && item.resourceType !== "url"
                ? emptyToNull(item.resourceId)
                : null,
            linkLabel: item.type === "link" ? emptyToNull(item.linkLabel) : null,
          })),
        };

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        await methods[method]();

        addToast({
          type: "success",
          title: method === "add" ? "Roteiro cadastrado!" : "Roteiro atualizado!",
          description:
            method === "add"
              ? "Roteiro cadastrado com sucesso!"
              : "Roteiro atualizado com sucesso!",
        });
        navigate("/roteiros");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: "error",
          title: "Erro no cadastro",
          description: getApiErrorMessage(err, "Erro inesperado"),
        });
      }
    },
    [addToast, items, method, navigate, url]
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
            <StepTitle>Informações gerais</StepTitle>
            <Input name="name" icon={FiType} placeholder="Nome do roteiro" />
            <Input name="slug" placeholder="Slug (opcional)" />
            <Textarea
              name="description"
              placeholder="Introdução do roteiro"
              {...{ rows: 6 }}
            />
            <div className="form-grid">
              <Input
                name="publishedAt"
                type="datetime-local"
                icon={FiCalendar}
                placeholder="Data de publicação"
              />
              <Input
                name="weight"
                type="number"
                min={0}
                max={9999}
                step={1}
                placeholder="Peso (ordem, opcional)"
              />
            </div>
            <FileUpload
              name="coverImage"
              placeholder="Selecione a capa do roteiro"
              accept="image/*"
              maxSize={5}
              existingPhoto={
                initialData?.coverImage && initialData.coverImageUrl
                  ? {
                      key: initialData.coverImage,
                      photoUrl: initialData.coverImageUrl,
                    }
                  : undefined
              }
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Informações da visita</StepTitle>
            <div className="form-grid">
              <Select
                name="duration"
                placeholder="Duração"
                component="creatable"
                isClearable
                options={
                  initialData?.duration &&
                  !DURATION_OPTIONS.some(
                    (option) => option.value === initialData.duration
                  )
                    ? [
                        ...DURATION_OPTIONS,
                        {
                          label: initialData.duration,
                          value: initialData.duration,
                        },
                      ]
                    : DURATION_OPTIONS
                }
              />
              <Select
                name="difficulty"
                placeholder="Dificuldade"
                isClearable
                options={DIFFICULTY_OPTIONS}
                defaultValue={DIFFICULTY_OPTIONS.find(
                  (option) => option.value === initialData?.difficulty
                )}
              />
              <Input name="bestSeason" placeholder="Melhor época" />
              <Input name="estimatedCost" placeholder="Custo estimado" />
              <Input name="transport" placeholder="Deslocamento" />
              <Input name="distance" placeholder="Distância" />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Categorias</StepTitle>
            <MultiSelectCategories
              name="categories"
              placeholder="Selecione as categorias do roteiro"
              categoryType={CategoryType.ITINERARY}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Tags</StepTitle>
            <MultiSelectTags
              name="tags"
              placeholder="Selecione as tags do roteiro"
              tagType={TagType.ITINERARY}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Conteúdo</StepTitle>
            <ItineraryItems
              items={items}
              onChange={setItems}
              error={itemsError}
            />
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/roteiros")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Roteiro" : "Atualizar Roteiro"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormItinerary;
