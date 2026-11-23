import { Link } from "react-router";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const RoomsBar = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 20px 0;
  background: #ffffff;
`;

export const ManageRooms = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
