import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  FiBriefcase,
  FiMail,
  FiPhone,
  FiGlobe,
  FiArrowLeft,
  FiSave,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../Input";
import InputPhone from "../InputPhone";
import Textarea from "../Textarea";
import Select from "../Select";
import {
  Job,
  CreateJobData,
  UpdateJobData,
  ContractType,
  WorkModel,
  WorkSchedule,
} from "../../types/Job";
import { Company } from "../../types/Company";

import {
  Container,
  FormStep,
  StepNumber,
  StepTitle,
  StepContent,
  FormActions,
  BackButton,
  SaveButton,
} from "./styles";

interface FormJobProps {
  initialData?: Job;
  method: "edit" | "add";
}

const FormJob: React.FC<FormJobProps> = ({ initialData, method }) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await api.get("/companies");
        const companiesData = Array.isArray(response.data)
          ? response.data
          : response.data.companies || [];
        setCompanies(companiesData);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };

    loadCompanies();
  }, []);

  const handleSubmit = useCallback(
    async (data: CreateJobData | UpdateJobData) => {
      formRef.current?.setErrors({});
      try {
        console.log("FormJob - Dados capturados:", data);

        const schema = Yup.object().shape({
          title: Yup.string().required("Título obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          requirements: Yup.string().required("Requisitos obrigatórios"),
          benefits: Yup.string(),
          contractType: Yup.string().required("Tipo de contrato obrigatório"),
          workModel: Yup.string().required("Modelo de trabalho obrigatório"),
          workSchedule: Yup.string().required(
            "Jornada de trabalho obrigatória"
          ),
          salary: Yup.number()
            .typeError("Precisa ser um número")
            .nullable()
            .transform((value, originalValue) => {
              console.log("originalValue", originalValue);
              console.log("value", value);
              return originalValue === "" ? null : value;
            })
            .notRequired(),
          location: Yup.string().required("Localização obrigatória"),
          area: Yup.string().required("Área obrigatória"),
          companyId: Yup.string().required("Empresa obrigatória"),
          publicationDate: Yup.string().required(
            "Data de publicação obrigatória"
          ),
          expirationDate: Yup.string()
            .transform((value, originalValue) => {
              return originalValue === "" ? null : value;
            })
            .notRequired(),
          quantity: Yup.number().min(1, "Quantidade deve ser pelo menos 1"),
          applicationEmail: Yup.string().email("Email inválido"),
          applicationPhone: Yup.string(),
          // aqui deve ser uma url sem http:// ou https://
          applicationLink: Yup.string().notRequired(),
        });

        const validatedData = await schema.validate(data, {
          abortEarly: false,
        });

        if (method === "add") {
          await api.post("/jobs", validatedData);
          addToast({
            type: "success",
            title: "Vaga criada",
            description: "Vaga criada com sucesso!",
          });
        } else {
          await api.put(`/jobs/${initialData!.id}`, validatedData);
          addToast({
            type: "success",
            title: "Vaga atualizada",
            description: "Vaga atualizada com sucesso!",
          });
        }

        navigate("/vagas");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        console.error("Erro:", err);
        addToast({
          type: "error",
          title: "Erro",
          description: `Erro ao ${
            method === "add" ? "criar" : "atualizar"
          } vaga.`,
        });
      }
    },
    [addToast, method, navigate, initialData]
  );

  const contractTypeOptions = [
    { value: ContractType.CLT, label: "CLT" },
    { value: ContractType.PJ, label: "PJ" },
    { value: ContractType.INTERNSHIP, label: "Estágio" },
    { value: ContractType.TEMPORARY, label: "Temporário" },
  ];

  const workModelOptions = [
    { value: WorkModel.ON_SITE, label: "Presencial" },
    { value: WorkModel.HYBRID, label: "Híbrido" },
    { value: WorkModel.REMOTE, label: "Remoto" },
  ];

  const workScheduleOptions = [
    { value: WorkSchedule.FULL_TIME, label: "Integral" },
    { value: WorkSchedule.PART_TIME, label: "Meio período" },
    { value: WorkSchedule.FLEXIBLE, label: "Flexível" },
  ];

  const companyOptions = companies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  return (
    <Container>
      <Form
        initialData={initialData}
        ref={formRef}
        onSubmit={handleSubmit}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <FormStep>
          <StepNumber>1</StepNumber>
          <StepContent>
            <StepTitle>Título da Vaga</StepTitle>
            <Input
              name="title"
              placeholder="Ex: Desenvolvedor Full Stack"
              icon={FiBriefcase}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Descrição da Vaga</StepTitle>
            <Textarea
              name="description"
              placeholder="Descreva as responsabilidades e atividades da vaga..."
              {...{ rows: 6 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Requisitos</StepTitle>
            <Textarea
              name="requirements"
              placeholder="Liste os requisitos necessários para a vaga..."
              {...{ rows: 6 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Benefícios</StepTitle>
            <Textarea
              name="benefits"
              placeholder="Liste os benefícios oferecidos (opcional)..."
              {...{ rows: 4 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Informações da Vaga</StepTitle>
            <div className="form-grid">
              <Select
                name="contractType"
                placeholder="Tipo de Contrato"
                options={contractTypeOptions}
              />
              <Select
                name="workModel"
                placeholder="Modelo de Trabalho"
                options={workModelOptions}
              />
              <Select
                name="workSchedule"
                placeholder="Jornada de Trabalho"
                options={workScheduleOptions}
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>6</StepNumber>
          <StepContent>
            <StepTitle>Localização e Área</StepTitle>
            <div className="form-grid">
              <Input
                name="location"
                placeholder="Cidade/Estado"
                icon={FiMapPin}
              />
              <Input
                name="area"
                placeholder="Área (Ex: Tecnologia)"
                icon={FiBriefcase}
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>7</StepNumber>
          <StepContent>
            <StepTitle>Salário e Quantidade</StepTitle>
            <div className="form-grid">
              <Input
                name="salary"
                type="number"
                placeholder="Salário (opcional)"
                icon={FiDollarSign}
              />
              <Input
                name="quantity"
                type="number"
                placeholder="Quantidade de vagas"
                icon={FiUsers}
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>8</StepNumber>
          <StepContent>
            <StepTitle>Datas</StepTitle>
            <div className="form-grid">
              <Input
                name="publicationDate"
                type="date"
                placeholder="Data de Publicação"
                icon={FiCalendar}
              />
              <Input
                name="expirationDate"
                type="date"
                placeholder="Data de Expiração (opcional)"
                icon={FiCalendar}
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>9</StepNumber>
          <StepContent>
            <StepTitle>Empresa</StepTitle>
            <Select
              name="companyId"
              placeholder="Selecione a empresa"
              options={companyOptions}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>10</StepNumber>
          <StepContent>
            <StepTitle>Como se Candidatar</StepTitle>
            <div className="form-grid">
              <Input
                name="applicationEmail"
                placeholder="Email para candidatura"
                icon={FiMail}
              />
              <InputPhone
                name="applicationPhone"
                placeholder="Telefone para candidatura"
                icon={FiPhone}
              />
              <Input
                name="applicationLink"
                placeholder="Link para candidatura"
                icon={FiGlobe}
              />
            </div>
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/vagas")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Criar Vaga" : "Salvar Alterações"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormJob;
