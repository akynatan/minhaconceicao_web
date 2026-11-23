import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { PlaceToSleepRoom } from "../../types/PlaceToSleepRoom";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  RoomName,
  RoomInfo,
  InfoItem,
  StatusSwitch,
  EditButton,
  DeleteButton,
  StatusIndicator,
  ActionButtons,
} from "./styles";

interface PlaceToSleepRoomCardProps {
  room: PlaceToSleepRoom;
  lodgingId: string;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const PlaceToSleepRoomCard: React.FC<PlaceToSleepRoomCardProps> = ({
  room,
  lodgingId,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader>
        <RoomName>{room.name}</RoomName>
        <StatusIndicator isActive={room.isActive}>
          {room.isActive ? "Ativo" : "Inativo"}
        </StatusIndicator>
      </CardHeader>

      <CardBody>
        <RoomInfo>
          <InfoItem>
            <FiUsers size={16} />
            <span>
              {room.capacity
                ? `Até ${room.capacity} hóspedes`
                : "Capacidade não informada"}
            </span>
          </InfoItem>
          <InfoItem>
            <span>{room.beds || "Camas não informadas"}</span>
          </InfoItem>
          <InfoItem>
            <span>Posição {room.position ?? 0}</span>
          </InfoItem>
          {room.slug && (
            <InfoItem>
              <span>{room.slug}</span>
            </InfoItem>
          )}
        </RoomInfo>

        {room.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
              whiteSpace: "pre-wrap",
            }}
          >
            {room.description}
          </div>
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={room.isActive}
              onChange={() => onToggleStatus(room.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <ActionButtons>
          <DeleteButton type="button" onClick={() => onDelete(room.id)}>
            <FiTrash2 size={18} />
            Excluir
          </DeleteButton>
          <EditButton
            as={Link}
            to={`/lugares-para-dormir/${lodgingId}/quartos/${room.id}`}
          >
            <HiPencil size={18} />
            Editar
          </EditButton>
        </ActionButtons>
      </CardActions>
    </Card>
  );
};

export default PlaceToSleepRoomCard;
