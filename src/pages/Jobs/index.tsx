import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { FiPlusCircle, FiSearch } from "react-icons/fi";
import {
  Container,
  Content,
  HeaderPage,
  FiltersContainer,
  SearchInput,
  FilterSelect,
  CardsGrid,
  NoResults,
} from "./styles";
import api from "../../services/api";
import { Job } from "../../types/Job";
import Button from "../../components/Button";
import JobCard from "../../components/JobCard";
import { useToast } from "../../hooks/toast";

const Jobs: React.FC = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | null>(true);
  const { addToast } = useToast();

  const loadJobs = useCallback(
    (isActive?: boolean | null) => {
      setIsFetching(true);

      const params: any = {};
      if (isActive !== null) {
        params.isActive = isActive;
      }

      api
        .get("/jobs", { params })
        .then((res) => {
          const jobsData = Array.isArray(res.data)
            ? res.data
            : res.data.jobs || [];
          setJobs(jobsData);
        })
        .catch(() => {
          addToast({
            type: "error",
            title: "Erro ao carregar",
            description: "Erro ao carregar vagas",
          });
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [addToast]
  );

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        const updatedJob = await api.patch(`/jobs/${id}/toggle-active`);

        setJobs((prev) =>
          prev.map((job) => (job.id === id ? updatedJob.data : job))
        );

        addToast({
          type: "success",
          title: "Status alterado",
          description: "Status da vaga alterado com sucesso",
        });
      } catch {
        addToast({
          type: "error",
          title: "Erro ao alterar status",
          description: "Erro ao alterar status da vaga",
        });
      }
    },
    [addToast]
  );

  useEffect(() => {
    loadJobs(activeFilter);
  }, [loadJobs, activeFilter]);

  useEffect(() => {
    // Garantir que jobs seja sempre um array
    const jobsArray = Array.isArray(jobs) ? jobs : [];
    let filtered = jobsArray;

    // Filtro por texto
    if (searchText) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (job.description &&
            job.description.toLowerCase().includes(searchText.toLowerCase())) ||
          (job.area &&
            job.area.toLowerCase().includes(searchText.toLowerCase())) ||
          (job.location &&
            job.location.toLowerCase().includes(searchText.toLowerCase())) ||
          (job.company.name &&
            job.company.name.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Filtro por status já é aplicado no backend, não precisa filtrar aqui

    setFilteredJobs(filtered);
  }, [jobs, searchText, activeFilter]);

  const handleActiveFilterChange = useCallback((value: string) => {
    if (value === "active") {
      setActiveFilter(true);
    } else if (value === "inactive") {
      setActiveFilter(false);
    }
  }, []);

  return (
    <Container>
      <Content>
        <HeaderPage>
          <div>
            <h1>Vagas de Emprego</h1>
            <hr />
          </div>
          <Link to="/vagas/nova">
            <Button type="button">Adicionar Vaga</Button>
            <FiPlusCircle />
          </Link>
        </HeaderPage>

        <FiltersContainer>
          <SearchInput>
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Buscar por título, descrição, área, localização ou empresa..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </SearchInput>

          <FilterSelect>
            <select
              value={
                activeFilter === null
                  ? "all"
                  : activeFilter
                  ? "active"
                  : "inactive"
              }
              onChange={(e) => handleActiveFilterChange(e.target.value)}
            >
              <option value="active">Apenas ativas</option>
              <option value="inactive">Apenas inativas</option>
            </select>
          </FilterSelect>
        </FiltersContainer>

        {isFetching ? (
          <p className="fetching">Carregando...</p>
        ) : (
          <>
            <CardsGrid>
              {Array.isArray(filteredJobs) &&
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
            </CardsGrid>

            {!isFetching &&
              Array.isArray(filteredJobs) &&
              filteredJobs.length === 0 && (
                <NoResults>
                  {searchText || activeFilter !== null
                    ? "Nenhuma vaga encontrada com os filtros aplicados"
                    : "Nenhuma vaga cadastrada"}
                </NoResults>
              )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Jobs;
