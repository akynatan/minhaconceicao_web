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
import InputMask from "../InputMask";
import InputPhone from "../InputPhone";
import Textarea from "../Textarea";
import MultiSelectCategories from "../MultiSelectCategories";
import FileUpload from "../FileUpload";
import { CategoryType } from "../../enums/CategoryType";
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
  images: string[];
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

  useEffect(() => {
    console.log("FormPlaceToEat - schedules state updated:", schedules);
  }, [schedules]);

  // Carregar schedules quando há dados iniciais (modo edição)
  useEffect(() => {
    if (initialData?.schedules) {
      const mappedSchedules = initialData.schedules.map((schedule: any) => ({
        dayOfWeek: schedule.dayOfWeek,
        openingTime: schedule.openingTime || "08:00",
        closingTime: schedule.closingTime || "18:00",
        isClosed: schedule.isClosed || false,
      }));
      setSchedules(mappedSchedules);
    }
  }, [initialData]);

  const handleSubmit = useCallback(
    async (data: FormPlaceToEatData) => {
      console.log(data);
      console.log("Schedules:", schedules);
      formRef.current?.setErrors({});
      try {
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
          city: Yup.string().required("Cidade obrigatória"),
          neighborhood: Yup.string().required("Bairro obrigatório"),
          number: Yup.string().required("Número obrigatório"),
          zipCode: Yup.string()
            .required("CEP obrigatório")
            .matches(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
          phone: Yup.string()
            .required("Telefone obrigatório")
            .test(
              "is-valid-phone",
              "Telefone deve estar no formato (00) 0000-0000 ou (00) 00000-0000",
              (value) => {
                if (!value) return false;
                return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value);
              }
            ),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          website: Yup.string().url("Digite uma URL válida"),
          instagram: Yup.string(),
          facebook: Yup.string(),
          whatsapp: Yup.string().test(
            "is-whatsapp-format",
            "WhatsApp deve estar no formato (00) 0000-0000 ou (00) 00000-0000",
            (value) => {
              if (!value) return true;
              return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(value);
            }
          ),
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
            <Textarea
              name="description"
              placeholder="Descreva o local, suas especialidades, ambiente..."
              {...{ rows: 6 }}
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
              categoryType={CategoryType.PLACE_TO_EAT}
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
              <InputMask name="zipCode" mask="99999-999" placeholder="CEP" />
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
              <InputPhone name="phone" icon={FiPhone} placeholder="Telefone" />
              <Input name="email" icon={FiMail} placeholder="Email" />
              <InputPhone
                name="whatsapp"
                icon={FiMessageSquare}
                placeholder="WhatsApp"
              />
              <Input
                name="website"
                icon={FiGlobe}
                prefix="https://"
                placeholder="Website"
              />
              <Input
                name="instagram"
                icon={FiInstagram}
                prefix="instagram.com/"
                placeholder="Instagram"
              />
              <Input
                name="facebook"
                icon={FiFacebook}
                prefix="facebook.com/"
                placeholder="Facebook"
              />
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
              existingPhoto={
                initialData?.photo && initialData?.photoUrl
                  ? {
                      key: initialData.photo,
                      photoUrl: initialData.photoUrl,
                    }
                  : undefined
              }
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
              existingImages={
                initialData?.images?.map((img) => {
                  console.log("FormPlaceToEat - Existing image:", img);
                  return {
                    key: img.image,
                    imageUrl: img.imageUrl,
                    name: img.image,
                  };
                }) || []
              }
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
