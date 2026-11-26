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
import { Tag } from "../../types/Tag";
import { isTagType, tagTypeLabel, tagTypeOptions } from "../../enums/TagType";

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
} from "../Categories/styles";

const Tags: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const typeParam = params.get("type") ?? "";
  const type = isTagType(typeParam) ? typeParam : "";
  const [isFetching, setIsFetching] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadTags = useCallback(() => {
    setIsFetching(true);
    api
      .get("/tag", { params: type ? { type } : undefined })
      .then((res) => {
        setTags(asArray<Tag>(res.data));
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(error, "Erro ao carregar tags"),
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast, type]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const handleDelete = useCallback(
    async (tag: Tag) => {
      if (!window.confirm(`Tem certeza que deseja excluir "${tag.name}"?`)) {
        return;
      }

      try {
        await api.delete(`/tag/${tag.id}`);
        setTags((current) => current.filter((item) => item.id !== tag.id));
        addToast({
          type: "success",
          title: "Tag excluída",
          description: "Tag excluída com sucesso",
        });
      } catch (error) {
        const failure = taxonomyDeleteError(error, "tag");
        addToast({
          type: "error",
          title: failure.title,
          description: failure.description,
        });
      }
    },
    [addToast]
  );

  const filtered = tags.filter((item) => {
    const term = searchText.trim().toLowerCase();
    if (!term) {
      return true;
    }

    return (
      item.name?.toLowerCase().includes(term) ||
      item.key?.toLowerCase().includes(term) ||
      item.icon?.toLowerCase().includes(term)
    );
  });

  const addPath = type ? `/tags/nova?type=${encodeURIComponent(type)}` : "/tags/nova";

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Tags</h1>
            <hr />
          </div>
          <Link to={addPath}>
            <Button type="button">Adicionar Tag</Button>
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
              {tagTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SearchInput>
              <FiSearch size={20} />
              <input
                type="text"
                placeholder="Buscar por nome, chave ou ícone..."
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
              ? "Nenhuma tag encontrada com os filtros aplicados"
              : "Nenhuma tag cadastrada"}
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
                {filtered.map((tag) => (
                  <tr key={tag.id}>
                    <td>
                      <Actions>
                        <IconBadge
                          $background={tag.colorSecondary}
                          $color={tag.colorPrimary}
                          title={tag.icon}
                        >
                          <LucideIcon
                            name={tag.icon}
                            size={20}
                            color={tag.colorPrimary}
                          />
                        </IconBadge>
                        <KeyText>{tag.icon || "—"}</KeyText>
                      </Actions>
                    </td>
                    <td>
                      <NameCell>
                        <strong>{tag.name}</strong>
                      </NameCell>
                    </td>
                    <td>{tagTypeLabel(tag.type)}</td>
                    <td>
                      <Swatches>
                        <Swatch $color={tag.colorPrimary} title={tag.colorPrimary} />
                        <Swatch
                          $color={tag.colorSecondary}
                          title={tag.colorSecondary}
                        />
                      </Swatches>
                    </td>
                    <td>{tag.weight ?? 0}</td>
                    <td>
                      <KeyText>{tag.key}</KeyText>
                    </td>
                    <td>
                      <Actions>
                        <EditLink
                          to={`/tags/${tag.id}?type=${encodeURIComponent(tag.type)}`}
                        >
                          <HiPencil size={16} />
                          Editar
                        </EditLink>
                        <DeleteButton type="button" onClick={() => handleDelete(tag)}>
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

export default Tags;
