import React, { useState, useEffect, useRef } from "react";
import { useField } from "@unform/core";
import { FiChevronDown, FiX } from "react-icons/fi";
import api from "../../services/api";
import { Attraction } from "../../types/Attraction";
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

interface MultiSelectAttractionsProps {
  name: string;
  placeholder?: string;
}

const MultiSelectAttractions: React.FC<MultiSelectAttractionsProps> = ({
  name,
  placeholder = "Selecione as atrações",
}) => {
  const { fieldName, defaultValue = [], error, registerField } = useField(name);
  const { addToast } = useToast();

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedAttractions, setSelectedAttractions] =
    useState<string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(`MultiSelectAttractions - Registrando campo: ${fieldName}`);
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => {
        console.log(
          `MultiSelectAttractions - getValue para ${fieldName}:`,
          selectedAttractions
        );
        return selectedAttractions;
      },
      setValue: (_, value) => {
        console.log(
          `MultiSelectAttractions - setValue para ${fieldName}:`,
          value
        );
        setSelectedAttractions(value || []);
      },
      clearValue: () => {
        console.log(`MultiSelectAttractions - clearValue para ${fieldName}`);
        setSelectedAttractions([]);
      },
    });
  }, [fieldName, registerField, selectedAttractions]);

  useEffect(() => {
    loadAttractions();
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

  const loadAttractions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/attractions?isActive=true");
      setAttractions(response.data);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar",
        description: "Erro ao carregar atrações",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttraction = (attractionId: string) => {
    const newSelected = selectedAttractions.includes(attractionId)
      ? selectedAttractions.filter((id) => id !== attractionId)
      : [...selectedAttractions, attractionId];

    setSelectedAttractions(newSelected);
  };

  const handleRemoveAttraction = (attractionId: string) => {
    setSelectedAttractions((prev) => prev.filter((id) => id !== attractionId));
  };

  const getSelectedAttractionNames = () => {
    return attractions
      .filter((attraction) => selectedAttractions.includes(attraction.id))
      .map((attraction) => attraction.name);
  };

  const getAvailableAttractions = () => {
    return attractions.filter(
      (attraction) => !selectedAttractions.includes(attraction.id)
    );
  };

  return (
    <Container ref={containerRef} isErrored={!!error}>
      <SelectButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span>
          {selectedAttractions.length > 0
            ? `${selectedAttractions.length} atração(ões) selecionada(s)`
            : placeholder}
        </span>
        <FiChevronDown className={isOpen ? "open" : ""} />
      </SelectButton>

      {selectedAttractions.length > 0 && (
        <SelectedItems>
          {getSelectedAttractionNames().map((name, index) => (
            <SelectedItem key={selectedAttractions[index]}>
              <span>{name}</span>
              <button
                type="button"
                onClick={() =>
                  handleRemoveAttraction(selectedAttractions[index])
                }
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
            <LoadingMessage>Carregando atrações...</LoadingMessage>
          ) : getAvailableAttractions().length === 0 ? (
            <LoadingMessage>
              {attractions.length === 0
                ? "Nenhuma atração disponível"
                : "Todas as atrações foram selecionadas"}
            </LoadingMessage>
          ) : (
            getAvailableAttractions().map((attraction) => (
              <DropdownItem
                key={attraction.id}
                onClick={() => handleToggleAttraction(attraction.id)}
              >
                {attraction.name}
              </DropdownItem>
            ))
          )}
        </Dropdown>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default MultiSelectAttractions;
