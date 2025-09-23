import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiInstagram,
  FiFacebook,
  FiMessageSquare,
  FiTag,
  FiArrowLeft,
  FiSave,
} from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import api from "../../services/api";

import { useToast } from "../../hooks/toast";

import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../Input";
import RichTextEditor from "../RichTextEditor";
import MultiSelectCategories from "../MultiSelectCategories";
import FileUpload from "../FileUpload";
import FileUploadMultiple from "../FileUploadMultiple";
import ScheduleForm, { ScheduleData } from "../ScheduleForm";

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
import { PlaceToEat } from "../../types/PlaceToEat";

interface FormPlaceToEatData {
  name: string;
  description: string;
  categories: string[];
  address: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tags?: string;
  photo?: string;
  images: string[]; // Array de keys das imagens
  schedules: ScheduleData[];
}

interface FormPlaceToEatProps {
  initialData?: PlaceToEat;
  method: "edit" | "add";
  url: string;
}

const FormPlaceToEat: React.FC<FormPlaceToEatProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);

  // Debug: Log quando schedules mudam
  useEffect(() => {
    console.log("FormPlaceToEat - schedules state updated:", schedules);
  }, [schedules]);

  const handleSubmit = useCallback(
    async (data: FormPlaceToEatData) => {
      console.log(data);
      console.log("Schedules:", schedules);
      formRef.current?.setErrors({});
      try {
        // Combinar dados do formulário com schedules e images
        const formDataWithSchedules = {
          ...data,
          schedules: schedules,
          images: data.images || [],
        };

        console.log("Form data with schedules:", formDataWithSchedules);
        console.log("Images count:", formDataWithSchedules.images.length);
        console.log("Schedules count:", formDataWithSchedules.schedules.length);

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          address: Yup.string().required("Endereço obrigatório"),
          city: Yup.string(),
          neighborhood: Yup.string(),
          number: Yup.string(),
          zipCode: Yup.string(),
          phone: Yup.string(),
          email: Yup.string().email("Digite um e-mail válido"),
          website: Yup.string().url("Digite uma URL válida"),
          instagram: Yup.string(),
          facebook: Yup.string(),
          whatsapp: Yup.string(),
          tags: Yup.string(),
          latitude: Yup.string().test(
            "is-valid-latitude",
            "Latitude deve estar entre -90 e 90",
            (value) => {
              if (!value) return true;
              const num = parseFloat(value);
              return !isNaN(num) && num >= -90 && num <= 90;
            }
          ),
          longitude: Yup.string().test(
            "is-valid-longitude",
            "Longitude deve estar entre -180 e 180",
            (value) => {
              if (!value) return true;
              const num = parseFloat(value);
              return !isNaN(num) && num >= -180 && num <= 180;
            }
          ),
          photo: Yup.string(),
          categories: Yup.array()
            .of(Yup.string())
            .min(1, "Selecione pelo menos uma categoria"),
          images: Yup.array(),
          schedules: Yup.array(),
        });

        await schema.validate(formDataWithSchedules, {
          abortEarly: false,
        });

        // Preparar dados JSON para envio
        const jsonData = {
          name: formDataWithSchedules.name,
          description: formDataWithSchedules.description,
          categories: formDataWithSchedules.categories,
          address: formDataWithSchedules.address,
          number: formDataWithSchedules.number,
          neighborhood: formDataWithSchedules.neighborhood,
          city: formDataWithSchedules.city,
          zipCode: formDataWithSchedules.zipCode,
          latitude: formDataWithSchedules.latitude,
          longitude: formDataWithSchedules.longitude,
          phone: formDataWithSchedules.phone,
          email: formDataWithSchedules.email,
          whatsapp: formDataWithSchedules.whatsapp,
          website: formDataWithSchedules.website,
          instagram: formDataWithSchedules.instagram,
          facebook: formDataWithSchedules.facebook,
          tags: formDataWithSchedules.tags,
          photo: formDataWithSchedules.photo,
          images: formDataWithSchedules.images,
          schedules: formDataWithSchedules.schedules,
        };

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: "success",
            title: "Local Cadastrado/Alterado!",
            description: "Local cadastrado/alterado com sucesso!",
          });
        }

        navigate("/lugares-para-comer");
      } catch (err: any) {
        console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          console.log(errors);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro no Cadastro/Atualização!",
          description: err.response?.data?.error || "Erro inesperado",
        });
      }
    },
    [addToast, url, method, navigate, schedules]
  );

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
            <StepTitle>Nome do Local</StepTitle>
            <Input name="name" icon={FiMapPin} placeholder="Nome do Local" />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Descrição</StepTitle>
            <RichTextEditor
              name="description"
              placeholder="Descreva o local, suas especialidades, ambiente..."
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Categorias</StepTitle>
            <MultiSelectCategories
              name="categories"
              placeholder="Selecione as categorias do local"
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Endereço</StepTitle>
            <Input
              name="address"
              icon={FiMapPin}
              placeholder="Endereço completo"
            />
            <div className="form-grid">
              <Input name="number" placeholder="Número" />
              <Input name="neighborhood" placeholder="Bairro" />
              <Input name="city" placeholder="Cidade" />
              <Input name="zipCode" placeholder="CEP" />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Localização</StepTitle>
            <div className="form-flex">
              <Input
                name="latitude"
                type="number"
                step="any"
                placeholder="Latitude (-90 a 90)"
              />
              <Input
                name="longitude"
                type="number"
                step="any"
                placeholder="Longitude (-180 a 180)"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>6</StepNumber>
          <StepContent>
            <StepTitle>Contato</StepTitle>
            <div className="form-grid">
              <Input name="phone" icon={FiPhone} placeholder="Telefone" />
              <Input name="email" icon={FiMail} placeholder="Email" />
              <Input
                name="whatsapp"
                icon={FiMessageSquare}
                placeholder="WhatsApp"
              />
              <Input name="website" icon={FiGlobe} placeholder="Website" />
              <Input
                name="instagram"
                icon={FiInstagram}
                placeholder="Instagram"
              />
              <Input name="facebook" icon={FiFacebook} placeholder="Facebook" />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>7</StepNumber>
          <StepContent>
            <StepTitle>Tags</StepTitle>
            <Input
              name="tags"
              icon={FiTag}
              placeholder="Tags (separadas por vírgula)"
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>7</StepNumber>
          <StepContent>
            <StepTitle>Foto Principal</StepTitle>
            <FileUpload
              name="photo"
              placeholder="Selecione a foto principal do local"
              accept="image/*"
              maxSize={5}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>8</StepNumber>
          <StepContent>
            <StepTitle>Horários de Funcionamento</StepTitle>
            <ScheduleForm
              name="schedules"
              schedules={schedules}
              onChange={setSchedules}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>9</StepNumber>
          <StepContent>
            <StepTitle>Imagens</StepTitle>
            <FileUploadMultiple
              name="images"
              placeholder="Selecione imagens ou arraste os arquivos aqui."
              accept="image/*"
              maxSize={5}
            />
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton
            type="button"
            onClick={() => navigate("/lugares-para-comer")}
          >
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>

          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Local" : "Atualizar Local"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormPlaceToEat;
