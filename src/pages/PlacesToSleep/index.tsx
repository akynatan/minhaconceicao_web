/* eslint-disable no-alert */
import React, { useEffect, useState, useCallback } from "react";

import { Link } from "react-router";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import {
  Container,
  Content,
  HeaderPage,
  FiltersContainer,
  SearchInput,
  CategoriesFilter,
  CategoryButton,
  CardsGrid,
  NoResults,
} from "./styles";
import api from "../../services/api";
import { PlaceToSleep } from "../../types/PlaceToSleep";
import { Category } from "../../types/Category";
import { CategoryType } from "../../enums/CategoryType";
import Button from "../../components/Button";
import PlaceToSleepCard from "../../components/PlaceToSleepCard";
import { useToast } from "../../hooks/toast";

const PlacesToSleep: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [placesToSleep, setPlacesToSleep] = useState<PlaceToSleep[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceToSleep[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadPlacesToSleep = useCallback(() => {
    setIsFetching(true);
    api
      .get("/places-to-sleep")
      .then((res) => {
        setPlacesToSleep(res.data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar lugares para dormir",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const loadCategories = useCallback(() => {
    api
      .get(`/category?type=${CategoryType.PLACE_TO_SLEEP}`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar categorias",
        });
      });
  }, [addToast]);

  useEffect(() => {
    loadPlacesToSleep();
    loadCategories();
  }, [loadPlacesToSleep, loadCategories]);

  useEffect(() => {
    let filtered = placesToSleep;

    if (searchText) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchText.toLowerCase()) ||
          place.address.toLowerCase().includes(searchText.toLowerCase()) ||
          place.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((place) =>
        place.categories.some(
          (category) => category.category.id === selectedCategory
        )
      );
    }

    setFilteredPlaces(filtered);
  }, [placesToSleep, searchText, selectedCategory]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const placeToSleepUpdated = await api.patch(
          `/places-to-sleep/${id}/toggle-active`
        );
        setPlacesToSleep((prev) =>
          prev.map((place) =>
            place.id === id ? placeToSleepUpdated.data : place
          )
        );
        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status do local alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status do local",
        });
      }
    },
    [addToast]
  );

  // const handleDelete = useCallback(
  //   async (id: string) => {
  //     if (window.confirm("Tem certeza que deseja excluir este local?")) {
  //       try {
  //         await api.delete(`/places-to-sleep/${id}`);
  //         setPlacesToSleep((prev) => prev.filter((place) => place.id !== id));
  //         addToast({
  //           type: "success",
  //           title: "Local excluído",
  //           description: "Local excluído com sucesso",
  //         });
  //       } catch {
  //         addToast({
  //           type: "error",
  //           title: "Erro ao excluir",
  //           description: "Erro ao excluir local",
  //         });
  //       }
  //     }
  //   },
  //   [addToast]
  // );

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Lugares para Dormir</h1>
            <hr />
          </div>
          <Link to="/lugares-para-dormir/add">
            <Button type="button">Adicionar Local</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, endereço ou descrição..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </SearchInput>

          <CategoriesFilter>
            <CategoryButton
              isActive={selectedCategory === ""}
              onClick={() => setSelectedCategory("")}
            >
              Todas
            </CategoryButton>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoriesFilter>
        </FiltersContainer>

        {isFetching ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Carregando...
          </div>
        ) : filteredPlaces.length === 0 ? (
          <NoResults>
            <h3>Nenhum local encontrado</h3>
            <p>
              {searchText || selectedCategory
                ? "Tente ajustar os filtros de busca"
                : "Adicione o primeiro local para começar"}
            </p>
          </NoResults>
        ) : (
          <CardsGrid>
            {filteredPlaces.map((place) => (
              <PlaceToSleepCard
                key={place.id}
                place={place}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </CardsGrid>
        )}
      </Content>
    </Container>
  );
};

export default PlacesToSleep;
