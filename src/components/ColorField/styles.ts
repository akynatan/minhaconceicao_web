import styled from "styled-components";

export const Field = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
`;

export const Row = styled.div<{ $errored: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.$errored ? "#dc2626" : "#e1e5e9")};
  background: #ffffff;

  input[type="color"] {
    width: 44px;
    height: 36px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  input[type="text"] {
    flex: 1;
    border: 0;
    background: transparent;
    color: #1e293b;
    font-size: 14px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;

    &:focus {
      outline: none;
    }
  }
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-size: 13px;
`;
