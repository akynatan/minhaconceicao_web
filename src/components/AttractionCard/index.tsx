import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiClock, FiMapPin, FiTrendingUp, FiNavigation } from "react-icons/fi";
import { Attraction } from "../../types/Attraction";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  AttractionName,
  DifficultyBadge,
  AttractionInfo,
  InfoItem,
  CategoryInfo,
  Tags,
  Tag,
  StatusSwitch,
  EditButton,
  StatusIndicator,
} from "./styles";

interface AttractionCardProps {
  attraction: Attraction;
  onToggleStatus: (id: string) => void;
}

const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  onToggleStatus,
}) => {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const getDifficultyLabel = (difficulty: "easy" | "medium" | "hard") => {
    switch (difficulty) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Médio";
      case "hard":
        return "Difícil";
      default:
        return difficulty;
    }
  };

  const parseTags = (tags?: string) => {
    if (!tags) return [];
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  return (
    <Card>
      <CardHeader>
        <AttractionName>{attraction.name}</AttractionName>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <StatusIndicator isActive={attraction.isActive}>
            {attraction.isActive ? "Ativo" : "Inativo"}
          </StatusIndicator>
          <DifficultyBadge difficulty={attraction.difficulty}>
            {getDifficultyLabel(attraction.difficulty)}
          </DifficultyBadge>
        </div>
      </CardHeader>

      <CardBody>
        <AttractionInfo>
          <InfoItem>
            <FiClock size={16} />
            <span>Tempo estimado: {formatTime(attraction.estimatedTime)}</span>
          </InfoItem>

          <InfoItem>
            <FiMapPin size={16} />
            <span>Distância: {formatDistance(attraction.distance)}</span>
          </InfoItem>

          {attraction.elevationGain && (
            <InfoItem>
              <FiTrendingUp size={16} />
              <span>Elevação: {attraction.elevationGain}m</span>
            </InfoItem>
          )}

          <InfoItem>
            <FiNavigation size={16} />
            <span>Como chegar: {attraction.howToArrive}</span>
          </InfoItem>
        </AttractionInfo>

        {attraction.category && (
          <CategoryInfo>
            <span>{attraction.category.name}</span>
          </CategoryInfo>
        )}

        {attraction.tags && parseTags(attraction.tags).length > 0 && (
          <Tags>
            {parseTags(attraction.tags).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </Tags>
        )}

        {attraction.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: attraction.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={attraction.isActive}
              onChange={() => onToggleStatus(attraction.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/atracoes/${attraction.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default AttractionCard;
