import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: #f7f7f7;
  padding: 32px 16px 64px;
`;

export const Content = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;

  img {
    width: 96px;
    margin-bottom: 16px;
  }

  h1 {
    color: #0a3924;
    font-size: 28px;
  }
`;

export const Document = styled.article`
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  color: #333333;
  line-height: 1.7;

  h2 {
    margin: 24px 0 8px;
    color: #0a3924;
    font-size: 18px;
  }

  h3 {
    margin: 20px 0 8px;
    color: #0a3924;
    font-size: 16px;
  }

  p {
    margin-bottom: 12px;
  }

  ul {
    margin: 0 0 12px 20px;
    padding: 0;
  }

  li {
    margin-bottom: 4px;
  }

  a {
    color: #198653;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .updated {
    color: #6c7a75;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .copyright {
    margin-top: 32px;
    color: #6c7a75;
    font-size: 14px;
  }
`;
