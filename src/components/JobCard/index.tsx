import React from "react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import {
  FiPhone,
  FiMail,
  FiGlobe,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import { Job, ContractType, WorkModel, WorkSchedule } from "../../types/Job";
import {
  Card,
  CardHeader,
  CardBody,
  CardActions,
  JobTitle,
  StatusIndicator,
  JobInfo,
  InfoItem,
  StatusSwitch,
  EditButton,
  CompanyInfo,
  CompanyLogo,
  DefaultLogo,
  JobDetails,
  DetailItem,
  SalaryInfo,
  ApplicationInfo,
} from "./styles";

interface JobCardProps {
  job: Job;
  onToggleStatus: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onToggleStatus }) => {
  const formatSalary = (salary?: number) => {
    if (!salary) return "A combinar";
    return `R$ ${salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getContractTypeLabel = (type: ContractType) => {
    const labels = {
      [ContractType.CLT]: "CLT",
      [ContractType.PJ]: "PJ",
      [ContractType.INTERNSHIP]: "Estágio",
      [ContractType.TEMPORARY]: "Temporário",
    };
    return labels[type];
  };

  const getWorkModelLabel = (model: WorkModel) => {
    const labels = {
      [WorkModel.ON_SITE]: "Presencial",
      [WorkModel.HYBRID]: "Híbrido",
      [WorkModel.REMOTE]: "Remoto",
    };
    return labels[model];
  };

  const getWorkScheduleLabel = (schedule: WorkSchedule) => {
    const labels = {
      [WorkSchedule.FULL_TIME]: "Integral",
      [WorkSchedule.PART_TIME]: "Meio período",
      [WorkSchedule.FLEXIBLE]: "Flexível",
    };
    return labels[schedule];
  };

  return (
    <Card>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <CompanyLogo>
            {job.company.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} />
            ) : (
              <DefaultLogo>
                <FiBriefcase size={24} />
              </DefaultLogo>
            )}
          </CompanyLogo>
          <div style={{ flex: 1 }}>
            <JobTitle>{job.title}</JobTitle>
            <CompanyInfo>{job.company.name}</CompanyInfo>
            <StatusIndicator isActive={job.isActive}>
              {job.isActive ? "Ativa" : "Inativa"}
            </StatusIndicator>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <JobInfo>
          <InfoItem>
            <FiMapPin size={16} />
            <span>{job.location}</span>
          </InfoItem>

          <InfoItem>
            <FiBriefcase size={16} />
            <span>{job.area}</span>
          </InfoItem>

          <InfoItem>
            <FiClock size={16} />
            <span>{getWorkScheduleLabel(job.workSchedule)}</span>
          </InfoItem>
        </JobInfo>

        <JobDetails>
          <DetailItem>
            <strong>Tipo de Contrato:</strong>{" "}
            {getContractTypeLabel(job.contractType)}
          </DetailItem>
          <DetailItem>
            <strong>Modelo de Trabalho:</strong>{" "}
            {getWorkModelLabel(job.workModel)}
          </DetailItem>
          <DetailItem>
            <strong>Quantidade de Vagas:</strong> {job.quantity}
          </DetailItem>
          <DetailItem>
            <strong>Data de Publicação:</strong>{" "}
            {formatDate(job.publicationDate)}
          </DetailItem>
          {job.expirationDate && (
            <DetailItem>
              <strong>Data de Expiração:</strong>{" "}
              {formatDate(job.expirationDate)}
            </DetailItem>
          )}
        </JobDetails>

        <SalaryInfo>
          <FiDollarSign size={16} />
          <span>{formatSalary(job.salary)}</span>
        </SalaryInfo>

        {job.description && (
          <div
            style={{
              marginTop: "12px",
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
            }}
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        )}

        {(job.applicationEmail ||
          job.applicationPhone ||
          job.applicationLink) && (
          <ApplicationInfo>
            <strong>Como se candidatar:</strong>
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {job.applicationEmail && (
                <InfoItem>
                  <FiMail size={14} />
                  <span>{job.applicationEmail}</span>
                </InfoItem>
              )}
              {job.applicationPhone && (
                <InfoItem>
                  <FiPhone size={14} />
                  <span>{job.applicationPhone}</span>
                </InfoItem>
              )}
              {job.applicationLink && (
                <InfoItem>
                  <FiGlobe size={14} />
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link de candidatura
                  </a>
                </InfoItem>
              )}
            </div>
          </ApplicationInfo>
        )}
      </CardBody>

      <CardActions>
        <StatusSwitch>
          <label>
            <input
              type="checkbox"
              checked={job.isActive}
              onChange={() => onToggleStatus(job.id)}
            />
            <span className="slider"></span>
          </label>
          <span>Ativa</span>
        </StatusSwitch>

        <EditButton as={Link} to={`/vagas/${job.id}`}>
          <HiPencil size={18} />
          Editar
        </EditButton>
      </CardActions>
    </Card>
  );
};

export default JobCard;
