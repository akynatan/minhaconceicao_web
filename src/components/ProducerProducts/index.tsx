import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiDollarSign, FiPlus, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import Input from "../Input";
import Textarea from "../Textarea";
import FileUpload from "../FileUpload";
import Select from "../Select";
import { Product, CreateProductProducerData } from "../../types/Producer";

import {
  ProductsContainer,
  ProductItem,
  ProductHeader,
  ProductTitle,
  RemoveProduct,
  AddProduct,
  ProductFields,
  ProductDescription,
  ProductImage,
} from "./styles";

interface ProducerProductsProps {
  initialProducts?: CreateProductProducerData[];
  onChange: (products: CreateProductProducerData[]) => void;
}

const ProducerProducts: React.FC<ProducerProductsProps> = ({
  initialProducts = [],
  onChange,
}) => {
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [producerProducts, setProducerProducts] =
    useState<CreateProductProducerData[]>(initialProducts);
  const initializedRef = useRef(false);

  // Carregar produtos disponíveis
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos",
        });
      }
    };

    loadProducts();
  }, [addToast]);

  // Inicializar produtos apenas uma vez
  useEffect(() => {
    if (initialProducts.length > 0 && !initializedRef.current) {
      setProducerProducts(initialProducts);
      onChange(initialProducts);
      initializedRef.current = true;
    }
  }, [initialProducts, onChange]);

  // Adicionar produto
  const addProduct = useCallback(() => {
    const newProducts = [
      ...producerProducts,
      {
        productId: "",
        description: "",
        value: 0,
        image: "",
      },
    ];
    setProducerProducts(newProducts);
    onChange(newProducts);
  }, [producerProducts, onChange]);

  const removeProduct = useCallback(
    (index: number) => {
      const newProducts = producerProducts.filter((_, i) => i !== index);
      setProducerProducts(newProducts);
      onChange(newProducts);
    },
    [producerProducts, onChange]
  );

  const updateProduct = useCallback(
    (index: number, fields: any) => {
      const newProducts = producerProducts.map((product, i) =>
        i === index ? { ...product, ...fields } : product
      );
      setProducerProducts(newProducts);
      onChange(newProducts);
    },
    [producerProducts, onChange]
  );

  return (
    <ProductsContainer>
      {Array.isArray(producerProducts) &&
        producerProducts.map((product, index) => {
          const selectedProduct = Array.isArray(products)
            ? products.find((p) => p.id === product.productId)
            : null;

          return (
            <ProductItem key={index}>
              <ProductHeader>
                <ProductTitle>
                  <FiDollarSign size={20} />
                  {selectedProduct
                    ? selectedProduct.name
                    : "Produto não selecionado"}
                </ProductTitle>
                <RemoveProduct
                  type="button"
                  onClick={() => removeProduct(index)}
                >
                  <FiTrash2 size={16} />
                  Remover
                </RemoveProduct>
              </ProductHeader>

              <ProductFields>
                <Select
                  name={`product-${index}`}
                  placeholder="Selecione o produto"
                  options={
                    Array.isArray(products)
                      ? products.map((p) => ({
                          label: p.name,
                          value: p.id,
                        }))
                      : []
                  }
                  defaultValue={
                    product.productId
                      ? {
                          label: selectedProduct?.name,
                          value: product.productId,
                        }
                      : undefined
                  }
                  onChange={(option: any) =>
                    updateProduct(index, { productId: option?.value || "" })
                  }
                />
                <Input
                  name={`value-${index}`}
                  type="number"
                  icon={FiDollarSign}
                  placeholder="Valor (opcional)"
                  value={product.value?.toString() || ""}
                  onChange={(e) =>
                    updateProduct(index, {
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.01"
                />
              </ProductFields>

              <ProductDescription>
                <Textarea
                  name={`description-${index}`}
                  placeholder="Descrição do produto (máximo 100 caracteres)"
                  value={product.description || ""}
                  onChange={(e) =>
                    updateProduct(index, { description: e.target.value })
                  }
                  maxLength={100}
                  {...{ rows: 2 }}
                />
              </ProductDescription>

              <ProductImage>
                <FileUpload
                  name={`image-${index}`}
                  placeholder="Selecione a imagem do produto"
                  accept="image/*"
                  maxSize={5}
                  onUploadSuccess={(fileData) =>
                    updateProduct(index, {
                      image: fileData.key,
                      imageUrl: fileData.imageUrl,
                    })
                  }
                  existingPhoto={
                    product.imageUrl
                      ? {
                          key: product.image,
                          photoUrl: product.imageUrl,
                        }
                      : undefined
                  }
                />
              </ProductImage>
            </ProductItem>
          );
        })}

      <AddProduct type="button" onClick={addProduct}>
        <FiPlus size={20} />
        Adicionar Produto
      </AddProduct>
    </ProductsContainer>
  );
};

export default ProducerProducts;
