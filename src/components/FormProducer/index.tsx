import React, { useCallback, useRef, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiInstagram,
  FiArrowLeft,
  FiSave,
  FiAward,
  FiMapPin,
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
import FileUpload from "../FileUpload";
import ProducerProducts from "../ProducerProducts";
import {
  Producer,
  CreateProducerData,
  UpdateProducerData,
  CreateProductProducerData,
} from "../../types/Producer";

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

interface FormProducerProps {
  initialData?: Producer;
  method: "edit" | "add";
  url: string;
}

const FormProducer: React.FC<FormProducerProps> = ({
  initialData,
  method,
  url,
}) => {
  const { addToast } = useToast();
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();

  const [producerProducts, setProducerProducts] = useState<
    CreateProductProducerData[]
  >([]);

  const initialProducts = initialData?.products
    ? initialData.products.map((product) => ({
        productId: product.productId,
        description: product.description,
        value: product.value,
        image: product.image,
        imageUrl: product.imageUrl,
      }))
    : [];

  const handleProductsChange = useCallback(
    (products: CreateProductProducerData[]) => {
      setProducerProducts(products);
    },
    []
  );

  const handleSubmit = useCallback(
    async (data: CreateProducerData | UpdateProducerData) => {
      formRef.current?.setErrors({});
      try {
        console.log(
          "FormProducer - Todos os dados capturados pelo Unform:",
          data
        );

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          description: Yup.string().required("Descrição obrigatória"),
          email: Yup.string().email("Email inválido"),
          phone: Yup.string().required("Telefone obrigatório"),
          whatsapp: Yup.string(),
          instagram: Yup.string(),
          address: Yup.string(),
          city: Yup.string(),
          neighborhood: Yup.string(),
          number: Yup.string(),
          zipCode: Yup.string(),
          latitude: Yup.number(),
          longitude: Yup.number(),
          specialties: Yup.string(),
          experience: Yup.string(),
          photo: Yup.string(),
          cover: Yup.string(),
        });

        console.log({ producerProducts });

        await schema.validate(data, {
          abortEarly: false,
        });

        const jsonData = {
          name: data.name,
          description: data.description,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          instagram: data.instagram,
          address: data.address,
          city: data.city,
          neighborhood: data.neighborhood,
          number: data.number,
          zipCode: data.zipCode,
          latitude: data.latitude,
          longitude: data.longitude,
          specialties: data.specialties,
          experience: data.experience,
          photo: data.photo,
          cover: data.cover,
          products: producerProducts,
        };

        const methods = {
          edit: async () => api.put(url, jsonData),
          add: async () => api.post(url, jsonData),
        };

        const response = await methods[method]();

        if (response.data) {
          addToast({
            type: "success",
            title: "Produtor Cadastrado/Alterado!",
            description: "Produtor cadastrado/alterado com sucesso!",
          });
        }

        navigate("/produtores");
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
    [addToast, url, method, navigate, producerProducts]
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
            <StepTitle>Informações Básicas</StepTitle>
            <Input name="name" icon={FiUser} placeholder="Nome do Produtor" />
            <Textarea
              name="description"
              placeholder="Descreva o produtor, sua experiência, especialidades..."
              {...{ rows: 4 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>2</StepNumber>
          <StepContent>
            <StepTitle>Contato</StepTitle>
            <div className="form-grid">
              <Input
                name="email"
                type="email"
                icon={FiMail}
                placeholder="Email (opcional)"
                prefix="@"
              />
              <InputPhone name="phone" icon={FiPhone} placeholder="Telefone" />
              <InputPhone
                name="whatsapp"
                icon={FiPhone}
                placeholder="WhatsApp (opcional)"
              />
              <Input
                name="instagram"
                icon={FiInstagram}
                placeholder="Instagram (opcional)"
                prefix="@"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>3</StepNumber>
          <StepContent>
            <StepTitle>Endereço</StepTitle>
            <div className="form-grid">
              <Input
                name="address"
                icon={FiMapPin}
                placeholder="Endereço (opcional)"
              />
              <Input
                name="city"
                icon={FiMapPin}
                placeholder="Cidade (opcional)"
              />
              <Input
                name="neighborhood"
                icon={FiMapPin}
                placeholder="Bairro (opcional)"
              />
              <Input
                name="number"
                icon={FiMapPin}
                placeholder="Número (opcional)"
              />
              <Input
                name="zipCode"
                icon={FiMapPin}
                placeholder="CEP (opcional)"
              />
            </div>
            <div className="form-flex">
              <Input
                name="latitude"
                type="number"
                icon={FiMapPin}
                placeholder="Latitude (opcional)"
                step="any"
              />
              <Input
                name="longitude"
                type="number"
                icon={FiMapPin}
                placeholder="Longitude (opcional)"
                step="any"
              />
            </div>
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>4</StepNumber>
          <StepContent>
            <StepTitle>Especialidades e Experiência</StepTitle>
            <div className="form-grid">
              <Input
                name="experience"
                icon={FiAward}
                placeholder="Anos de experiência (opcional)"
                prefix="+"
              />
            </div>
            <Textarea
              name="specialties"
              placeholder="Especialidades do produtor (opcional)"
              {...{ rows: 3 }}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>5</StepNumber>
          <StepContent>
            <StepTitle>Produtos</StepTitle>
            <ProducerProducts
              initialProducts={initialProducts}
              onChange={handleProductsChange}
            />
          </StepContent>
        </FormStep>

        <FormStep>
          <StepNumber>6</StepNumber>
          <StepContent>
            <StepTitle>Fotos</StepTitle>
            <div className="form-grid">
              <FileUpload
                name="photo"
                placeholder="Selecione a foto do produtor"
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
              <FileUpload
                name="cover"
                placeholder="Selecione a foto de capa"
                accept="image/*"
                maxSize={5}
                existingPhoto={
                  initialData?.cover && initialData?.coverUrl
                    ? {
                        key: initialData.cover,
                        photoUrl: initialData.coverUrl,
                      }
                    : undefined
                }
              />
            </div>
          </StepContent>
        </FormStep>

        <FormActions>
          <BackButton type="button" onClick={() => navigate("/produtores")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>

          <SaveButton type="submit">
            <FiSave size={20} />
            {method === "add" ? "Cadastrar Produtor" : "Atualizar Produtor"}
          </SaveButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default FormProducer;
