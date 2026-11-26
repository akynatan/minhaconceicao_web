import React from "react";
import { HiPencil } from "react-icons/hi";
import { FiCalendar, FiCheckCircle, FiHash } from "react-icons/fi";

import { LegalDocument, LegalDocumentStatus } from "../../types/LegalDocument";
import {
  formatAcceptanceCount,
  formatPublishedAt,
  LEGAL_DOCUMENT_STATUS_LABEL,
  legalDocumentSeed,
} from "../../utils/legalDocument";
import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  EditButton,
  InfoItem,
  ProducerInfo,
  ProducerName,
} from "../ProducerCard/styles";

import { Actions, PublishButton, SecondaryButton, StatusBadge } from "./styles";

interface LegalDocumentCardProps {
  item: LegalDocument;
  status: LegalDocumentStatus;
  publishing: boolean;
  publishDisabled: boolean;
  onPublish: (item: LegalDocument) => void;
}

const LegalDocumentCard: React.FC<LegalDocumentCardProps> = ({
  item,
  status,
  publishing,
  publishDisabled,
  onPublish,
}) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <ProducerName>{item.title}</ProducerName>
          <StatusBadge $status={status}>
            {LEGAL_DOCUMENT_STATUS_LABEL[status]}
          </StatusBadge>
        </div>
      </CardHeader>

      <CardBody>
        <ProducerInfo>
          <InfoItem>
            <FiHash size={16} />
            <span>Versão {item.version}</span>
          </InfoItem>
          <InfoItem>
            <FiCalendar size={16} />
            <span>
              {item.publishedAt
                ? `Publicado em ${formatPublishedAt(item.publishedAt)}`
                : "Não publicado"}
            </span>
          </InfoItem>
          <InfoItem>
            <FiCheckCircle size={16} />
            <span>{formatAcceptanceCount(item.acceptanceCount)}</span>
          </InfoItem>
        </ProducerInfo>
      </CardBody>

      <CardActions>
        <Actions>
          {status === "draft" && (
            <PublishButton
              type="button"
              onClick={() => onPublish(item)}
              disabled={publishDisabled}
            >
              {publishing ? "Publicando..." : "Publicar"}
            </PublishButton>
          )}
          {status !== "draft" && (
            <SecondaryButton
              to="/documentos-legais/novo"
              state={legalDocumentSeed(item)}
            >
              Nova versão
            </SecondaryButton>
          )}
          <EditButton to={`/documentos-legais/${item.id}`}>
            <HiPencil size={18} />
            {status === "draft" ? "Editar" : "Visualizar"}
          </EditButton>
        </Actions>
      </CardActions>
    </Card>
  );
};

export default LegalDocumentCard;
