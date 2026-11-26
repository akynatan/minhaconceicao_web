import styled from "styled-components";

export const TypeFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TypeFilterButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${(props) => (props.$active ? "#2e7d32" : "#dddddd")};
  background: ${(props) => (props.$active ? "#2e7d32" : "#ffffff")};
  color: ${(props) => (props.$active ? "#ffffff" : "#333333")};
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: #2e7d32;
  }
`;

export const Group = styled.section`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    color: #333333;
    font-size: 18px;
    font-weight: 600;
  }

  span {
    color: #666666;
    font-size: 14px;
  }
`;
