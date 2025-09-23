import { shade } from "polished";
import styled from "styled-components";

export const Container = styled.div`
  background: #ffffff;
  min-height: 100vh;
`;

export const Content = styled.main`
  width: 100%;
  padding: 0 20px;
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

  table {
    border-spacing: 1;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    position: relative;
  }
  table * {
    position: relative;
  }
  table td,
  table th {
    padding-left: 8px;
    text-align: center;
  }
  table thead tr {
    height: 60px;
    background: #f8f9fa;
    color: #333333;
  }

  table th {
    color: #333333;
    font-weight: 600;
  }
  table tbody tr {
    height: 50px;
  }
  table tbody tr:last-child {
    border: 0;
  }

  tbody tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  tbody tr:nth-child(odd) {
    background-color: white;
  }

  tbody tr {
    font-family: OpenSans-Regular;
    font-size: 15px;
    color: #333333;
    line-height: 1.2;
    font-weight: unset;
  }

  tbody tr:hover {
    color: #000000;
    background-color: #f0f0f0;
    cursor: pointer;
  }

  .column1 {
    width: 160px;
  }

  .column2 {
    width: 160px;
  }

  .column3 {
    width: 245px;
  }
  td.column3 {
    text-align: left;
  }

  .column4 {
    width: 110px;
  }

  .column5 {
    width: 170px;
  }

  .column6 {
    width: 222px;
  }

  .column6 {
    width: 222px;
  }

  table td svg {
    color: #ff9000;
    height: 40px;
    width: 20px;
  }

  table td svg + svg {
    margin-left: 10px;
  }

  @media screen and (max-width: 992px) {
    table {
      display: block;
    }
    table > *,
    table tr,
    table td,
    table th {
      display: block;
    }
    table thead {
      display: none;
    }
    table tbody tr {
      height: auto;
      padding: 37px 0;
    }
    table tbody tr td {
      padding-left: 40% !important;
      margin-bottom: 24px;
    }
    table tbody tr td:last-child {
      margin-bottom: 0;
    }
    table tbody tr td:before {
      font-family: OpenSans-Regular;
      font-size: 14px;
      color: #999999;
      line-height: 1.2;
      font-weight: unset;
      position: absolute;
      width: 40%;
      left: 30px;
      top: 0;
    }
    table tbody tr td:nth-child(1):before {
      content: "Nome";
    }
    table tbody tr td:nth-child(2):before {
      content: "Endereço";
    }
    table tbody tr td:nth-child(3):before {
      content: "Telefone";
    }
    table tbody tr td:nth-child(4):before {
      content: "Preço Médio";
    }
    table tbody tr td:nth-child(5):before {
      content: "Avaliação";
    }
    table tbody tr td:nth-child(6):before {
      content: "Status";
    }
    table tbody tr td:nth-child(7):before {
      content: "Ações";
    }

    table td,
    table th {
      text-align: left;
    }

    .column4,
    .column5,
    .column6,
    .column1,
    .column2,
    .column3 {
      width: 100%;
    }

    tbody tr {
      font-size: 14px;
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

export const CategoriesFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

interface CategoryButtonProps {
  isActive: boolean;
}

export const CategoryButton = styled.button<CategoryButtonProps>`
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

  /* Cada card terá largura mínima de 350px e crescerá para preencher o espaço */
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
`;

export const AvatarInput = styled.div`
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;

  label {
    width: 32px;
    height: 32px;
    border: 1px solid #ff9000;
    border-radius: 50%;
    bottom: 0;
    right: 0;
    cursor: pointer;
    transition: background-color 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    &:hover {
      background: ${shade(0.2, "#ff9000")};
    }

    input {
      display: none;
    }
  }
`;

export const HeaderPage = styled.main`
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
