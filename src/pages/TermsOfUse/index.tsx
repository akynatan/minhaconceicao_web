import React from "react";

import LegalDocument from "../LegalDocument";

const TermsOfUse: React.FC = () => {
  return (
    <LegalDocument title="Termos de Uso">
      <p className="updated">Última atualização: julho de 2026.</p>

      <h2>1. Aceitação</h2>
      <p>
        Ao utilizar o aplicativo Minha Conceição, você concorda com estes Termos
        de Uso. Se não concordar, não utilize o serviço.
      </p>

      <h2>2. Cadastro e conta</h2>
      <p>
        Você é responsável por manter a confidencialidade de suas credenciais e
        por todas as atividades realizadas em sua conta.
      </p>

      <h2>3. Uso adequado</h2>
      <p>
        É proibido utilizar o aplicativo para fins ilícitos, ofensivos ou que
        prejudiquem outros usuários, a comunidade ou a operação do serviço.
      </p>

      <h2>4. Conteúdo do usuário</h2>
      <p>
        Ao publicar textos, fotos ou outros conteúdos, você declara ter direitos
        sobre eles e autoriza sua exibição no aplicativo conforme as
        funcionalidades disponíveis.
      </p>

      <h2>5. Gamificação e passaporte</h2>
      <p>
        Pontos, carimbos e desafios são benefícios promocionais do aplicativo e
        podem ser alterados ou descontinuados a qualquer momento.
      </p>

      <h2>6. Alterações</h2>
      <p>
        Podemos atualizar estes termos periodicamente. O uso continuado após
        alterações implica aceite da nova versão.
      </p>

      <h2>7. Contato</h2>
      <p>
        Em caso de dúvidas, utilize o canal “Fale conosco” disponível no
        aplicativo.
      </p>

      <p>
        Este texto é um placeholder e será substituído pela versão jurídica
        definitiva.
      </p>
    </LegalDocument>
  );
};

export default TermsOfUse;
