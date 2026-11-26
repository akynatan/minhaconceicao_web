import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { FiPlusCircle, FiSearch, FiTrash2 } from "react-icons/fi";
import { HiPencil } from "react-icons/hi";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import { taxonomyDeleteError } from "../../utils/taxonomyDeleteError";
import asArray from "../../utils/asArray";
import Button from "../../components/Button";
import LucideIcon from "../../components/LucideIcon";
import { Category } from "../../types/Category";
import {
  categoryTypeLabel,
  categoryTypeOptions,
  isCategoryType,
} from "../../enums/CategoryType";

import {
  Container,
  Content,
  FiltersContainer,
  HeaderPage,
  NoResults,
  SearchInput,
} from "../Producers/styles";
import {
  Actions,
  DeleteButton,
  EditLink,
  FilterRow,
  IconBadge,
  KeyText,
  NameCell,
  Swatch,
  Swatches,
  Table,
  TableWrap,
} from "./styles";

const Categories: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const typeParam = params.get("type") ?? "";
  const type = isCategoryType(typeParam) ? typeParam : "";
  const [isFetching, setIsFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadCategories = useCallback(() => {
    setIsFetching(true);
    api
      .get("/category", { params: type ? { type } : undefined })
      .then((res) => {
        setCategories(asArray<Category>(res.data));
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(error, "Erro ao carregar categorias"),
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast, type]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = useCallback(
    async (category: Category) => {
      if (!window.confirm(`Tem certeza que deseja excluir "${category.name}"?`)) {
        return;
      }

      try {
        await api.delete(`/category/${category.id}`);
        setCategories((current) =>
          current.filter((item) => item.id !== category.id)
        );
        addToast({
          type: "success",
          title: "Categoria excluída",
          description: "Categoria excluída com sucesso",
        });
      } catch (error) {
        const failure = taxonomyDeleteError(error, "categoria");
        addToast({
          type: "error",
          title: failure.title,
          description: failure.description,
        });
      }
    },
    [addToast]
  );

  const filtered = categories.filter((item) => {
    const term = searchText.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.key?.toLowerCase().includes(term) ||
      item.icon?.toLowerCase().includes(term)
    );
  });

  const addPath = type
    ? `/categorias/nova?type=${encodeURIComponent(type)}`
    : "/categorias/nova";

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Categorias</h1>
            <hr />
          </div>
          <Link to={addPath}>
            <Button type="button">Adicionar Categoria</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <FilterRow>
            <select
              aria-label="Tipo"
              value={type}
              onChange={(event) => {
                const next = event.target.value;
                setParams(next ? { type: next } : {});
              }}
            >
              <option value="">Todos os tipos</option>
              {categoryTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SearchInput>
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="Buscar por nome, descrição, chave ou ícone..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </SearchInput>
          </FilterRow>
        </FiltersContainer>

        {isFetching ? (
          <p className="fetching">Carregando...</p>
        ) : filtered.length === 0 ? (
          <NoResults>
            {searchText || type
              ? "Nenhuma categoria encontrada com os filtros aplicados"
              : "Nenhuma categoria cadastrada"}
          </NoResults>
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>Ícone</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Cores</th>
                  <th>Peso</th>
                  <th>Chave</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <Actions>
                        <IconBadge
                          $background={category.colorSecondary}
                          $color={category.colorPrimary}
                          title={category.icon}
                        >
                          <LucideIcon
                            name={category.icon}
                            size={20}
                            color={category.colorPrimary}
                          />
                        </IconBadge>
                        <KeyText>{category.icon || "—"}</KeyText>
                      </Actions>
                    </td>
                    <td>
                      <NameCell>
                        <strong>{category.name}</strong>
                        {category.description && (
                          <span>{category.description}</span>
                        )}
                      </NameCell>
                    </td>
                    <td>{categoryTypeLabel(category.type)}</td>
                    <td>
                      <Swatches>
                        <Swatch
                          $color={category.colorPrimary}
                          title={category.colorPrimary}
                        />
                        <Swatch
                          $color={category.colorSecondary}
                          title={category.colorSecondary}
                        />
                      </Swatches>
                    </td>
                    <td>{category.weight ?? 0}</td>
                    <td>
                      <KeyText>{category.key}</KeyText>
                    </td>
                    <td>
                      <Actions>
                        <EditLink
                          to={`/categorias/${category.id}?type=${encodeURIComponent(category.type)}`}
                        >
                          <HiPencil size={16} />
                          Editar
                        </EditLink>
                        <DeleteButton
                          type="button"
                          onClick={() => handleDelete(category)}
                        >
                          <FiTrash2 size={16} />
                          Excluir
                        </DeleteButton>
                      </Actions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Content>
    </Container>
  );
};

export default Categories;
