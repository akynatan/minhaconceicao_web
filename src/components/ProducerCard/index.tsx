import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import {
  FiPhone,
  FiMail,
  FiInstagram,
  FiDollarSign,
  FiAward,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";
import { Producer, ProductProducer } from "../../types/Producer";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  ProducerName,
  StatusIndicator,
  ProducerInfo,
  InfoItem,
  SpecialtiesInfo,
  StatusSwitch,
  EditButton,
  PhotoContainer,
  Photo,
  DefaultPhoto,
} from "./styles";

interface ProducerCardProps {
  producer: Producer;
  onToggleStatus: (id: string) => void;
}

const ProducerCard: React.FC<ProducerCardProps> = ({
  producer,
  onToggleStatus,
}) => {
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

  const parseProducts = (products?: ProductProducer[]) => {
    if (!products) return [];
    return products.map((product) => product.product?.name);
  };

  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <PhotoContainer>
            {producer.photoUrl ? (
              <Photo src={producer.photoUrl} alt={producer.name} />
            ) : (
              <DefaultPhoto>
                <FiPackage size={24} />
              </DefaultPhoto>
            )}
          </PhotoContainer>
          <div style={{ flex: 1 }}>
            <ProducerName>{producer.name}</ProducerName>
            <StatusIndicator isActive={producer.isActive}>
              {producer.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <ProducerInfo>
          <InfoItem>
            <FiPhone size={16} />
            <span>{producer.phone}</span>
          </InfoItem>

          <InfoItem>
            <FiMail size={16} />
            <span>{producer.email}</span>
          </InfoItem>

          {producer.whatsapp && (
            <InfoItem>
              <FiPhone size={16} />
              <span>WhatsApp: {producer.whatsapp}</span>
            </InfoItem>
          )}

          {producer.instagram && (
            <InfoItem>
              <FiInstagram size={16} />
              <span>@{producer.instagram}</span>
            </InfoItem>
          )}

          {producer.address && (
            <InfoItem>
              <FiMapPin size={16} />
              <span>{producer.address}</span>
            </InfoItem>
          )}

          {producer.city && producer.neighborhood && (
            <InfoItem>
              <FiMapPin size={16} />
              <span>
                {producer.city}, {producer.neighborhood}
              </span>
            </InfoItem>
          )}

          {producer.specialties && (
            <InfoItem>
              <FiAward size={16} />
              <span>Especialidades: {producer.specialties}</span>
            </InfoItem>
          )}

          <InfoItem>
            <FiDollarSign size={16} />
            <span>
              Preço:{" "}
              {formatPrice(
                producer.products?.reduce(
                  (acc, product) => acc + (product.value || 0),
                  0
                )
              )}
            </span>
          </InfoItem>
        </ProducerInfo>

        {producer.specialties &&
          parseSpecialties(producer.specialties).length > 0 && (
            <SpecialtiesInfo>
              <strong>Especialidades:</strong>
              <div style={{ marginTop: "4px" }}>
                {parseSpecialties(producer.specialties).map(
                  (specialty, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        background: "#e8f5e8",
                        color: "#2e7d32",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        margin: "2px 4px 2px 0",
                      }}
                    >
                      {specialty}
                    </span>
                  )
                )}
              </div>
            </SpecialtiesInfo>
          )}

        {producer.products && parseProducts(producer.products).length > 0 && (
          <SpecialtiesInfo>
            <strong>Produtos:</strong>
            <div style={{ marginTop: "4px" }}>
              {parseProducts(producer.products).map((product, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    background: "#fff3e0",
                    color: "#f57c00",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    margin: "2px 4px 2px 0",
                  }}
                >
                  {product}
                </span>
              ))}
            </div>
          </SpecialtiesInfo>
        )}

        {producer.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: producer.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={producer.isActive}
              onChange={() => onToggleStatus(producer.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/produtores/${producer.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default ProducerCard;
