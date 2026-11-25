import styled from "styled-components";

export const ItemsContainer = styled.div`
  width: 100%;
`;

export const Hint = styled.p`
  color: #666666;
  font-size: 14px;
  margin: 0 0 16px 0;
`;

export const AddRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const AddButton = styled.button`
  background: #ffffff;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #e7f1ff;
  }
`;

export const ItemCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #007bff;
`;

export const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #ffffff;
  color: #007bff;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: #007bff;
  }
`;

export const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #c82333;
  }
`;

export const Field = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
  background: #ffffff;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const Area = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
  background: #ffffff;
  margin-bottom: 12px;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
  background: #ffffff;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const ResultList = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #ffffff;
  max-height: 220px;
  overflow: auto;
  margin-bottom: 12px;
`;

export const ResultButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border: 0;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  cursor: pointer;
  color: #333333;

  &:hover {
    background: #f8f9fa;
  }
`;

export const SelectedPlace = styled.p`
  margin: 0 0 12px;
  color: #333333;
  font-size: 14px;
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 8px;
  color: #c53030;
  font-size: 14px;
`;
