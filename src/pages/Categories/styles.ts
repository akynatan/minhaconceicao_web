import styled from "styled-components";
import { Link } from "react-router";

export const FilterRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: stretch;

  select {
    min-width: 220px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    background: #ffffff;
    color: #333333;
  }

  > :last-child {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    select {
      width: 100%;
    }
  }
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;

  th {
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #666666;
    padding: 12px 10px;
    border-bottom: 1px solid #e5e7eb;
  }

  td {
    padding: 12px 10px;
    border-bottom: 1px solid #f0f0f0;
    color: #333333;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #f8faf8;
  }
`;

export const IconBadge = styled.span<{ $background: string; $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.$background || "#f3f4f6"};
  color: ${(props) => props.$color || "#333333"};
  flex-shrink: 0;
`;

export const NameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    color: #333333;
    font-weight: 600;
  }

  span {
    color: #666666;
    font-size: 13px;
    max-width: 360px;
  }
`;

export const Swatches = styled.div`
  display: flex;
  gap: 6px;
`;

export const Swatch = styled.span<{ $color: string }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

export const KeyText = styled.code`
  font-size: 12px;
  color: #555555;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const EditLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: #c53030;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;
