import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 16px 0;
  }
`;

export const ContentPage = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Content = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    color: #333333;
    font-size: 24px;
    font-weight: 600;
    margin: 16px 0 24px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;
