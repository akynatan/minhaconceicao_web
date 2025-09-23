import styled from "styled-components";
import { Link } from "react-router";

export const Container = styled.div``;

export const Header = styled.header`
  position: relative;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #f8f9fa;
  width: 150px;
  padding: 32px 20px;
  border-right: 1px solid #e0e0e0;

  img {
    height: 80px;
  }
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  span {
    color: #f4ede8;
  }

  a {
    text-decoration: none;
    color: #333333;

    &:hover {
      opacity: 0.8;
    }
  }

  button {
    background: transparent;
    border: 0;

    svg {
      color: #666666;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Menu = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const MenuItem = styled(Link)`
  color: #333333;
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  
  &:hover {
    color: #007bff;
    opacity: 0.8;
  }
`;
