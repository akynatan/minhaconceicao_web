import styled, { css } from "styled-components";

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #ffffff;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  border: 1px solid #ddd;
  color: #333333;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  .ql-toolbar {
    border: none;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 8px 8px 0 0;
    background: #f8f9fa;

    .ql-picker-options {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
  }

  .ql-container {
    border: none;
    border-radius: 0 0 8px 8px;
    font-family: "Roboto Slab", serif;

    .ql-editor {
      min-height: 200px;
      padding: 16px;
      color: #333333;
      background: #ffffff;
      font-size: 16px;
      line-height: 1.6;

      &.ql-blank::before {
        color: #999999;
        font-style: normal;
      }
    }
  }

  .ql-snow .ql-tooltip {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .ql-snow .ql-tooltip::before {
    color: #333333;
  }
`;

export const ErrorMessage = styled.span`
  color: #c53030;
  font-size: 14px;
  margin-top: 8px;
  display: block;
`;
