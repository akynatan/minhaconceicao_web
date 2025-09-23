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
import { PlaceToEat, Category } from "../../types/PlaceToEat";
import Button from "../../components/Button";
import PlaceToEatCard from "../../components/PlaceToEatCard";
import { useToast } from "../../hooks/toast";

const PlacesToEat: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [placesToEat, setPlacesToEat] = useState<PlaceToEat[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceToEat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadPlacesToEat = useCallback(() => {
    setIsFetching(true);
    api
      .get("/places-to-eat")
      .then((res) => {
        setPlacesToEat(res.data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar lugares para comer",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const loadCategories = useCallback(() => {
    api
      .get("/category?type=place_to_eat")
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
    loadPlacesToEat();
    loadCategories();
  }, [loadPlacesToEat, loadCategories]);

  useEffect(() => {
    let filtered = placesToEat;

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter((place) =>
        place.categories.some((cat) => cat.categoryId === selectedCategory)
      );
    }

    // Filtro por texto
    if (searchText) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchText.toLowerCase()) ||
          place.description.toLowerCase().includes(searchText.toLowerCase()) ||
          place.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredPlaces(filtered);
  }, [placesToEat, selectedCategory, searchText]);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/places-to-eat/${id}/toggle-status`, {
        isActive: !currentStatus,
      });

      addToast({
        type: "success",
        title: "Sucesso",
        description: `Local ${
          !currentStatus ? "ativado" : "desativado"
        } com sucesso`,
      });

      loadPlacesToEat();
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro",
        description: "Erro ao alterar status do local",
      });
    }
  };

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Lugares para Comer</h1>
            <hr />
          </div>
          <Link to="/lugares-para-comer/add">
            <Button type="button">Adicionar Local</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição ou endereço..."
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
          <p className="fetching">Carregando...</p>
        ) : (
          <>
            <CardsGrid>
              {filteredPlaces.map((place) => (
                <PlaceToEatCard
                  key={place.id}
                  place={place}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </CardsGrid>

            {!isFetching && filteredPlaces.length === 0 && (
              <NoResults>
                {searchText || selectedCategory
                  ? "Nenhum local encontrado com os filtros aplicados"
                  : "Nenhum local cadastrado"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default PlacesToEat;
