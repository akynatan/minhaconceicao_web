import { Contract } from "./Contract";

interface ContractHubsoft {
  id_cliente_servico_contrato: number;
  aceito: boolean;
  data_aceito: string;
  link: string;
  link_assinatura: string;
  numero_contrato: string;
  contrato: {
    id_contrato: number;
    descricao: string;
    ativo: boolean;
  };
}

export interface Client {
  id: string;
  name: string;
  document: string;
  clientHubSoft: {
    email_principal: string;
    telefone_primario: string;
    telefone_secundario: string;
    servicos: {
      nome: string;
      status: string;
      status_prefixo: string;
      contratos: ContractHubsoft[];
      contratos_sem_assinatura: ContractHubsoft[];
      contratos_pendentes: number;
    }[];
  };
  contracts: Contract[];
  createdAt: Date;
  updatedAt: Date;
}
