import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import {
  Container,
  Content,
  HeaderPage,
  FiltersContainer,
  SearchInput,
  CardsGrid,
  NoResults,
} from "./styles";
import api from "../../services/api";
import { Guide } from "../../types/Guide";
import Button from "../../components/Button";
import GuideCard from "../../components/GuideCard";
import { useToast } from "../../hooks/toast";

const Guides: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadGuides = useCallback(() => {
    setIsFetching(true);
    api
      .get("/guides")
      .then((res) => {
        setGuides(res.data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar guias",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updatedGuide = await api.patch(`/guides/${id}/toggle-active`);

        setGuides((prev) =>
          prev.map((guide) => (guide.id === id ? updatedGuide.data : guide))
        );

        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status do guia alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status do guia",
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  useEffect(() => {
    let filtered = guides;

    // Filtro por texto
    if (searchText) {
      filtered = filtered.filter(
        (guide) =>
          guide.name.toLowerCase().includes(searchText.toLowerCase()) ||
          guide.description.toLowerCase().includes(searchText.toLowerCase()) ||
          (guide.specialties &&
            guide.specialties
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          guide.email.toLowerCase().includes(searchText.toLowerCase()) ||
          guide.phone.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredGuides(filtered);
  }, [guides, searchText]);

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Guias</h1>
            <hr />
          </div>
          <Link to="/guias/novo">
            <Button type="button">Adicionar Guia</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição, especialidades, email ou telefone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </SearchInput>
        </FiltersContainer>

        {isFetching ? (
          <p className="fetching">Carregando...</p>
        ) : (
          <>
            <CardsGrid>
              {filteredGuides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </CardsGrid>

            {!isFetching && filteredGuides.length === 0 && (
              <NoResults>
                {searchText
                  ? "Nenhum guia encontrado com os filtros aplicados"
                  : "Nenhum guia cadastrado"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Guides;
