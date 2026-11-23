import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { FiArrowLeft, FiPlusCircle, FiSearch } from "react-icons/fi";

import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import getApiErrorMessage from "../../utils/getApiErrorMessage";
import Button from "../../components/Button";
import PlaceToSleepRoomCard from "../../components/PlaceToSleepRoomCard";
import { PlaceToSleepRoom } from "../../types/PlaceToSleepRoom";

import {
  Container,
  Content,
  HeaderPage,
  BackLink,
  FiltersContainer,
  SearchInput,
  StatusFilter,
  StatusButton,
  CardsGrid,
  NoResults,
} from "./styles";

type StatusFilterValue = "all" | "active" | "inactive";

const sortRooms = (items: PlaceToSleepRoom[]) =>
  [...items].sort((left, right) => {
    const positionDiff = (left.position ?? 0) - (right.position ?? 0);
    if (positionDiff !== 0) {
      return positionDiff;
    }

    return (
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  });

const toRoomList = (payload: unknown): PlaceToSleepRoom[] => {
  if (Array.isArray(payload)) {
    return payload as PlaceToSleepRoom[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: PlaceToSleepRoom[] }).data;
  }

  return [];
};

const PlaceToSleepRooms: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(true);
  const [placeName, setPlaceName] = useState("");
  const [rooms, setRooms] = useState<PlaceToSleepRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<PlaceToSleepRoom[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");

  const loadPlace = useCallback(() => {
    if (!id) {
      return;
    }

    api
      .get(`/places-to-sleep/${id}`)
      .then((res) => {
        setPlaceName(res.data?.name || "");
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(
            error,
            "Erro ao carregar o lugar para dormir"
          ),
        });
      });
  }, [addToast, id]);

  const loadRooms = useCallback(() => {
    if (!id) {
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    api
      .get("/rooms", { params: { placeToSleepId: id } })
      .then((res) => {
        setRooms(sortRooms(toRoomList(res.data)));
      })
      .catch((error) => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: getApiErrorMessage(error, "Erro ao carregar quartos"),
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast, id]);

  useEffect(() => {
    loadPlace();
    loadRooms();
  }, [loadPlace, loadRooms]);

  useEffect(() => {
    let filtered = rooms;

    if (searchText) {
      const term = searchText.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(term) ||
          room.description?.toLowerCase().includes(term) ||
          room.beds?.toLowerCase().includes(term)
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((room) => room.isActive);
    }

    if (statusFilter === "inactive") {
      filtered = filtered.filter((room) => !room.isActive);
    }

    setFilteredRooms(sortRooms(filtered));
  }, [rooms, searchText, statusFilter]);

  const handleToggleStatus = useCallback(
    async (roomId: string) => {
      try {
        const updated = await api.patch(`/rooms/${roomId}/toggle-active`);
        setRooms((prev) =>
          prev.map((room) => (room.id === roomId ? updated.data : room))
        );
        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status do quarto alterado com sucesso",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: getApiErrorMessage(
            error,
            "Erro ao alterar status do quarto"
          ),
        });
      }
    },
    [addToast]
  );

  const handleDelete = useCallback(
    async (roomId: string) => {
      if (!window.confirm("Tem certeza que deseja excluir este quarto?")) {
        return;
      }

      try {
        await api.delete(`/rooms/${roomId}`);
        setRooms((prev) => prev.filter((room) => room.id !== roomId));
        addToast({
          type: "success",
          title: "Quarto excluído",
          description: "Quarto excluído com sucesso",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Erro ao excluir",
          description: getApiErrorMessage(error, "Erro ao excluir quarto"),
        });
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <BackLink to={`/lugares-para-dormir/${id}`}>
          <FiArrowLeft />
          Voltar para o local
        </BackLink>
        <HeaderPage>
          <div>
            <h1>{placeName ? `Quartos de ${placeName}` : "Quartos"}</h1>
            <hr />
          </div>
          <Link to={`/lugares-para-dormir/${id}/quartos/add`}>
            <Button type="button">Adicionar Quarto</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição ou camas..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </SearchInput>

          <StatusFilter>
            <StatusButton
              type="button"
              isActive={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            >
              Todas
            </StatusButton>
            <StatusButton
              type="button"
              isActive={statusFilter === "active"}
              onClick={() => setStatusFilter("active")}
            >
              Ativas
            </StatusButton>
            <StatusButton
              type="button"
              isActive={statusFilter === "inactive"}
              onClick={() => setStatusFilter("inactive")}
            >
              Inativas
            </StatusButton>
          </StatusFilter>
        </FiltersContainer>

        {isFetching ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Carregando...
          </div>
        ) : filteredRooms.length === 0 ? (
          <NoResults>
            <h3>Nenhum quarto encontrado</h3>
            <p>
              {searchText || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Adicione o primeiro quarto desta hospedagem"}
            </p>
          </NoResults>
        ) : (
          <CardsGrid>
            {filteredRooms.map((room) => (
              <PlaceToSleepRoomCard
                key={room.id}
                room={room}
                lodgingId={id || ""}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </CardsGrid>
        )}
      </Content>
    </Container>
  );
};

export default PlaceToSleepRooms;
