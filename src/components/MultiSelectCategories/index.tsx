import React, { useState, useEffect, useRef } from "react";
import { useField } from "@unform/core";
import { FiChevronDown, FiX } from "react-icons/fi";
import api from "../../services/api";
import { Category } from "../../types/Category";
import { CategoryType } from "../../enums/CategoryType";
import { useToast } from "../../hooks/toast";
import {
  Container,
  SelectButton,
  SelectedItems,
  SelectedItem,
  Dropdown,
  DropdownItem,
  LoadingMessage,
  ErrorMessage,
} from "./styles";

interface MultiSelectCategoriesProps {
  name: string;
  placeholder?: string;
  categoryType?: CategoryType;
}

const MultiSelectCategories: React.FC<MultiSelectCategoriesProps> = ({
  name,
  placeholder = "Selecione as categorias",
  categoryType = CategoryType.PLACE_TO_EAT,
}) => {
  const { fieldName, defaultValue = [], error, registerField, clearError } =
    useField(name);
  const { addToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => selectedCategories,
      setValue: (_, value) => setSelectedCategories(value || []),
      clearValue: () => setSelectedCategories([]),
    });
  }, [fieldName, registerField, selectedCategories]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/category?type=${categoryType}`);
      setCategories(response.data);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar",
        description: "Erro ao carregar categorias",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelected);
    if (newSelected.length > 0) {
      clearError();
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = prev.filter((id) => id !== categoryId);
      if (next.length > 0) {
        clearError();
      }
      return next;
    });
  };

  const getSelectedCategoryItems = () => {
    return selectedCategories
      .map((id) => categories.find((category) => category.id === id))
      .filter((category): category is Category => !!category);
  };

  const getAvailableCategories = () => {
    return categories.filter((cat) => !selectedCategories.includes(cat.id));
  };

  return (
    <Container ref={containerRef} isErrored={!!error}>
      <SelectButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span>
          {selectedCategories.length > 0
            ? `${selectedCategories.length} categoria(s) selecionada(s)`
            : placeholder}
        </span>
        <FiChevronDown className={isOpen ? "open" : ""} />
      </SelectButton>

      {selectedCategories.length > 0 && (
        <SelectedItems>
          {getSelectedCategoryItems().map((category) => (
            <SelectedItem key={category.id}>
              <span>{category.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveCategory(category.id)}
              >
                <FiX size={14} />
              </button>
            </SelectedItem>
          ))}
        </SelectedItems>
      )}

      {isOpen && (
        <Dropdown>
          {loading ? (
            <LoadingMessage>Carregando categorias...</LoadingMessage>
          ) : getAvailableCategories().length === 0 ? (
            <LoadingMessage>
              {categories.length === 0
                ? "Nenhuma categoria disponível"
                : "Todas as categorias foram selecionadas"}
            </LoadingMessage>
          ) : (
            getAvailableCategories().map((category) => (
              <DropdownItem
                key={category.id}
                onClick={() => handleToggleCategory(category.id)}
              >
                {category.name}
              </DropdownItem>
            ))
          )}
        </Dropdown>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default MultiSelectCategories;
