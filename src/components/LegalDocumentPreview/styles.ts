import styled from "styled-components";

export const Preview = styled.pre<{ $compact: boolean; $empty: boolean }>`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.7;
  color: ${(props) => (props.$empty ? "#999999" : "#333333")};
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  max-height: ${(props) => (props.$compact ? "320px" : "none")};
  overflow: auto;
`;
