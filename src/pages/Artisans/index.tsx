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
} from "../Producers/styles";
import api from "../../services/api";
import { Artisan } from "../../types/Artisan";
import Button from "../../components/Button";
import ArtisanCard from "../../components/ArtisanCard";
import { useToast } from "../../hooks/toast";

const Artisans: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadArtisans = useCallback(() => {
    setIsFetching(true);
    api
      .get("/artisans", { params: { limit: 500 } })
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.artisans || [];
        setArtisans(data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar artesãos",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updatedArtisan = await api.patch(`/artisans/${id}/toggle-active`);
        setArtisans((prev) =>
          prev.map((artisan) =>
            artisan.id === id ? updatedArtisan.data : artisan
          )
        );
        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status do artesão alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status do artesão",
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    loadArtisans();
  }, [loadArtisans]);

  const filteredArtisans = artisans.filter((item) => {
    const term = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.phone?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term)
    );
  });

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Artesãos</h1>
            <hr />
          </div>
          <Link to="/artesaos/novo">
            <Button type="button">Adicionar Artesão</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição, email ou telefone..."
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
              {filteredArtisans.map((artisan) => (
                <ArtisanCard
                  key={artisan.id}
                  artisan={artisan}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </CardsGrid>
            {filteredArtisans.length === 0 && (
              <NoResults>
                {searchText
                  ? "Nenhum artesão encontrado com os filtros aplicados"
                  : "Nenhum artesão cadastrado"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Artisans;
