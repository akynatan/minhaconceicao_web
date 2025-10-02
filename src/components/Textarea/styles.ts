import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }

  .textarea-container {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 100%;

    .icon-container {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 1;
    }
  }
`;

export const TextareaElement = styled.textarea<{ hasIcon: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  padding-left: ${(props) => (props.hasIcon ? "40px" : "12px")};
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  color: #333;
  background: #fff;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const Error = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;
