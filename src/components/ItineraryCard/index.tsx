import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiClock, FiMap } from "react-icons/fi";
import { Itinerary } from "../../types/Itinerary";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  ProducerName,
  StatusIndicator,
  ProducerInfo,
  InfoItem,
  PhotoContainer,
  Photo,
  DefaultPhoto,
  StatusSwitch,
  EditButton,
} from "../ProducerCard/styles";

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Fácil",
  moderate: "Moderado",
  hard: "Difícil",
};

interface ItineraryCardProps {
  itinerary: Itinerary;
  onToggleStatus: (id: string) => void;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
  onToggleStatus,
}) => {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PhotoContainer>
            {itinerary.coverImageUrl ? (
              <Photo src={itinerary.coverImageUrl} alt={itinerary.name} />
            ) : (
              <DefaultPhoto>
                <FiMap size={24} />
              </DefaultPhoto>
            )}
          </PhotoContainer>
          <div style={{ flex: 1 }}>
            <ProducerName>{itinerary.name}</ProducerName>
            <StatusIndicator isActive={itinerary.isActive}>
              {itinerary.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <ProducerInfo>
          <InfoItem>
            <FiClock size={16} />
            <span>{itinerary.duration || "Duração não informada"}</span>
          </InfoItem>
          <InfoItem>
            <FiMap size={16} />
            <span>
              {itinerary.difficulty
                ? DIFFICULTY_LABELS[itinerary.difficulty]
                : "Dificuldade não informada"}
            </span>
          </InfoItem>
        </ProducerInfo>
        {itinerary.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
          >
            {itinerary.description}
          </div>
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={itinerary.isActive}
              onChange={() => onToggleStatus(itinerary.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>
        <EditButton as={Link} to={`/roteiros/${itinerary.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default ItineraryCard;
