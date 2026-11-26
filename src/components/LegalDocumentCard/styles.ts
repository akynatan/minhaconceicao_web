import { Link } from "react-router";
import styled from "styled-components";

import { LegalDocumentStatus } from "../../types/LegalDocument";

const STATUS_COLOR: Record<LegalDocumentStatus, { background: string; color: string }> =
  {
    draft: { background: "#f5f5f5", color: "#666666" },
    published: { background: "#e3f2fd", color: "#1565c0" },
    current: { background: "#e8f5e8", color: "#2e7d32" },
  };

export const StatusBadge = styled.span<{ $status: LegalDocumentStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => STATUS_COLOR[props.$status].background};
  color: ${(props) => STATUS_COLOR[props.$status].color};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  justify-content: flex-end;
`;

export const PublishButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2e7d32;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #1b5e20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: #2e7d32;
  border: 1px solid #2e7d32;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #e8f5e8;
    color: #1b5e20;
  }
`;
