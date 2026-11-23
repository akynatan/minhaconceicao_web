import { Link } from "react-router";
import styled from "styled-components";

export const Container = styled.div`
  background: #ffffff;
  min-height: 100vh;
`;

export const Content = styled.main`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);

  .fetching {
    text-align: center;
    color: #007bff;
    font-size: 18px;
    margin: 40px 0;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 0 16px;
  }
`;

export const HeaderPage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  div {
    width: 100%;

    hr {
      width: 100%;
      color: white;
      height: 2px;
    }

    h1 {
      color: #333333;
    }
  }

  button {
    width: 260px;
  }

  svg {
    display: none;
    width: 40px;
    height: 40px;
    font-weight: bold;
    color: #ff9000;
  }

  @media screen and (max-width: 992px) {
    button {
      display: none;
    }

    svg {
      display: flex;
    }
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #666666;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;

  svg {
    display: block;
    width: 16px;
    height: 16px;
    color: #666666;
  }

  &:hover {
    color: #007bff;

    svg {
      color: #007bff;
    }
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
`;

export const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 16px;
    color: #666666;
    z-index: 1;
    display: block;
    width: 20px;
    height: 20px;
  }

  input {
    width: 100%;
    padding: 12px 16px 12px 48px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    background: #ffffff;

    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
  }
`;

export const StatusFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

interface StatusButtonProps {
  isActive: boolean;
}

export const StatusButton = styled.button<StatusButtonProps>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.isActive ? "#007bff" : "#ddd")};
  border-radius: 20px;
  background: ${(props) => (props.isActive ? "#007bff" : "#ffffff")};
  color: ${(props) => (props.isActive ? "#ffffff" : "#333333")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.isActive ? "#0056b3" : "#f8f9fa")};
    border-color: #007bff;
  }
`;

export const CardsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 40px;

  > * {
    flex: 1 1 350px;
    min-width: 350px;
    max-width: 450px;
  }

  @media (max-width: 768px) {
    gap: 16px;

    > * {
      flex: 1 1 100%;
      min-width: 100%;
      max-width: 100%;
    }
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666666;
  font-size: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;

  h3 {
    margin: 0 0 8px 0;
    color: #333333;
  }

  p {
    margin: 0;
  }
`;
