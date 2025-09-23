import styled, { css } from "styled-components";

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: relative;
  width: 100%;

  ${(props) =>
    props.isErrored &&
    css`
      .select-button {
        border-color: #c53030;
      }
    `}
`;

export const SelectButton = styled.button`
  width: 100%;
  height: 56px;
  padding: 0 16px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #333333;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  span {
    flex: 1;
    text-align: left;
    color: ${(props) => (props.disabled ? "#999" : "#333")};
  }

  svg {
    color: #666;
    transition: transform 0.2s ease;

    &.open {
      transform: rotate(180deg);
    }
  }
`;

export const SelectedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;

  button {
    background: none;
    border: none;
    color: #1976d2;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(25, 118, 210, 0.1);
    }
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 16px;
  color: #333333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const LoadingMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #666666;
  font-style: italic;
`;

export const ErrorMessage = styled.span`
  color: #c53030;
  font-size: 14px;
  margin-top: 8px;
  display: block;
`;
