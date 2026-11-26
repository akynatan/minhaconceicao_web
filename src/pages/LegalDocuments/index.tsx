import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { FiPlusCircle, FiSearch } from "react-icons/fi";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import Button from "../../components/Button";
import LegalDocumentCard from "../../components/LegalDocumentCard";
import {
  LegalDocument,
  LegalDocumentType,
} from "../../types/LegalDocument";
import {
  asLegalDocuments,
  confirmPublishLegalDocument,
  currentLegalDocumentIds,
  LEGAL_DOCUMENT_TYPE_LABEL,
  LEGAL_DOCUMENT_TYPES,
  legalDocumentStatus,
} from "../../utils/legalDocument";

import {
  Container,
  Content,
  HeaderPage,
  FiltersContainer,
  SearchInput,
  CardsGrid,
  NoResults,
} from "../Producers/styles";

import { Group, GroupTitle, TypeFilterButton, TypeFilters } from "./styles";

type TypeFilter = "all" | LegalDocumentType;

const FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "terms_of_use", label: LEGAL_DOCUMENT_TYPE_LABEL.terms_of_use },
  {
    value: "privacy_policy",
    label: LEGAL_DOCUMENT_TYPE_LABEL.privacy_policy,
  },
];

const LegalDocuments: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const loadDocuments = useCallback(() => {
    setIsFetching(true);
    api
      .get("/legal-documents")
      .then((response) => {
        setDocuments(asLegalDocuments(response.data));
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(
            error,
            "Erro ao carregar documentos legais"
          ),
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handlePublish = useCallback(
    async (item: LegalDocument) => {
      if (publishingId) {
        return;
      }

      if (!confirmPublishLegalDocument()) {
        return;
      }

      setPublishingId(item.id);

      try {
        const response = await api.patch<LegalDocument>(
          `/legal-documents/${item.id}/publish`
        );
        setDocuments((prev) =>
          prev.map((current) =>
            current.id === item.id ? response.data : current
          )
        );
        addToast({
          type: "success",
          title: "Documento publicado",
          description:
            "Os usuários serão solicitados a aceitar esta versão na próxima abertura do aplicativo.",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao publicar",
          description: getApiErrorMessage(error, "Erro ao publicar o documento"),
        });
      } finally {
        setPublishingId(null);
      }
    },
    [addToast, publishingId]
  );

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const currentIds = useMemo(
    () => currentLegalDocumentIds(documents),
    [documents]
  );

  const visibleTypes =
    typeFilter === "all" ? LEGAL_DOCUMENT_TYPES : [typeFilter];

  const matchesSearch = (item: LegalDocument) => {
    const term = searchText.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(term) ||
      String(item.version).includes(term) ||
      LEGAL_DOCUMENT_TYPE_LABEL[item.type].toLowerCase().includes(term)
    );
  };

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Documentos legais</h1>
            <hr />
          </div>
          <Link to="/documentos-legais/novo">
            <Button type="button">Novo rascunho</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <TypeFilters>
            {FILTERS.map((filter) => (
              <TypeFilterButton
                key={filter.value}
                type="button"
                $active={typeFilter === filter.value}
                onClick={() => setTypeFilter(filter.value)}
              >
                {filter.label}
              </TypeFilterButton>
            ))}
          </TypeFilters>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por título ou versão..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </SearchInput>
        </FiltersContainer>

        {isFetching ? (
          <p className="fetching">Carregando...</p>
        ) : (
          visibleTypes.map((type) => {
            const items = documents
              .filter((item) => item.type === type && matchesSearch(item))
              .sort((left, right) => right.version - left.version);

            return (
              <Group key={type}>
                <GroupTitle>
                  <h2>{LEGAL_DOCUMENT_TYPE_LABEL[type]}</h2>
                  <span>{items.length}</span>
                </GroupTitle>
                {items.length === 0 ? (
                  <NoResults>
                    {searchText
                      ? "Nenhum documento encontrado com os filtros aplicados"
                      : "Nenhum documento cadastrado"}
                  </NoResults>
                ) : (
                  <CardsGrid>
                    {items.map((item) => (
                      <LegalDocumentCard
                        key={item.id}
                        item={item}
                        status={legalDocumentStatus(item, currentIds)}
                        publishing={publishingId === item.id}
                        publishDisabled={publishingId !== null}
                        onPublish={handlePublish}
                      />
                    ))}
                  </CardsGrid>
                )}
              </Group>
            );
          })
        )}
      </Content>
    </Container>
  );
};

export default LegalDocuments;
