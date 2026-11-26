import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    color: #333333;
    font-size: 20px;
    font-weight: 600;
  }

  p {
    margin: 4px 0 0;
    color: #666666;
    font-size: 14px;
  }
`;

export const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #666666;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;

  &:hover {
    background: #f3f4f6;
    color: #333333;
  }
`;

export const SearchBox = styled.div`
  position: relative;
  margin-bottom: 16px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #999999;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #2e7d32;
      box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.25);
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
  gap: 8px;
  max-height: min(52vh, 480px);
  overflow: auto;
  padding-right: 4px;
`;

export const IconButton = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 88px;
  padding: 10px 6px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$selected ? "#2e7d32" : "#e5e7eb")};
  background: ${(props) => (props.$selected ? "#e8f5e9" : "#ffffff")};
  color: #333333;
  cursor: pointer;

  span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    line-height: 1.2;
  }

  &:hover {
    border-color: #2e7d32;
    background: #f4faf4;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  color: #666666;
  font-size: 13px;

  button {
    border: 1px solid #2e7d32;
    background: #ffffff;
    color: #2e7d32;
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      background: #e8f5e9;
    }
  }
`;

export const Empty = styled.p`
  margin: 24px 0;
  text-align: center;
  color: #666666;
`;
