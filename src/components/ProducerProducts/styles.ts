import styled from "styled-components";

export const ProductsContainer = styled.div`
  width: 100%;
`;

export const ProductItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
`;

export const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ProductTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RemoveProduct = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }
`;

export const AddProduct = styled.button`
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
  width: 100%;
  justify-content: center;

  &:hover {
    background: #1b5e20;
  }
`;

export const ProductFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductDescription = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 16px;
`;

export const ProductImage = styled.div`
  grid-column: 1 / -1;
`;
