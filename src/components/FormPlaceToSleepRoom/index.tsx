import React, { useCallback, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiHome, FiSave } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import { TagType } from "../../enums/TagType";
import {
  PlaceToSleepRoomImage,
  PlaceToSleepRoomRuleInput,
} from "../../types/PlaceToSleepRoom";

import Input from "../Input";
import Textarea from "../Textarea";
import MultiSelectTags from "../MultiSelectTags";
import FileUploadMultiple from "../FileUploadMultiple";
import PlaceToSleepRoomRules from "../PlaceToSleepRoomRules";

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

interface FormPlaceToSleepRoomData {
  name: string;
  description: string;
  capacity: string;
  beds: string;
  slug?: string;
  position?: string;
  tags?: string[];
  images?: string[];
}

export interface FormPlaceToSleepRoomInitialData {
  name?: string;
  description?: string;
  capacity?: string;
  beds?: string;
  slug?: string;
  position?: string;
  tags?: string[];
  images?: PlaceToSleepRoomImage[];
  rules?: PlaceToSleepRoomRuleInput[];
}

interface FormPlaceToSleepRoomProps {
  initialData?: FormPlaceToSleepRoomInitialData;
  method: "edit" | "add";
  url: string;
  placeToSleepId: string;
}

interface RoomRulePayload {
  text: string;
  isAllowed: boolean;
  icon?: string;
}

