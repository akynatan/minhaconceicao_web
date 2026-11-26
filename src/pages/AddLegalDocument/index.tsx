import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import FormLegalDocument from "../../components/FormLegalDocument";
import GoBack from "../../components/GoBack";
import api from "../../services/api";
import { LegalDocumentSeed } from "../../types/LegalDocument";
import {
  asLegalDocuments,
  isLegalDocumentSeed,
  resolveNextVersion,
} from "../../utils/legalDocument";

import { Container, Content, ContentPage } from "../AddProducer/styles";

const AddLegalDocument: React.FC = () => {
  const location = useLocation();
  const seed = isLegalDocumentSeed(location.state) ? location.state : undefined;
  const [initialData, setInitialData] = useState<LegalDocumentSeed | undefined>(
    undefined
  );
  const [isReady, setIsReady] = useState(!seed);

  useEffect(() => {
    if (!seed) {
      setInitialData(undefined);
      setIsReady(true);
      return;
    }

    let active = true;
    setIsReady(false);

    api
      .get("/legal-documents", { params: { type: seed.type } })
      .then((response) => {
        if (!active) {
          return;
        }

        setInitialData({
          ...seed,
          version: resolveNextVersion(
            asLegalDocuments(response.data),
            seed.version
          ),
        });
      })
      .catch(() => {
        if (active) {
          setInitialData(seed);
        }
      })
      .finally(() => {
        if (active) {
          setIsReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, [seed]);

  return (
    <Container>
      <ContentPage>
        <Content>
          <GoBack />
          <h1>{seed ? "Nova versão" : "Novo rascunho"}</h1>
          {!isReady || (seed && !initialData) ? (
            <p>Carregando...</p>
          ) : (
            <FormLegalDocument
              key={`${initialData?.type ?? "new"}-${initialData?.version ?? 0}`}
              method="add"
              url="/legal-documents"
              initialData={initialData}
              notice={
                initialData
                  ? "O texto foi copiado da versão anterior. Ajuste o que precisar, salve o rascunho e publique quando estiver pronto."
                  : undefined
              }
            />
          )}
        </Content>
      </ContentPage>
    </Container>
  );
};

export default AddLegalDocument;
