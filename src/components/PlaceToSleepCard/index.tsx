import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { FiMapPin, FiPhone, FiDollarSign, FiStar } from "react-icons/fi";
import { PlaceToSleep } from "../../types/PlaceToSleep";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  PlaceName,
  PlaceInfo,
  InfoItem,
  Categories,
  CategoryBadge,
  StatusSwitch,
  EditButton,
  StatusIndicator,
} from "./styles";

interface PlaceToSleepCardProps {
  place: PlaceToSleep;
  onToggleStatus: (id: string) => void;
}

const PlaceToSleepCard: React.FC<PlaceToSleepCardProps> = ({
  place,
  onToggleStatus,
}) => {
  const formatPrice = (price?: number) => {
    if (!price) return "Não informado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatRating = (rating?: number) => {
    if (!rating) return "Sem avaliação";
    return rating;
  };

  return (
    <Card>
      <CardHeader>
        <PlaceName>{place.name}</PlaceName>
        <StatusIndicator isActive={place.isActive}>
          {place.isActive ? "Ativo" : "Inativo"}
        </StatusIndicator>
      </CardHeader>

      <CardBody>
        <PlaceInfo>
          <InfoItem>
            <FiMapPin size={16} />
            <span>{place.address}</span>
          </InfoItem>

          {place.phone && (
            <InfoItem>
              <FiPhone size={16} />
              <span>{place.phone}</span>
            </InfoItem>
          )}

          <InfoItem>
            <FiDollarSign size={16} />
            <span>{formatPrice(place.averagePrice)}</span>
          </InfoItem>

          <InfoItem>
            <FiStar size={16} />
            <span>{formatRating(place.rating)}</span>
          </InfoItem>
        </PlaceInfo>

        {place.categories && place.categories.length > 0 && (
          <Categories>
            {place.categories.map((category) => (
              <CategoryBadge key={category.id}>
                {category.category?.name || "Categoria"}
              </CategoryBadge>
            ))}
          </Categories>
        )}

        {place.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: place.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={place.isActive}
              onChange={() => onToggleStatus(place.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/lugares-para-dormir/${place.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default PlaceToSleepCard;
