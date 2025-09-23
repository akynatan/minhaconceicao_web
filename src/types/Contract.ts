import { ContractsStatus } from "../enums/contractsStatus";
import { Client } from "./Client";

export interface Contract {
  active: boolean;
  clientId: string;
  createdAt: Date;
  documentId: string;
  documentSignedAt: Date;
  documentUrlSigned: string;
  envelopeId: string;
  id: string;
  idClientServiceContract: number;
  notificationId: string;
  requisitAuthenticationId: string;
  requisitId: string;
  signerId: string;
  status: ContractsStatus;
  numberContractHubsoft: string;
  updatedAt: Date;
  client?: Client;
}
