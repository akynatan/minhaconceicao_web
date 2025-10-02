import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import {
  FiPhone,
  FiMail,
  FiGlobe,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";
import { Company } from "../../types/Company";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  CompanyName,
  StatusIndicator,
  CompanyInfo,
  InfoItem,
  StatusSwitch,
  EditButton,
  LogoContainer,
  Logo,
  DefaultLogo,
  JobsCount,
} from "./styles";

interface CompanyCardProps {
  company: Company;
  onToggleStatus: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onToggleStatus,
}) => {
  const formatAddress = () => {
    const parts = [];
    if (company.address) parts.push(company.address);
    if (company.city) parts.push(company.city);
    if (company.state) parts.push(company.state);
    return parts.join(", ");
  };

  const getJobsCount = () => {
    return company.jobs?.length || 0;
  };

  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LogoContainer>
            {company.logoUrl ? (
              <Logo src={company.logoUrl} alt={company.name} />
            ) : (
              <DefaultLogo>
                <FiBriefcase size={24} />
              </DefaultLogo>
            )}
          </LogoContainer>
          <div style={{ flex: 1 }}>
            <CompanyName>{company.name}</CompanyName>
            <StatusIndicator isActive={company.isActive}>
              {company.isActive ? "Ativo" : "Inativo"}
            </StatusIndicator>
          </div>
        </div>
        <JobsCount>
          <FiBriefcase size={16} />
          <span>{getJobsCount()} vagas</span>
        </JobsCount>
      </CardHeader>

      <CardBody>
        <CompanyInfo>
          {company.phone && (
            <InfoItem>
              <FiPhone size={16} />
              <span>{company.phone}</span>
            </InfoItem>
          )}

          {company.email && (
            <InfoItem>
              <FiMail size={16} />
              <span>{company.email}</span>
            </InfoItem>
          )}

          {company.website && (
            <InfoItem>
              <FiGlobe size={16} />
              <span>{company.website}</span>
            </InfoItem>
          )}

          {formatAddress() && (
            <InfoItem>
              <FiMapPin size={16} />
              <span>{formatAddress()}</span>
            </InfoItem>
          )}

          {company.zipCode && (
            <InfoItem>
              <FiMapPin size={16} />
              <span>CEP: {company.zipCode}</span>
            </InfoItem>
          )}
        </CompanyInfo>

        {company.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: company.description }}
          />
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={company.isActive}
              onChange={() => onToggleStatus(company.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativo</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/empresas/${company.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default CompanyCard;
