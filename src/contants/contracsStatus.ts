import { ContractsStatus } from "../enums/contractsStatus";

const CONTRACTS_STATUS = {
  [ContractsStatus.PENDING_SIGNATURE]: "Aguardando assinatura",
  [ContractsStatus.SIGNED]: "Assinado",
  [ContractsStatus.CANCELED]: "Cancelado",
};

export default CONTRACTS_STATUS;
