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
import { Producer } from "../../types/Producer";
import Button from "../../components/Button";
import ProducerCard from "../../components/ProducerCard";
import { useToast } from "../../hooks/toast";

const Producers: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [producers, setProducers] = useState<Producer[]>([]);
  const [filteredProducers, setFilteredProducers] = useState<Producer[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadProducers = useCallback(() => {
    setIsFetching(true);
    api
      .get("/producers")
      .then((res) => {
        setProducers(res.data);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar produtores",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updatedProducer = await api.patch(
          `/producers/${id}/toggle-active`
        );

        setProducers((prev) =>
          prev.map((producer) =>
            producer.id === id ? updatedProducer.data : producer
          )
        );

        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status do produtor alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status do produtor",
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    loadProducers();
  }, [loadProducers]);

  useEffect(() => {
    let filtered = producers;

    // // Filtro por texto
    // if (searchText) {
    //   filtered = filtered.filter(
    //     (producer) =>
    //       producer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    //       (producer.description &&
    //         producer.description
    //           .toLowerCase()
    //           .includes(searchText.toLowerCase())) ||
    //       (producer.specialties &&
    //         producer.specialties
    //           .toLowerCase()
    //           .includes(searchText.toLowerCase())) ||
    //       (producer.products &&
    //         producer.products
    //           .toLowerCase()
    //           .includes(searchText.toLowerCase())) ||
    //       producer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    //       producer.phone.toLowerCase().includes(searchText.toLowerCase()) ||
    //       (producer.address &&
    //         producer.address
    //           .toLowerCase()
    //           .includes(searchText.toLowerCase())) ||
    //       (producer.city &&
    //         producer.city.toLowerCase().includes(searchText.toLowerCase()))
    //   );
    // }

    setFilteredProducers(filtered);
  }, [producers, searchText]);

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Produtores</h1>
            <hr />
          </div>
          <Link to="/produtores/novo">
            <Button type="button">Adicionar Produtor</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição, especialidades, produtos, email, telefone ou endereço..."
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
              {filteredProducers.map((producer) => (
                <ProducerCard
                  key={producer.id}
                  producer={producer}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </CardsGrid>

            {!isFetching && filteredProducers.length === 0 && (
              <NoResults>
                {searchText
                  ? "Nenhum produtor encontrado com os filtros aplicados"
                  : "Nenhum produtor cadastrado"}
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Producers;
