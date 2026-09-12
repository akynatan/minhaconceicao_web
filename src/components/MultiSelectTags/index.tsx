import React, { useState, useEffect, useRef } from "react";
import { useField } from "@unform/core";
import { FiChevronDown, FiX } from "react-icons/fi";
import api from "../../services/api";
import { Tag } from "../../types/Tag";
import { TagType } from "../../enums/TagType";
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
} from "../MultiSelectCategories/styles";

interface MultiSelectTagsProps {
  name: string;
  placeholder?: string;
  tagType?: TagType;
}

const MultiSelectTags: React.FC<MultiSelectTagsProps> = ({
  name,
  placeholder = "Selecione as tags",
  tagType = TagType.PLACE_TO_EAT,
}) => {
  const { fieldName, defaultValue = [], error, registerField } = useField(name);
  const { addToast } = useToast();

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: containerRef.current,
      getValue: () => selectedTags,
      setValue: (_, value) => setSelectedTags(value || []),
      clearValue: () => setSelectedTags([]),
    });
  }, [fieldName, registerField, selectedTags]);

  useEffect(() => {
    loadTags();
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

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tag?type=${tagType}`);
      setTags(response.data);
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar",
        description: "Erro ao carregar tags",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTag = (tagId: string) => {
    const newSelected = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    setSelectedTags(newSelected);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  const getSelectedTagNames = () => {
    return tags
      .filter((tag) => selectedTags.includes(tag.id))
      .map((tag) => tag.name);
  };

  const getAvailableTags = () => {
    return tags.filter((tag) => !selectedTags.includes(tag.id));
  };

  return (
    <Container ref={containerRef} isErrored={!!error}>
      <SelectButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span>
          {selectedTags.length > 0
            ? `${selectedTags.length} tag(s) selecionada(s)`
            : placeholder}
        </span>
        <FiChevronDown className={isOpen ? "open" : ""} />
      </SelectButton>

      {selectedTags.length > 0 && (
        <SelectedItems>
          {getSelectedTagNames().map((name, index) => (
            <SelectedItem key={selectedTags[index]}>
              <span>{name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(selectedTags[index])}
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
            <LoadingMessage>Carregando tags...</LoadingMessage>
          ) : getAvailableTags().length === 0 ? (
            <LoadingMessage>
              {tags.length === 0
                ? "Nenhuma tag disponível"
                : "Todas as tags foram selecionadas"}
            </LoadingMessage>
          ) : (
            getAvailableTags().map((tag) => (
              <DropdownItem key={tag.id} onClick={() => handleToggleTag(tag.id)}>
                {tag.name}
              </DropdownItem>
            ))
          )}
        </Dropdown>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default MultiSelectTags;
