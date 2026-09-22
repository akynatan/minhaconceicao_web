import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiCalendar, FiBookOpen } from "react-icons/fi";
import { News } from "../../types/News";
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

interface NewsCardProps {
  news: News;
  onToggleStatus: (id: string) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "Data não informada";
  return new Date(value).toLocaleString("pt-BR");
};

const NewsCard: React.FC<NewsCardProps> = ({ news, onToggleStatus }) => {
  const cover = news.images?.[0];

  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PhotoContainer>
            {cover?.imageUrl ? (
              <Photo src={cover.imageUrl} alt={news.name} />
            ) : (
              <DefaultPhoto>
                <FiBookOpen size={24} />
              </DefaultPhoto>
            )}
          </PhotoContainer>
          <div style={{ flex: 1 }}>
            <ProducerName>{news.name}</ProducerName>
            <StatusIndicator isActive={news.isActive}>
              {news.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <ProducerInfo>
          <InfoItem>
            <FiCalendar size={16} />
            <span>{formatDate(news.date)}</span>
          </InfoItem>
          <InfoItem>
            <FiBookOpen size={16} />
            <span>{news.kind === "guide" ? "Guia" : "Notícia"}</span>
          </InfoItem>
        </ProducerInfo>
        {news.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: news.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={news.isActive}
              onChange={() => onToggleStatus(news.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>
        <EditButton as={Link} to={`/noticias/${news.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
