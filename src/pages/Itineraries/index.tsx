import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { FiPlusCircle, FiSearch } from "react-icons/fi";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import Button from "../../components/Button";
import ItineraryCard from "../../components/ItineraryCard";
import { Itinerary } from "../../types/Itinerary";

import {
  Container,
  Content,
  HeaderPage,
  FiltersContainer,
  SearchInput,
  CardsGrid,
  NoResults,
} from "../Producers/styles";

const asItineraries = (payload: unknown): Itinerary[] => {
  if (Array.isArray(payload)) {
    return payload as Itinerary[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: Itinerary[] }).data;
  }

  return [];
};

const Itineraries: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadItineraries = useCallback(() => {
    setIsFetching(true);
    api
      .get("/itineraries")
      .then((res) => {
        setItineraries(asItineraries(res.data));
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(error, "Erro ao carregar roteiros"),
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updated = await api.patch(`/itineraries/${id}/toggle-active`);
        setItineraries((prev) =>
          prev.map((item) => (item.id === id ? updated.data : item))
        );
        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status do roteiro alterado com sucesso",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: getApiErrorMessage(
            error,
            "Erro ao alterar status do roteiro"
          ),
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    loadItineraries();
  }, [loadItineraries]);

  const filtered = itineraries.filter((item) => {
    const term = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.duration?.toLowerCase().includes(term)
    );
  });

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Roteiros</h1>
            <hr />
          </div>
          <Link to="/roteiros/novo">
            <Button type="button">Adicionar Roteiro</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, introdução ou duração..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </SearchInput>
        </FiltersContainer>

        {isFetching ? (
          <p className="fetching">Carregando...</p>
        ) : (
          <>
            <CardsGrid>
              {filtered.map((item) => (
                <ItineraryCard
                  key={item.id}
                  itinerary={item}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </CardsGrid>
            {filtered.length === 0 && (
              <NoResults>
                {searchText
                  ? "Nenhum roteiro encontrado com os filtros aplicados"
                  : "Nenhum roteiro cadastrado"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Itineraries;
