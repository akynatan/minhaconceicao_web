import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface ContainerProps {
  isFocused: boolean;
  isField: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #ffffff;
  border-radius: 8px;
  border: 2px solid #e1e5e9;
  padding: 14px 16px;
  width: 100%;
  display: flex;
  align-items: center;
  color: #64748b;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: #3b82f6;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    `}

  ${(props) =>
    props.isField &&
    css`
      color: #3b82f6;
    `}

  &:hover {
    border-color: #94a3b8;
  }

  input {
    background: transparent;
    flex: 1;
    border: 0;
    color: #1e293b;
    font-size: 14px;
    font-weight: 400;

    &::placeholder {
      color: rgb(65, 73, 85);
    }

    &:focus {
      outline: none;
    }
  }

  svg {
    margin-right: 12px;
    flex-shrink: 0;
  }

  .prefix {
    color: #64748b;
    font-size: 14px;
    font-weight: 400;
    margin-right: 8px;
    flex-shrink: 0;
  }

  & + div {
    margin-top: 12px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 12px;

  svg {
    margin: 0;
    color: #dc2626 !important;
  }

  span {
    background: #dc2626;
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    padding: 8px 12px;

    &::before {
      border-color: #dc2626 transparent;
    }
  }
`;
