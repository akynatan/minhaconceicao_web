import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

interface ContainerProps {
  isFocused: boolean;
  isField: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: transparent;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  color: #333333;
  width: 100%;
  position: relative;

  ${(props) =>
    props.isErrored &&
    css`
      .react-select__control {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25) !important;
      }
    `}

  ${(props) =>
    props.isFocused &&
    css`
      .react-select__control {
        border-color: #007bff !important;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) !important;
      }
    `}

  ${(props) =>
    props.isField &&
    css`
      .react-select__single-value {
        color: #333333 !important;
      }
    `}

  svg {
    margin-right: 16px;
    color: #666666;
    flex-shrink: 0;
  }

  & + div {
    margin-top: 8px;
  }

  .react-select__control {
    border: 1px solid #ddd;
    border-radius: 8px;
    min-height: 48px;
    box-shadow: none;
    transition: all 0.2s ease;

    &:hover {
      border-color: #999999;
    }
  }

  .react-select__control--is-focused {
    border-color: #007bff !important;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) !important;
  }

  .react-select__value-container {
    padding: 8px 12px;
  }

  .react-select__input-container {
    color: #333333;
  }

  .react-select__placeholder {
    color: #999999;
  }

  .react-select__single-value {
    color: #333333;
  }

  .react-select__indicator-separator {
    display: none;
  }

  .react-select__dropdown-indicator {
    color: #666666;
    padding: 8px;

    &:hover {
      color: #007bff;
    }
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-right: 16px;
  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
