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
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  width: 280px;
  padding: 24px 16px;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    padding: 16px 24px;
  }
`;

export const LogoContainer = styled.div`
  margin-bottom: 32px;

  img {
    height: 60px;
    width: auto;
    filter: brightness(0) invert(1);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 0;

    img {
      height: 40px;
    }
  }
`;

export const Menu = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: translateX(4px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    font-weight: 600;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #ffffff;
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover::before,
  &.active::before {
    transform: scaleY(1);
  }
`;

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.6);
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    flex-direction: row;
    padding: 0;
    border-top: none;
    gap: 12px;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  a {
    text-decoration: none;
    color: #ffffff;
    font-weight: 600;
    font-size: 14px;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    flex: 1;
    text-align: left;
  }
`;

export const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #ffffff;
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const MenuIcon = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;
