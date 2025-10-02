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
import { Attraction, Category } from "../../types/Attraction";
import { CategoryType } from "../../enums/CategoryType";
import Button from "../../components/Button";
import AttractionCard from "../../components/AttractionCard";
import { useToast } from "../../hooks/toast";

const Attractions: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>(
    []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadAttractions = useCallback(() => {
    setIsFetching(true);
    api
      .get("/attractions")
      .then((res) => {
        setAttractions(res.data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar atrações",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updatedAttraction = await api.patch(
          `/attractions/${id}/toggle-active`
        );

        setAttractions((prev) =>
          prev.map((attraction) =>
            attraction.id === id ? updatedAttraction.data : attraction
          )
        );

        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status da atração alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status da atração",
        });
      }
    },
    [addToast]
  );

  const loadCategories = useCallback(() => {
    api
      .get(`/category?type=${CategoryType.ATTRACTIONS}`)
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
    loadAttractions();
    loadCategories();
  }, [loadAttractions, loadCategories]);

  useEffect(() => {
    let filtered = attractions;

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(
        (attraction) => attraction.categoryId === selectedCategory
      );
    }

    // Filtro por texto
    if (searchText) {
      filtered = filtered.filter(
        (attraction) =>
          attraction.name.toLowerCase().includes(searchText.toLowerCase()) ||
          attraction.description
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          attraction.howToArrive
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    setFilteredAttractions(filtered);
  }, [attractions, selectedCategory, searchText]);

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Atrações Turísticas</h1>
            <hr />
          </div>
          <Link to="/atracoes/nova">
            <Button type="button">Adicionar Atração</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição ou como chegar..."
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
              {filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </CardsGrid>

            {!isFetching && filteredAttractions.length === 0 && (
              <NoResults>
                {searchText || selectedCategory
                  ? "Nenhuma atração encontrada com os filtros aplicados"
                  : "Nenhuma atração cadastrada"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Attractions;
