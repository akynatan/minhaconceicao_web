import React from "react";
import { useNavigate } from "react-router";
import { FiArrowLeft } from "react-icons/fi";

import { Container } from "./styles";

const GoBack: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container type="button" onClick={() => navigate(-1)}>
      <FiArrowLeft size={30} />
    </Container>
  );
};

export default GoBack;
