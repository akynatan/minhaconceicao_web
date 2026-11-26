import styled from "styled-components";

export const Field = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

export const Label = styled.span`
  display: block;
  margin-bottom: 8px;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Preview = styled.div<{ $background: string; $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 8px 12px;
  border-radius: 8px;
  background: ${(props) => props.$background};
  color: ${(props) => props.$color};
  border: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
`;

export const PlaceholderIcon = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px dashed currentColor;
  opacity: 0.5;
`;

export const ChooseButton = styled.button`
  border: 1px solid #2e7d32;
  background: #ffffff;
  color: #2e7d32;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e8f5e9;
  }
`;

export const Hint = styled.p`
  margin: 8px 0 0;
  color: #666666;
  font-size: 13px;
`;

export const Warning = styled.p`
  margin: 8px 0 0;
  color: #b45309;
  font-size: 13px;
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 13px;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Dialog = styled.div`
  width: min(920px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
`;
