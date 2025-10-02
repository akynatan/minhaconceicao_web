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
import { Company } from "../../types/Company";
import Button from "../../components/Button";
import CompanyCard from "../../components/CompanyCard";
import { useToast } from "../../hooks/toast";

const Companies: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchText, setSearchText] = useState("");
  const { addToast } = useToast();

  const loadCompanies = useCallback(() => {
    setIsFetching(true);
    api
      .get("/companies")
      .then((res) => {
        const companiesData = Array.isArray(res.data)
          ? res.data
          : res.data.companies || [];
        setCompanies(companiesData);
      })
      .catch(() => {
        addToast({
          type: "error",
          title: "Erro ao carregar",
          description: "Erro ao carregar empresas",
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [addToast]);

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updatedCompany = await api.patch(
          `/companies/${id}/toggle-active`
        );

        setCompanies((prev) =>
          prev.map((company) =>
            company.id === id ? updatedCompany.data : company
          )
        );

        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status da empresa alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status da empresa",
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    // Garantir que companies seja sempre um array
    const companiesArray = Array.isArray(companies) ? companies : [];
    let filtered = companiesArray;

    // Filtro por texto
    if (searchText) {
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (company.description &&
            company.description
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
          (company.email &&
            company.email.toLowerCase().includes(searchText.toLowerCase())) ||
          (company.phone &&
            company.phone.toLowerCase().includes(searchText.toLowerCase())) ||
          (company.address &&
            company.address.toLowerCase().includes(searchText.toLowerCase())) ||
          (company.city &&
            company.city.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, searchText]);

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Empresas</h1>
            <hr />
          </div>
          <Link to="/empresas/nova">
            <Button type="button">Adicionar Empresa</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, descrição, email, telefone ou endereço..."
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
              {Array.isArray(filteredCompanies) &&
                filteredCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
            </CardsGrid>

            {!isFetching &&
              Array.isArray(filteredCompanies) &&
              filteredCompanies.length === 0 && (
                <NoResults>
                  {searchText
                    ? "Nenhuma empresa encontrada com os filtros aplicados"
                    : "Nenhuma empresa cadastrada"}
                </NoResults>
              )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Companies;
