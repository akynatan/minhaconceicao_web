import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";

import FormLegalDocument from "../../components/FormLegalDocument";
import GoBack from "../../components/GoBack";
import LegalDocumentPreview from "../../components/LegalDocumentPreview";
import { SaveButton } from "../../components/FormProducer/styles";
import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import {
  LegalDocument,
  LegalDocumentStatus,
} from "../../types/LegalDocument";
import {
  asLegalDocuments,
  currentLegalDocumentIds,
  formatAcceptanceCount,
  formatPublishedAt,
  LEGAL_DOCUMENT_STATUS_LABEL,
  LEGAL_DOCUMENT_TYPE_LABEL,
  legalDocumentSeed,
  legalDocumentStatus,
} from "../../utils/legalDocument";

import { Container, Content, ContentPage } from "../AddProducer/styles";

import {
  ContentLabel,
  DocumentTitle,
  MetaGrid,
  PublishedActions,
} from "./styles";

const EditLegalDocument: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [documentItem, setDocumentItem] = useState<LegalDocument | null>(null);
  const [status, setStatus] = useState<LegalDocumentStatus>("draft");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const loadDocument = async () => {
      try {
        const response = await api.get<LegalDocument>(`/legal-documents/${id}`);
        if (!active) {
          return;
        }

        const item = response.data;
        setDocumentItem(item);

        if (!item.publishedAt) {
          setStatus("draft");
          return;
        }

        try {
          const listResponse = await api.get("/legal-documents", {
            params: { type: item.type },
          });
          if (!active) {
            return;
          }

          setStatus(
            legalDocumentStatus(
              item,
              currentLegalDocumentIds(asLegalDocuments(listResponse.data))
            )
          );
        } catch {
          if (active) {
            setStatus("published");
          }
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setDocumentItem(null);
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(
            error,
            "Erro ao carregar o documento"
          ),
        });
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      active = false;
    };
  }, [addToast, id]);

  const handleNewVersion = () => {
    if (!documentItem) {
      return;
    }

    navigate("/documentos-legais/novo", {
      state: legalDocumentSeed(documentItem),
    });
  };

  if (isLoading) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <p>Carregando...</p>
          </Content>
        </ContentPage>
      </Container>
    );
  }

  if (!documentItem) {
    return (
      <Container>
        <ContentPage>
          <Content>
            <GoBack />
            <p>Documento não encontrado</p>
          </Content>
        </ContentPage>
      </Container>
    );
  }

  const isPublished = Boolean(documentItem.publishedAt);

  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>{isPublished ? "Documento publicado" : "Editar rascunho"}</h1>
          {isPublished ? (
            <>
              <MetaGrid>
                <div>
                  <dt>Tipo</dt>
                  <dd>{LEGAL_DOCUMENT_TYPE_LABEL[documentItem.type]}</dd>
                </div>
                <div>
                  <dt>Versão</dt>
                  <dd>{documentItem.version}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{LEGAL_DOCUMENT_STATUS_LABEL[status]}</dd>
                </div>
                <div>
                  <dt>Publicado em</dt>
                  <dd>{formatPublishedAt(documentItem.publishedAt)}</dd>
                </div>
                <div>
                  <dt>Aceites</dt>
                  <dd>{formatAcceptanceCount(documentItem.acceptanceCount)}</dd>
                </div>
              </MetaGrid>
              <DocumentTitle>{documentItem.title}</DocumentTitle>
              <ContentLabel>Conteúdo</ContentLabel>
              <LegalDocumentPreview content={documentItem.content} />
              <PublishedActions>
                <SaveButton type="button" onClick={handleNewVersion}>
                  <FiPlusCircle size={20} />
                  Criar nova versão a partir desta
                </SaveButton>
              </PublishedActions>
            </>
          ) : (
            <FormLegalDocument
              key={documentItem.id}
              method="edit"
              url={`/legal-documents/${documentItem.id}`}
              initialData={{
                type: documentItem.type,
                version: documentItem.version,
                title: documentItem.title,
                content: documentItem.content,
              }}
              acceptanceCount={documentItem.acceptanceCount}
              onPublished={(published) => {
                setDocumentItem(published);
                setStatus("current");
              }}
            />
          )}
        </Content>
      </ContentPage>
    </Container>
  );
};

export default EditLegalDocument;
