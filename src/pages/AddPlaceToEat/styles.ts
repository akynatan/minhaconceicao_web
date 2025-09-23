import styled from "styled-components";

export const Container = styled.div`
  background: #ffffff;
  min-height: 100vh;

  .css-reyg8m-control:hover,
  .css-e7sjo6-control:hover {
    border-color: #232129 !important;
  }

  .css-111ybla-control:hover,
  .css-1j1j20l-control:hover {
    border-color: transparent !important;
  }
`;

export const ContentPage = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  margin: 80px 0;
  text-align: center;

  h1 {
    margin-bottom: 24px;
    font-size: 36px;
    text-align: center;
    color: #333333;
  }
`;
