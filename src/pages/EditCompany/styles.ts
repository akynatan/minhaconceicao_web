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
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const HeaderPage = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;

  h1 {
    color: #333333;
    font-size: 28px;
    font-weight: 600;
    margin: 16px 0 0 0;
  }

  hr {
    width: 80px;
    height: 3px;
    background: #1976d2;
    border: none;
    margin: 12px 0 0 0;
  }
`;
