import React from "react";
import { Link, useLocation } from "react-router";
import {
  FiPower,
  FiMapPin,
  FiCamera,
  FiUsers,
  FiUser,
  FiPackage,
  FiBriefcase,
  FiFileText,
} from "react-icons/fi";

import logoImg from "../../assets/logo.png";
import userImg from "../../assets/user.png";

import { useAuth } from "../../hooks/auth";

import {
  Header,
  HeaderContent,
  Profile,
  Menu,
  MenuItem,
  LogoContainer,
  UserInfo,
  LogoutButton,
} from "./styles";

const MenuHeader: React.FC = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const name = user?.name || "";

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Header>
      <HeaderContent>
        <LogoContainer>
          <Link to="/">
            <img src={logoImg} alt="Minha Conceição" />
          </Link>
        </LogoContainer>

        <Menu>
          <MenuItem
            to="/lugares-para-comer"
            className={isActiveRoute("/lugares-para-comer") ? "active" : ""}
          >
            <FiMapPin />
            <span>Lugares para Comer</span>
          </MenuItem>
          <MenuItem
            to="/lugares-para-dormir"
            className={isActiveRoute("/lugares-para-dormir") ? "active" : ""}
          >
            <FiMapPin />
            <span>Lugares para Dormir</span>
          </MenuItem>
          <MenuItem
            to="/atracoes"
            className={isActiveRoute("/atracoes") ? "active" : ""}
          >
            <FiCamera />
            <span>Atrações Turísticas</span>
          </MenuItem>
          <MenuItem
            to="/guias"
            className={isActiveRoute("/guias") ? "active" : ""}
          >
            <FiUsers />
            <span>Guias</span>
          </MenuItem>
          <MenuItem
            to="/produtores"
            className={isActiveRoute("/produtores") ? "active" : ""}
          >
            <FiPackage />
            <span>Produtores</span>
          </MenuItem>
          <MenuItem
            to="/empresas"
            className={isActiveRoute("/empresas") ? "active" : ""}
          >
            <FiBriefcase />
            <span>Empresas</span>
          </MenuItem>
          <MenuItem
            to="/vagas"
            className={isActiveRoute("/vagas") ? "active" : ""}
          >
            <FiFileText />
            <span>Vagas de Emprego</span>
          </MenuItem>
          {user?.role === "admin" && (
            <MenuItem
              to="/usuarios"
              className={isActiveRoute("/usuarios") ? "active" : ""}
            >
              <FiUser />
              <span>Usuários</span>
            </MenuItem>
          )}
        </Menu>

        <Profile>
          <img src={userImg} alt={name} />
          <UserInfo>
            <Link to="/profile">
              <strong>{name}</strong>
            </Link>
          </UserInfo>
          <LogoutButton type="button" onClick={signOut} title="Sair">
            <FiPower />
          </LogoutButton>
        </Profile>
      </HeaderContent>
    </Header>
  );
};

export default MenuHeader;
