import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import {
  FiPhone,
  FiMail,
  FiInstagram,
  FiDollarSign,
  FiAward,
} from "react-icons/fi";
import { Guide } from "../../types/Guide";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  GuideName,
  StatusIndicator,
  GuideInfo,
  InfoItem,
  SpecialtiesInfo,
  StatusSwitch,
  EditButton,
  PhotoContainer,
  Photo,
  DefaultPhoto,
} from "./styles";

interface GuideCardProps {
  guide: Guide;
  onToggleStatus: (id: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, onToggleStatus }) => {
  const formatPrice = (price?: number) => {
    if (!price) return "Não informado";
    return `R$ ${price}/hora`;
  };

  const parseSpecialties = (specialties?: string) => {
    if (!specialties) return [];
    return specialties
      .split(",")
      .map((specialty) => specialty.trim())
      .filter((specialty) => specialty.length > 0);
  };

  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PhotoContainer>
            {guide.photoUrl ? (
              <Photo src={guide.photoUrl} alt={guide.name} />
            ) : (
              <DefaultPhoto>
                <FiAward size={24} />
              </DefaultPhoto>
            )}
          </PhotoContainer>
          <div style={{ flex: 1 }}>
            <GuideName>{guide.name}</GuideName>
            <StatusIndicator isActive={guide.isActive}>
              {guide.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <GuideInfo>
          <InfoItem>
            <FiPhone size={16} />
            <span>{guide.phone}</span>
          </InfoItem>

          <InfoItem>
            <FiMail size={16} />
            <span>{guide.email}</span>
          </InfoItem>

          {guide.whatsapp && (
            <InfoItem>
              <FiPhone size={16} />
              <span>WhatsApp: {guide.whatsapp}</span>
            </InfoItem>
          )}

          {guide.instagram && (
            <InfoItem>
              <FiInstagram size={16} />
              <span>@{guide.instagram}</span>
            </InfoItem>
          )}

          {guide.experience && (
            <InfoItem>
              <FiAward size={16} />
              <span>Experiência: {guide.experience}</span>
            </InfoItem>
          )}

          <InfoItem>
            <FiDollarSign size={16} />
            <span>Preço: {formatPrice(guide.pricePerHour)}</span>
          </InfoItem>
        </GuideInfo>

        {guide.specialties &&
          parseSpecialties(guide.specialties).length > 0 && (
            <SpecialtiesInfo>
              <strong>Especialidades:</strong>
              <div style={{ marginTop: "4px" }}>
                {parseSpecialties(guide.specialties).map((specialty, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      background: "#e3f2fd",
                      color: "#1976d2",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      margin: "2px 4px 2px 0",
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </SpecialtiesInfo>
          )}

        {guide.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: guide.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={guide.isActive}
              onChange={() => onToggleStatus(guide.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/guias/${guide.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default GuideCard;
