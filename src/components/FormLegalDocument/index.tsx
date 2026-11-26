import React, { useCallback, useRef, useState } from "react";
import { FiArrowLeft, FiHash, FiSave, FiType } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import {
  LegalDocument,
  LegalDocumentType,
} from "../../types/LegalDocument";
import {
  confirmPublishLegalDocument,
  formatAcceptanceCount,
  LEGAL_DOCUMENT_TYPE_LABEL,
  LEGAL_DOCUMENT_TYPE_OPTIONS,
} from "../../utils/legalDocument";

import Input from "../Input";
import Textarea from "../Textarea";
import Select from "../Select";
import LegalDocumentPreview from "../LegalDocumentPreview";

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

import {
  ActionGroup,
  FieldHint,
  Notice,
  PreviewBlock,
  PublishButton,
  PublishHint,
  ReadOnlyGrid,
} from "./styles";

interface LegalDocumentFormData {
  type?: LegalDocumentType;
  version?: number | string;
  title: string;
  content: string;
}

interface ValidatedDraft {
  title: string;
  content: string;
}

interface ValidatedCreate extends ValidatedDraft {
  type: LegalDocumentType;
  version: number;
}

interface FormLegalDocumentProps {
  method: "add" | "edit";
  url: string;
  initialData?: {
    type?: LegalDocumentType;
    version?: number;
    title?: string;
    content?: string;
  };
  acceptanceCount?: number;
  notice?: string;
  onPublished?: (document: LegalDocument) => void;
}

const buildSchema = (method: "add" | "edit") => {
  const title = Yup.string()
    .trim()
    .max(255, "Título é longo demais")
    .required("Título é obrigatório");
  const content = Yup.string()
    .trim()
    .max(100000, "Conteúdo é longo demais")
    .required("Conteúdo é obrigatório");

  if (method === "edit") {
    return Yup.object().shape({ title, content });
  }

  return Yup.object().shape({
    type: Yup.string()
      .oneOf(
        ["terms_of_use", "privacy_policy"],
        "Tipo de documento inválido"
      )
      .required("Tipo é obrigatório"),
    version: Yup.number()
      .transform((value, originalValue) => {
        if (
          originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
        ) {
          return undefined;
        }

        return value;
      })
      .typeError("Versão inválida")
      .integer("Versão inválida")
      .min(1, "Versão inválida")
      .required("Versão é obrigatória"),
    title,
    content,
  });
};

const FormLegalDocument: React.FC<FormLegalDocumentProps> = ({
  method,
  url,
  initialData,
  acceptanceCount,
  notice,
  onPublished,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [contentPreview, setContentPreview] = useState(
    initialData?.content ?? ""
  );
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = useCallback(
    async (data: LegalDocumentFormData) => {
      formRef.current?.setErrors({});

      try {
        const validated = await buildSchema(method).validate(data, {
          abortEarly: false,
        });

        if (method === "add") {
          const created = validated as ValidatedCreate;
          await api.post(url, {
            type: created.type,
            version: created.version,
            title: created.title,
            content: created.content,
          });
        } else {
          const updated = validated as ValidatedDraft;
          await api.put(url, {
            title: updated.title,
            content: updated.content,
          });
        }

        addToast({
          type: "success",
          title: method === "add" ? "Rascunho salvo" : "Rascunho atualizado",
          description:
            method === "add"
              ? "Rascunho criado com sucesso."
              : "Rascunho atualizado com sucesso.",
        });
        navigate("/documentos-legais");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(err));
          return;
        }

        addToast({
          type: "error",
          title: "Erro ao salvar",
          description: getApiErrorMessage(err, "Erro ao salvar o documento"),
        });
      }
    },
    [addToast, method, navigate, url]
  );

  const handlePublish = useCallback(async () => {
    if (!onPublished || isPublishing) {
      return;
    }

    formRef.current?.setErrors({});
    const data = formRef.current?.getData() as LegalDocumentFormData | undefined;

    if (!data) {
      return;
    }

    try {
      const validated = (await buildSchema("edit").validate(data, {
        abortEarly: false,
      })) as ValidatedDraft;

      if (!confirmPublishLegalDocument()) {
        return;
      }

      setIsPublishing(true);
      await api.put(url, {
        title: validated.title,
        content: validated.content,
      });
      const response = await api.patch<LegalDocument>(`${url}/publish`);
      addToast({
        type: "success",
        title: "Documento publicado",
        description:
          "Os usuários serão solicitados a aceitar esta versão na próxima abertura do aplicativo.",
      });
      onPublished(response.data);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        formRef.current?.setErrors(getValidationErrors(err));
        return;
      }

      addToast({
        type: "error",
        title: "Erro ao publicar",
        description: getApiErrorMessage(err, "Erro ao publicar o documento"),
      });
    } finally {
      setIsPublishing(false);
    }
  }, [addToast, isPublishing, onPublished, url]);

  return (
    <Container>
      {notice && <Notice>{notice}</Notice>}
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
            {method === "edit" && initialData?.type && (
              <ReadOnlyGrid>
                <div>
                  <span>Tipo</span>
                  <strong>{LEGAL_DOCUMENT_TYPE_LABEL[initialData.type]}</strong>
                </div>
                <div>
                  <span>Versão</span>
                  <strong>{initialData.version}</strong>
                </div>
                {typeof acceptanceCount === "number" && (
                  <div>
                    <span>Aceites</span>
                    <strong>{formatAcceptanceCount(acceptanceCount)}</strong>
                  </div>
                )}
              </ReadOnlyGrid>
            )}
            {method === "add" && (
              <>
                <Select
                  name="type"
                  placeholder="Tipo do documento"
                  options={LEGAL_DOCUMENT_TYPE_OPTIONS}
                  defaultValue={
                    LEGAL_DOCUMENT_TYPE_OPTIONS.find(
                      (option) => option.value === initialData?.type
                    ) || undefined
                  }
                />
                <Input
                  name="version"
                  type="number"
                  min={1}
                  step={1}
                  icon={FiHash}
                  placeholder="Versão"
                />
                <FieldHint>
                  Número inteiro, único para o tipo. O documento nasce como
                  rascunho.
                </FieldHint>
              </>
            )}
            <Input name="title" icon={FiType} placeholder="Título" />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Conteúdo</StepTitle>
            <Textarea
              name="content"
              placeholder="Texto ou markdown do documento"
              rows={14}
              onChange={(event) => setContentPreview(event.target.value)}
            />
            <FieldHint>
              O conteúdo é texto ou markdown, no mesmo campo usado para textos
              longos.
            </FieldHint>
            <PreviewBlock>
              <h4>Pré-visualização</h4>
              <LegalDocumentPreview content={contentPreview} compact />
            </PreviewBlock>
          </StepContent>
        </FormStep>

        {onPublished && (
          <PublishHint>
            Ao publicar, os usuários serão solicitados a aceitar esta versão na
            próxima abertura do aplicativo. O texto publicado não poderá ser
            editado.
          </PublishHint>
        )}

        <FormActions>
          <BackButton
            type="button"
            onClick={() => navigate("/documentos-legais")}
            disabled={isPublishing}
          >
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <ActionGroup>
            {onPublished && (
              <PublishButton
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing ? "Publicando..." : "Publicar"}
              </PublishButton>
            )}
            <SaveButton type="submit" disabled={isPublishing}>
              <FiSave size={20} />
              {method === "add" ? "Salvar rascunho" : "Atualizar rascunho"}
            </SaveButton>
          </ActionGroup>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormLegalDocument;
