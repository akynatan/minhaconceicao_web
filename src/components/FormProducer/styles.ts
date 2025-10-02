import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const FormStep = styled.div`
  display: flex;
  margin-bottom: 24px;
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  background: #2e7d32;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  margin-right: 20px;
`;

export const StepTitle = styled.h3`
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.2;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const StepContent = styled.div`
  flex: 1;

  > div:first-child {
    margin-top: 0;
  }

  /* Estilos para inputs dentro do step */
  input,
  select {
    width: 100%;
  }

  /* Flex responsivo para campos em múltiplas colunas */
  .form-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    > * {
      flex: 1 1 250px;
      min-width: 250px;
    }

    @media (max-width: 768px) {
      > * {
        flex: 1 1 100%;
        min-width: 100%;
      }
    }
  }

  /* Flex para campos lado a lado */
  .form-flex {
    display: flex;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0;
    }
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  margin-top: 32px;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #ddd;
  padding: 12px 24px;
  border-radius: 8px;
  color: #666666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #2e7d32;
    color: #2e7d32;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2e7d32;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #1b5e20;
  }

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;
