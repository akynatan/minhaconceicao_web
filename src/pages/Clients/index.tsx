import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";

import {
  FiCheckCircle,
  FiXCircle,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import {
  Container,
  Content,
  HeaderPage,
  ClientInfo,
  ContentPage,
  ContractsContainer,
  ContractContent,
} from "./styles";
import api from "../../services/api";
import InputSample from "../../components/InputSample";
import { useToast } from "../../hooks/toast";
import { Client } from "../../types/Client";
import CONTRACTS_STATUS from "../../contants/contracsStatus";
import { ContractsStatus } from "../../enums/contractsStatus";

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  useEffect(() => {
    if (params.get("document")) {
      setDocumentFilter(params.get("document") || "");
    }
  }, [params]);

  const { addToast } = useToast();
  const [isFetching, setIsFetching] = useState(false);
  const [documentFilter, setDocumentFilter] = useState("");
  const [client, setClient] = useState<Client | null>(null);

  const reload = useCallback(() => {
    if (documentFilter === "") {
      return;
    }

    if (documentFilter.length === 11 || documentFilter.length === 14) {
      setClient(null);
      setIsFetching(true);
      api
        .get(`/clients/${documentFilter}`)
        .then((res) => {
          setClient(res.data);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setClient(null);
    }
  }, [documentFilter]);

  useEffect(() => {
    reload();
  }, [reload]);

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

  function capitalizeWords(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const servicesWithContracts = useMemo(() => {
    return client?.clientHubSoft.servicos.filter((servico) => {
      return servico.contratos.length > 0;
    });
  }, [client]);

  async function createContract(numberContract: string) {
    if (!client) {
      addToast({
        type: "error",
        title: "Erro",
        description: "Cliente não encontrado",
      });
      return;
    }

    try {
      await api.post("/contracts", {
        clientId: client.id,
        numberContractHubsoft: numberContract,
      });

      addToast({
        type: "success",
        title: "Sucesso",
        description: "Contrato enviado com sucesso",
      });
    } catch (error) {
      console.log(error);
      addToast({
        type: "error",
        title: "Erro",
        description: "Erro ao enviar contrato",
      });
    } finally {
      reload();
    }
  }

  async function resendNotificationContractToSignature(contractId: string) {
    if (!contractId) {
      addToast({
        type: "error",
        title: "Erro",
        description: "Contrato não encontrado",
      });
      return;
    }

    try {
      await api.post(`/contracts/${contractId}/resend-notification`);

      addToast({
        type: "success",
        title: "Sucesso",
        description: "Notificação reenviada com sucesso",
      });

      setTimeout(() => {
        reload();
      }, 5000);
    } catch (error) {
      console.log(error);
      addToast({
        type: "error",
        title: "Erro",
        description: "Erro ao reenviar notificação",
      });
    }
  }

  return (
    <Container>
      {" "}
      <Content>
        <ContentPage>
          <div
            style={{
              display: "flex",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                CPF/CNPJ:
              </span>
              <InputSample
                name="lead_name"
                containerStyle={{ width: 300, height: 20 }}
                onChange={(e) => {
                  navigate(window.location.pathname, {
                    replace: true,
                  });
                  setDocumentFilter(e.target.value);
                }}
                value={documentFilter}
              />
            </div>
          </div>

          {client && (
            <>
              <ClientInfo>
                <h3
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignSelf: "flex-start",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  Nome: {client.name}
                </h3>
                <h3>Documento: {client.document}</h3>
                <p>Email primario: {client.clientHubSoft?.email_principal}</p>
                <p>
                  Telefone primario: {client.clientHubSoft?.telefone_primario}
                </p>
                <p>
                  Telefone secundario:{" "}
                  {client.clientHubSoft?.telefone_secundario}
                </p>
                {client.clientHubSoft?.servicos.map((servico: any) => (
                  <p>
                    {servico.nome} - {servico.status}
                  </p>
                ))}
              </ClientInfo>

              <HeaderPage>
                <div>
                  <h1>Contratos Hubsoft</h1>
                  <hr />
                </div>
              </HeaderPage>

              <ContractsContainer>
                {servicesWithContracts?.map((servico) => (
                  <>
                    {servico.contratos.map((contrato) => {
                      const contract = client?.contracts.find(
                        (_contract) =>
                          Number(_contract.numberContractHubsoft) ===
                          Number(contrato.numero_contrato)
                      );

                      return (
                        <ContractContent>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 12,
                            }}
                          >
                            <h4
                              style={{
                                display: "flex",
                                gap: 12,
                                alignItems: "center",
                              }}
                            >
                              {contrato.aceito ? (
                                <FiCheckCircle color="#00ff00" />
                              ) : (
                                <FiXCircle color="#ff0000" />
                              )}
                              {contrato.contrato.descricao} -{" "}
                              {contrato.numero_contrato}
                            </h4>
                            <hr />
                            <p
                              style={{
                                display: "flex",
                                gap: 6,
                                alignItems: "center",
                              }}
                            >
                              Serviço: {capitalizeWords(servico.nome)} - Status:{" "}
                              {capitalizeWords(servico.status)}
                              {servico.status_prefixo ===
                              "servico_habilitado" ? (
                                <FiArrowUp color="#00ff00" />
                              ) : (
                                <FiArrowDown color="#ff0000" />
                              )}
                            </p>
                            <p>
                              Ativo no hubsoft:{" "}
                              {contrato.contrato.ativo ? "Sim" : "Não"}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 12,
                              }}
                            >
                              <p>Aceito: {contrato.aceito ? "Sim" : "Não"}</p>
                              {contrato.aceito && (
                                <>
                                  <p>
                                    Data de aceite:{" "}
                                    {formatDateToBrazilian(
                                      new Date(contrato.data_aceito)
                                    )}
                                  </p>
                                  <p>
                                    Link:{" "}
                                    <a
                                      style={{
                                        textDecoration: "underline",
                                        color: "#ff9000",
                                      }}
                                      href={`${
                                        import.meta.env.VITE_CLICK_SIGN
                                      }/guest/signers/${
                                        contract?.signerId
                                      }/documents/${contract?.documentId}`}
                                      target="_blank"
                                    >
                                      Ver arquivo
                                    </a>
                                  </p>
                                </>
                              )}
                            </div>

                            {contract ? (
                              <p>
                                Status:{" "}
                                {CONTRACTS_STATUS[contract.status] ||
                                  contract.status}
                                {contract.status ===
                                  ContractsStatus.PENDING_SIGNATURE && (
                                  <button
                                    style={{
                                      backgroundColor: "#ff9000",
                                      width: "200px",
                                      height: "30px",
                                      borderRadius: "5px",
                                      color: "#fff",
                                      fontWeight: "bold",
                                      cursor: "pointer",
                                      fontSize: "16px",
                                    }}
                                    onClick={() => {
                                      resendNotificationContractToSignature(
                                        contract.id
                                      );
                                    }}
                                  >
                                    Reenviar para assinatura
                                  </button>
                                )}
                              </p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 12,
                                }}
                              >
                                <p>
                                  Status: Contrato não foi enviado ao cliente
                                  para assinatura via clicksign
                                </p>
                                {contrato.contrato.ativo &&
                                  !contrato.aceito && (
                                    <button
                                      style={{
                                        backgroundColor: "#ff9000",
                                        width: "200px",
                                        height: "30px",
                                        borderRadius: "5px",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "16px",
                                      }}
                                      onClick={() => {
                                        createContract(
                                          contrato.numero_contrato
                                        );
                                      }}
                                    >
                                      Enviar pra assinatura
                                    </button>
                                  )}
                              </div>
                            )}
                          </div>
                        </ContractContent>
                      );
                    })}
                  </>
                ))}
              </ContractsContainer>
            </>
          )}

          {isFetching && <p className="fetching">Carregando...</p>}
        </ContentPage>
      </Content>
    </Container>
  );
};

export default Clients;
