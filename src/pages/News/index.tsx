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
import { News } from "../../types/News";
import Button from "../../components/Button";
import NewsCard from "../../components/NewsCard";
import { useToast } from "../../hooks/toast";

const NewsPage: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [news, setNews] = useState<News[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadNews = useCallback(() => {
    setIsFetching(true);
    api
      .get("/news")
      .then((res) => {
        setNews(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar notícias",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = news.filter((item) => {
    const term = searchText.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  });

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Notícias</h1>
            <hr />
          </div>
          <Link to="/noticias/nova">
            <Button type="button">Adicionar Notícia</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por título ou conteúdo..."
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
              {filteredNews.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </CardsGrid>
            {filteredNews.length === 0 && (
              <NoResults>
                {searchText
                  ? "Nenhuma notícia encontrada com os filtros aplicados"
                  : "Nenhuma notícia cadastrada"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default NewsPage;
