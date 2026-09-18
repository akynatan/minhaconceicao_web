import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiPhone, FiMail, FiInstagram, FiMapPin, FiTool } from "react-icons/fi";
import { Artisan } from "../../types/Artisan";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  ProducerName,
  StatusIndicator,
  ProducerInfo,
  InfoItem,
  StatusSwitch,
  EditButton,
  PhotoContainer,
  Photo,
  DefaultPhoto,
} from "../ProducerCard/styles";

interface ArtisanCardProps {
  artisan: Artisan;
  onToggleStatus: (id: string) => void;
}

const ArtisanCard: React.FC<ArtisanCardProps> = ({
  artisan,
  onToggleStatus,
}) => {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PhotoContainer>
            {artisan.photoUrl ? (
              <Photo src={artisan.photoUrl} alt={artisan.name} />
            ) : (
              <DefaultPhoto>
                <FiTool size={24} />
              </DefaultPhoto>
            )}
          </PhotoContainer>
          <div style={{ flex: 1 }}>
            <ProducerName>{artisan.name}</ProducerName>
            <StatusIndicator isActive={artisan.isActive}>
              {artisan.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <ProducerInfo>
          <InfoItem>
            <FiPhone size={16} />
            <span>{artisan.phone}</span>
          </InfoItem>
          {artisan.email && (
            <InfoItem>
              <FiMail size={16} />
              <span>{artisan.email}</span>
            </InfoItem>
          )}
          {artisan.instagram && (
            <InfoItem>
              <FiInstagram size={16} />
              <span>@{artisan.instagram}</span>
            </InfoItem>
          )}
          {artisan.address && (
            <InfoItem>
              <FiMapPin size={16} />
              <span>{artisan.address}</span>
            </InfoItem>
          )}
        </ProducerInfo>
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={artisan.isActive}
              onChange={() => onToggleStatus(artisan.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/artesaos/${artisan.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default ArtisanCard;
