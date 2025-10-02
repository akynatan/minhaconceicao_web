import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Content = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const HeaderPage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;

  h1 {
    color: #333333;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  hr {
    width: 60px;
    height: 3px;
    background: #2e7d32;
    border: none;
    margin: 8px 0 0 0;
  }

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    background: #2e7d32;
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
      background: #1b5e20;
    }

    svg {
      flex-shrink: 0;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;

    a {
      justify-content: center;
    }
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: #999999;
    z-index: 1;
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    background: #ffffff;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: #2e7d32;
      box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.25);
    }

    &::placeholder {
      color: #999999;
    }
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const NoResults = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666666;
  font-size: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ddd;
`;
