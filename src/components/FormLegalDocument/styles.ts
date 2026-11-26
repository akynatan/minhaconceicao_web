import styled from "styled-components";

export const Notice = styled.p`
  margin: 0 0 24px;
  padding: 12px 16px;
  border-radius: 8px;
  background: #e8f5e8;
  color: #1b5e20;
  line-height: 1.5;
`;

export const ReadOnlyGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;

  div {
    flex: 1 1 160px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
  }

  span {
    display: block;
    color: #666666;
    font-size: 12px;
    margin-bottom: 4px;
  }

  strong {
    color: #333333;
    font-size: 16px;
    font-weight: 600;
  }
`;

export const FieldHint = styled.p`
  margin: 8px 0 0;
  color: #666666;
  font-size: 13px;
  line-height: 1.4;
`;

export const PreviewBlock = styled.div`
  margin-top: 16px;

  h4 {
    margin: 0 0 8px;
    color: #333333;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const PublishHint = styled.p`
  margin: 24px 0 0;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const PublishButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #2e7d32;
  padding: 12px 24px;
  border-radius: 8px;
  color: #2e7d32;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #e8f5e8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
