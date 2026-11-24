import styled from "styled-components";

export const RulesContainer = styled.div`
  width: 100%;
`;

export const Hint = styled.p`
  color: #666666;
  font-size: 14px;
  margin: 0 0 16px 0;
`;

export const RuleItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const RuleTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #007bff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RemoveRule = styled.button`
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

export const RuleFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RuleInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const RuleSelect = styled.select`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  color: #333333;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const AddRule = styled.button`
  background: #007bff;
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
    background: #0056b3;
  }
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 8px;
  color: #c53030;
  font-size: 14px;
`;
