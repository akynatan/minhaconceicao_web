import React, { useState, useEffect, useCallback, useRef } from "react";
import { FiDollarSign, FiPlus, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import Input from "../Input";
import Textarea from "../Textarea";
import FileUpload from "../FileUpload";
import Select from "../Select";
import { Category } from "../../types/Category";
import { CategoryType } from "../../enums/CategoryType";
import { CreateProductArtisanData } from "../../types/Artisan";

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
} from "../ProducerProducts/styles";

interface ArtisanProductsProps {
  initialProducts?: CreateProductArtisanData[];
  onChange: (products: CreateProductArtisanData[]) => void;
}

const ArtisanProducts: React.FC<ArtisanProductsProps> = ({
  initialProducts = [],
  onChange,
}) => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [artisanProducts, setArtisanProducts] =
    useState<CreateProductArtisanData[]>(initialProducts);
  const initializedRef = useRef(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [artisansRes, producersRes] = await Promise.all([
          api.get(`/category?type=${CategoryType.ARTISANS}`),
          api.get(`/category?type=producers`),
        ]);
        const artisanCategories = Array.isArray(artisansRes.data)
          ? artisansRes.data
          : [];
        const producerCategories = Array.isArray(producersRes.data)
          ? producersRes.data
          : [];
        setCategories(
          artisanCategories.length > 0 ? artisanCategories : producerCategories
        );
      } catch {
        addToast({
          type: "error",
          title: "Erro ao carregar categorias",
          description: "Não foi possível carregar as categorias dos produtos",
        });
      }
    };

    loadCategories();
  }, [addToast]);

  useEffect(() => {
    if (initialProducts.length > 0 && !initializedRef.current) {
      setArtisanProducts(initialProducts);
      onChange(initialProducts);
      initializedRef.current = true;
    }
  }, [initialProducts, onChange]);

  const addProduct = useCallback(() => {
    const newProducts = [
      ...artisanProducts,
      {
        name: "",
        categoryId: "",
        description: "",
        value: 0,
        image: "",
      },
    ];
    setArtisanProducts(newProducts);
    onChange(newProducts);
  }, [artisanProducts, onChange]);

  const removeProduct = useCallback(
    (index: number) => {
      const newProducts = artisanProducts.filter((_, i) => i !== index);
      setArtisanProducts(newProducts);
      onChange(newProducts);
    },
    [artisanProducts, onChange]
  );

  const updateProduct = useCallback(
    (index: number, fields: Partial<CreateProductArtisanData>) => {
      const newProducts = artisanProducts.map((product, i) =>
        i === index ? { ...product, ...fields } : product
      );
      setArtisanProducts(newProducts);
      onChange(newProducts);
    },
    [artisanProducts, onChange]
  );

  return (
    <ProductsContainer>
      {artisanProducts.map((product, index) => {
        const selectedCategory = categories.find(
          (category) => category.id === product.categoryId
        );

        return (
          <ProductItem key={index}>
            <ProductHeader>
              <ProductTitle>
                <FiDollarSign size={20} />
                {product.name || "Novo produto"}
              </ProductTitle>
              <RemoveProduct type="button" onClick={() => removeProduct(index)}>
                <FiTrash2 size={16} />
                Remover
              </RemoveProduct>
            </ProductHeader>

            <ProductFields>
              <Input
                name={`artisan-product-name-${index}`}
                placeholder="Nome do produto"
                value={product.name}
                onChange={(e) => updateProduct(index, { name: e.target.value })}
              />
              <Select
                name={`artisan-product-category-${index}`}
                placeholder="Categoria"
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                defaultValue={
                  product.categoryId
                    ? {
                        label: selectedCategory?.name,
                        value: product.categoryId,
                      }
                    : undefined
                }
                onChange={(option: any) =>
                  updateProduct(index, { categoryId: option?.value || "" })
                }
              />
              <Input
                name={`artisan-product-value-${index}`}
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
                name={`artisan-product-description-${index}`}
                placeholder="Descrição do produto"
                value={product.description || ""}
                onChange={(e) =>
                  updateProduct(index, { description: e.target.value })
                }
                {...{ rows: 2 }}
              />
            </ProductDescription>

            <ProductImage>
              <FileUpload
                name={`artisan-product-image-${index}`}
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

export default ArtisanProducts;
