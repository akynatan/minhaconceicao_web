import React, { useEffect, useMemo, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import { FiSearch, FiX } from "react-icons/fi";

import {
  kebabToPascal,
  loadLucideCatalog,
  type LucideIconOption,
  toLucideKebab,
} from "../../utils/lucideIcons";

import {
  CloseButton,
  Empty,
  Footer,
  Grid,
  Header,
  IconButton,
  SearchBox,
} from "./styles";

const PAGE_SIZE = 120;

interface IconPickerProps {
  selected?: string;
  onSelect: (pascalName: string) => void;
  onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({
  selected,
  onSelect,
  onClose,
}) => {
  const [options, setOptions] = useState<LucideIconOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let active = true;

    loadLucideCatalog()
      .then((catalog) => {
        if (active) {
          setOptions(catalog.options);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const selectedKebab = toLucideKebab(selected);
  const selectedPascal = selectedKebab ? kebabToPascal(selectedKebab) : "";

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (!query) {
      return options;
    }

    return options.filter((option) => {
      const pascal = option.pascal.toLowerCase();
      const kebab = option.kebab.replace(/-/g, "");
      return pascal.includes(query) || kebab.includes(query);
    });
  }, [options, search]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <Header>
        <div>
          <h2>Escolher ícone</h2>
          <p>
            O valor salvo é o nome Lucide em PascalCase
            {selectedPascal ? `, agora ${selectedPascal}` : ""}.
          </p>
        </div>
        <CloseButton type="button" onClick={onClose} aria-label="Fechar">
          <FiX size={22} />
        </CloseButton>
      </Header>

      <SearchBox>
        <FiSearch size={18} />
        <input
          autoFocus
          type="search"
          placeholder="Buscar por nome, por exemplo Pizza ou Utensils"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </SearchBox>

      {loading ? (
        <Empty>Carregando ícones...</Empty>
      ) : visible.length === 0 ? (
        <Empty>Nenhum ícone encontrado</Empty>
      ) : (
        <Grid>
          {visible.map((option) => {
            const isSelected = option.kebab === selectedKebab;
            return (
              <IconButton
                key={option.kebab}
                type="button"
                $selected={isSelected}
                onClick={() => onSelect(option.pascal)}
                title={option.pascal}
              >
                <DynamicIcon
                  name={option.kebab as IconName}
                  size={24}
                  color="#333333"
                />
                <span>{option.pascal}</span>
              </IconButton>
            );
          })}
        </Grid>
      )}

      <Footer>
        <span>
          {loading
            ? "Carregando..."
            : `${Math.min(visibleCount, filtered.length)} de ${filtered.length} ícones`}
        </span>
        {visibleCount < filtered.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Mostrar mais
          </button>
        )}
      </Footer>
    </>
  );
};

export default IconPicker;
