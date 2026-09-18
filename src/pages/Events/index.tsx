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
import { EventItem } from "../../types/Event";
import Button from "../../components/Button";
import EventCard from "../../components/EventCard";
import { useToast } from "../../hooks/toast";

const Events: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadEvents = useCallback(() => {
    setIsFetching(true);
    api
      .get("/events")
      .then((res) => {
        setEvents(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar eventos",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter((item) => {
    const term = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term) ||
      item.address?.toLowerCase().includes(term)
    );
  });

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Eventos</h1>
            <hr />
          </div>
          <Link to="/eventos/novo">
            <Button type="button">Adicionar Evento</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, local ou endereço..."
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
              {filteredEvents.map((item) => (
                <EventCard key={item.id} event={item} />
              ))}
            </CardsGrid>
            {filteredEvents.length === 0 && (
              <NoResults>
                {searchText
                  ? "Nenhum evento encontrado com os filtros aplicados"
                  : "Nenhum evento cadastrado"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Events;