const FormPlaceToSleepRoom: React.FC<FormPlaceToSleepRoomProps> = ({
  initialData,
  method,
  url,
  placeToSleepId,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [rules, setRules] = useState<PlaceToSleepRoomRuleInput[]>(
    initialData?.rules || []
  );
  const [rulesError, setRulesError] = useState("");

  const roomsPath = `/lugares-para-dormir/${placeToSleepId}/quartos`;

  const formInitialData = useMemo(
    () => ({
      name: initialData?.name || "",
      description: initialData?.description || "",
      capacity: initialData?.capacity || "",
      beds: initialData?.beds || "",
      slug: initialData?.slug || "",
      position: initialData?.position ?? "0",
      tags: initialData?.tags || [],
    }),
    [initialData]
  );

  const existingImages = useMemo(
    () =>
      initialData?.images?.map((image) => ({
        key: image.image,
        imageUrl: image.imageUrl,
        name: image.image,
      })) || [],
    [initialData]
  );

  const handleSubmit = useCallback(
    async (data: FormPlaceToSleepRoomData) => {
      formRef.current?.setErrors({});
      setRulesError("");

      try {
        const formData = {
          ...data,
          images: data.images || [],
          tags: data.tags || [],
          rules,
        };

        const schema = Yup.object().shape({
          name: Yup.string().trim().required("Nome obrigatório"),
          description: Yup.string().trim().required("Descrição obrigatória"),
          capacity: Yup.number()
            .typeError("Capacidade deve ser um número de 1 a 99")
            .integer("Capacidade deve ser um número inteiro")
            .min(1, "Capacidade mínima é 1")
            .max(99, "Capacidade máxima é 99")
            .required("Capacidade obrigatória"),
          beds: Yup.string().trim().required("Camas obrigatórias"),
          slug: Yup.string().trim(),
          position: Yup.number()
            .transform((value, originalValue) =>
              originalValue === "" ||
              originalValue === undefined ||
              originalValue === null
                ? 0
                : value
            )
            .typeError("Posição deve ser um número")
            .integer("Posição deve ser um número inteiro")
            .min(0, "Posição mínima é 0"),
          tags: Yup.array().of(Yup.string()),
          images: Yup.array().of(Yup.string()),
          rules: Yup.array().of(
            Yup.object().shape({
              text: Yup.string().trim().required("Informe o texto da regra"),
              isAllowed: Yup.boolean().required(),
              icon: Yup.string().trim(),
            })
          ),
        });

        const validated = await schema.validate(formData, {
          abortEarly: false,
        });

        const rulePayload: RoomRulePayload[] = (validated.rules || []).map(
          (rule) => {
            const item: RoomRulePayload = {
              text: rule.text || "",
              isAllowed: Boolean(rule.isAllowed),
            };

            if (rule.icon) {
              item.icon = rule.icon;
            }

            return item;
          }
        );

        const jsonData: {
          placeToSleepId: string;
          name: string;
          description: string;
          capacity: number;
          beds: string;
          images: string[];
          tags: string[];
          rules: RoomRulePayload[];
          position: number;
          slug?: string;
        } = {
          placeToSleepId,
          name: validated.name,
          description: validated.description,
          capacity: validated.capacity,
          beds: validated.beds,
          images: (validated.images || []).filter(
            (image): image is string => Boolean(image)
          ),
          tags: (validated.tags || []).filter((tag): tag is string =>
            Boolean(tag)
          ),
          rules: rulePayload,
          position: validated.position ?? 0,
        };

        if (validated.slug) {
          jsonData.slug = validated.slug;
        }

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        const response = await methods[method]();

        if (response.status >= 200 && response.status < 300) {
          addToast({
            type: "success",
            title: method === "add" ? "Quarto cadastrado!" : "Quarto atualizado!",
            description:
              method === "add"
                ? "Quarto cadastrado com sucesso!"
                : "Quarto atualizado com sucesso!",
          });
        }

        navigate(roomsPath);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          const ruleError = err.inner.find((error) =>
            error.path?.startsWith("rules")
          );
          if (ruleError?.message) {
            setRulesError(ruleError.message);
          }
          return;
        }

        addToast({
          type: "error",
          title: "Erro no Cadastro/Atualização!",
          description: getApiErrorMessage(err, "Erro inesperado"),
        });
      }
    },
    [addToast, method, navigate, placeToSleepId, roomsPath, rules, url]
  );

  return (
    <Container>
      <Form
        initialData={formInitialData}
        ref={formRef}
        onSubmit={handleSubmit}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <FormStep>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Nome do Quarto</StepTitle>
            <Input name="name" icon={FiHome} placeholder="Nome do quarto" />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Descrição</StepTitle>
            <Textarea
              name="description"
              placeholder="Descreva o quarto"
              {...{ rows: 6 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Capacidade e camas</StepTitle>
            <div className="form-grid">
              <Input
                name="capacity"
                type="number"
                min={1}
                max={99}
                step={1}
                placeholder="Capacidade (1 a 99 hóspedes)"
              />
              <Input name="beds" placeholder="Camas, ex.: Cama de casal" />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Slug e posição</StepTitle>
            <p className="hint">
              O slug é opcional e único nesta hospedagem. A posição define a
              ordem: o menor número aparece primeiro.
            </p>
            <div className="form-flex">
              <Input name="slug" placeholder="Slug (opcional)" />
              <Input
                name="position"
                type="number"
                min={0}
                step={1}
                placeholder="Posição"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Comodidades</StepTitle>
            <MultiSelectTags
              name="tags"
              placeholder="Selecione as comodidades do quarto"
              tagType={TagType.PLACE_TO_SLEEP_ROOM}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>6</StepNumber>
          <StepContent>
            <StepTitle>Fotos</StepTitle>
            <p className="hint">
              A primeira imagem é a foto de capa do quarto.
            </p>
            <FileUploadMultiple
              name="images"
              placeholder="Selecione imagens ou arraste os arquivos aqui."
              accept="image/*"
              maxSize={5}
              existingImages={existingImages}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>7</StepNumber>
          <StepContent>
            <StepTitle>Incluso e regras</StepTitle>
            <PlaceToSleepRoomRules
              rules={rules}
              onChange={setRules}
              error={rulesError}
            />
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate(roomsPath)}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>

          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Quarto" : "Atualizar Quarto"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormPlaceToSleepRoom;
