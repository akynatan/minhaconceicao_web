import React, { useCallback, useRef, useState } from "react";
import { FiArrowLeft, FiSave, FiTag, FiType } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import Input from "../Input";
import Textarea from "../Textarea";
import Select from "../Select";
import ColorField from "../ColorField";
import IconField from "../IconField";
import {
  CategoryType,
  categoryTypeOptions,
} from "../../enums/CategoryType";
import { isLucideNativeIcon } from "../../utils/lucideNativeIcons";

import {
  Container,
  FormActions,
  BackButton,
  FormStep,
  SaveButton,
  StepContent,
  StepNumber,
  StepTitle,
} from "../FormProducer/styles";

export interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  type: string;
  colorPrimary: string;
  colorSecondary: string;
  weight: string;
}

interface FormCategoryProps {
  initialData?: CategoryFormData;
  recordKey?: string;
  method: "edit" | "add";
  url: string;
}

const PRIMARY = "#198653";
const SECONDARY = "#E6F4EE";

const schema = Yup.object().shape({
  name: Yup.string().trim().required("Nome obrigatório"),
  description: Yup.string().trim(),
  icon: Yup.string()
    .trim()
    .required("Ícone obrigatório")
    .test(
      "native-lucide",
      "Escolha um ícone Lucide que existe no aplicativo",
      (value) => isLucideNativeIcon(value)
    ),
  type: Yup.string()
    .oneOf(Object.values(CategoryType), "Tipo inválido")
    .required("Tipo obrigatório"),
  colorPrimary: Yup.string()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/, "Use uma cor no formato #RRGGBB")
    .required("Cor primária obrigatória"),
  colorSecondary: Yup.string()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/, "Use uma cor no formato #RRGGBB")
    .required("Cor secundária obrigatória"),
  weight: Yup.number()
    .transform((_value, original) => {
      if (original === "" || original === null || original === undefined) {
        return 0;
      }
      return Number(original);
    })
    .typeError("Peso deve ser um número")
    .integer("Peso deve ser um número inteiro")
    .min(0, "Peso não pode ser negativo")
    .required("Peso obrigatório"),
});

const FormCategory: React.FC<FormCategoryProps> = ({
  initialData,
  recordKey,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [colors, setColors] = useState({
    primary: initialData?.colorPrimary || PRIMARY,
    secondary: initialData?.colorSecondary || SECONDARY,
  });

  const handleSubmit = useCallback(
    async (data: CategoryFormData) => {
      formRef.current?.setErrors({});

      try {
        const validated = await schema.validate(data, { abortEarly: false });

        const description = validated.description?.trim() ?? "";
        const payload = {
          name: validated.name.trim(),
          description: description || null,
          icon: validated.icon.trim(),
          type: validated.type,
          colorPrimary: validated.colorPrimary.trim().toUpperCase(),
          colorSecondary: validated.colorSecondary.trim().toUpperCase(),
          weight: validated.weight,
        };

        if (method === "edit") {
          await api.put(url, payload);
        } else {
          await api.post(url, payload);
        }

        addToast({
          type: "success",
          title: method === "add" ? "Categoria criada" : "Categoria atualizada",
          description: "Categoria salva com sucesso",
        });

        navigate(`/categorias?type=${encodeURIComponent(payload.type)}`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: "error",
          title: "Erro ao salvar",
          description: getApiErrorMessage(err, "Erro ao salvar a categoria"),
        });
      }
    },
    [addToast, method, navigate, url]
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
            <StepTitle>Identificação</StepTitle>
            <Input name="name" icon={FiType} placeholder="Nome da categoria" />
            <div className="form-grid">
              <Select
                name="type"
                placeholder="Tipo"
                options={categoryTypeOptions}
                isDisabled={method === "edit"}
              />
              <Input
                name="weight"
                type="number"
                min={0}
                step={1}
                icon={FiTag}
                placeholder="Peso (maior aparece primeiro)"
              />
            </div>
            <Textarea
              name="description"
              placeholder="Descrição (opcional)"
              rows={4}
            />
            {method === "edit" && (
              <p>
                O tipo não pode ser alterado.
                {recordKey ? (
                  <>
                    {" "}
                    Chave <code>{recordKey}</code>.
                  </>
                ) : null}
              </p>
            )}
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Aparência</StepTitle>
            <IconField
              name="icon"
              color={colors.primary}
              background={colors.secondary}
            />
            <div className="form-grid">
              <ColorField
                name="colorPrimary"
                label="Cor primária"
                fallback={PRIMARY}
                onChange={(primary) =>
                  setColors((current) => ({ ...current, primary }))
                }
              />
              <ColorField
                name="colorSecondary"
                label="Cor secundária"
                fallback={SECONDARY}
                onChange={(secondary) =>
                  setColors((current) => ({ ...current, secondary }))
                }
              />
            </div>
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/categorias")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Categoria" : "Atualizar Categoria"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormCategory;
