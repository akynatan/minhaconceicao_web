import React, { useEffect, useState } from "react";

import { Container, Content } from "./styles";
import api from "../../services/api";
import { useToast } from "../../hooks/toast";
import CONTRACTS_STATUS from "../../contants/contracsStatus";
import { Contract } from "../../types/Contract";
import InputSample from "../../components/InputSample";

const Contracts: React.FC = () => {
  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      if (search.length < 3 && search !== "") {
        setContracts([]);
        return;
      }

      setIsFetching(true);
      api.get(`/contracts?search=${search}`).then((res) => {
        setIsFetching(false);
        const contractsResponse: Contract[] = res.data || [];

        setContracts(contractsResponse);
      });

      addToast({
        type: "success",
        title: "Sucesso",
        description: "Contratos buscados com sucesso",
      });
    } catch (err) {
      console.log(err);
      addToast({
        type: "error",
        title: "Erro",
        description: "Erro ao buscar contratos",
      });
    } finally {
      setIsFetching(false);
    }
  }, [search]);

  function formatDateToBrazilian(dateString: Date): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <Container>
      <Content>
        <div
          style={{
            marginBottom: 24,
            width: "100%",
          }}
        >
          <InputSample
            placeholder="Buscar contrato pelo nome do cliente ou número do contrato"
            name="search"
            onBlurFunction={(value) => {
              setSearch(value);
            }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>Número do Contrato</th>
              <th>Data de criação</th>
              <th>Cliente</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.numberContractHubsoft}</td>
                <td>{formatDateToBrazilian(contract.createdAt)}</td>
                <td>{contract.client?.name}</td>
                <td>{CONTRACTS_STATUS[contract.status] || contract.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isFetching && <p className="fetching">Carregando...</p>}
      </Content>
    </Container>
  );
};

export default Contracts;
