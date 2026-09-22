import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { EventItem } from "../../types/Event";
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

interface EventCardProps {
  event: EventItem;
  onToggleStatus: (id: string) => void;
}

const formatDate = (value?: string) => {
  if (!value) return "Data não informada";
  return new Date(value).toLocaleString("pt-BR");
};

const EventCard: React.FC<EventCardProps> = ({ event, onToggleStatus }) => {
  const cover = event.images?.[0];

  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PhotoContainer>
            {cover?.imageUrl ? (
              <Photo src={cover.imageUrl} alt={event.name} />
            ) : (
              <DefaultPhoto>
                <FiCalendar size={24} />
              </DefaultPhoto>
            )}
          </PhotoContainer>
          <div style={{ flex: 1 }}>
            <ProducerName>{event.name}</ProducerName>
            <StatusIndicator isActive={event.isActive}>
              {event.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <ProducerInfo>
          <InfoItem>
            <FiCalendar size={16} />
            <span>{formatDate(event.date)}</span>
          </InfoItem>
          <InfoItem>
            <FiMapPin size={16} />
            <span>{event.location}</span>
          </InfoItem>
          {event.address && (
            <InfoItem>
              <FiMapPin size={16} />
              <span>{event.address}</span>
            </InfoItem>
          )}
        </ProducerInfo>
        {event.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={event.isActive}
              onChange={() => onToggleStatus(event.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>
        <EditButton as={Link} to={`/eventos/${event.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default EventCard;
