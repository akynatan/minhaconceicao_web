import React from "react";
import { Link } from "react-router";
import { FiPower } from "react-icons/fi";

import logoImg from "../../assets/logo.png";
import userImg from "../../assets/user.png";

import { useAuth } from "../../hooks/auth";

import { Header, HeaderContent, Profile, Menu, MenuItem } from "./styles";

const MenuHeader: React.FC = () => {
  const { signOut, user } = useAuth();
  const name = user?.name || "";

  return (
    <Header>
      <HeaderContent>
        <Link to="/clientes">
          <img src={logoImg} alt="GlContractsWeb" />
        </Link>

        <Menu>
          <MenuItem to="/clientes">Clientes</MenuItem>
          <MenuItem to="/contratos">Contratos</MenuItem>
          <MenuItem to="/lugares-para-comer">Lugares para Comer</MenuItem>
          {user?.role === "admin" && (
            <MenuItem to="/usuarios">Usuários</MenuItem>
          )}
        </Menu>

        <div>
          <Profile>
            <img src={userImg} alt={name} />
            <div>
              <Link to="/profile">
                <strong>{name}</strong>
              </Link>
            </div>
            <button type="button" onClick={signOut}>
              <FiPower />
            </button>
          </Profile>
        </div>
      </HeaderContent>
    </Header>
  );
};

export default MenuHeader;
