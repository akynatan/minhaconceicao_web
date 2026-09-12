import React from "react";

import LegalDocument from "../LegalDocument";

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalDocument title="Política de Privacidade">
      <p className="updated">Última atualização: julho de 2026.</p>

      <h2>1. Dados coletados</h2>
      <p>
        Coletamos dados fornecidos no cadastro (como nome, e-mail e telefone),
        dados de uso do aplicativo e conteúdos que você publicar (por exemplo,
        fotos de check-in e posts).
      </p>

      <h2>2. Finalidade</h2>
      <p>
        Utilizamos seus dados para autenticar o acesso, operar funcionalidades
        (comunidade, desafios, passaporte), melhorar o serviço e cumprir
        obrigações legais.
      </p>

      <h2>3. Compartilhamento</h2>
      <p>
        Não vendemos seus dados. Podemos compartilhar informações com
        prestadores de infraestrutura necessários à operação do app, sempre sob
        obrigações de confidencialidade.
      </p>

      <h2>4. Armazenamento e segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais razoáveis para proteger seus
        dados. Nenhum sistema é totalmente isento de riscos.
      </p>

      <h2>5. Seus direitos</h2>
      <p>
        Você pode solicitar acesso, correção ou exclusão de dados pessoais,
        conforme a legislação aplicável (incluindo a LGPD), pelos canais de
        contato do aplicativo.
      </p>

      <h2>6. Retenção</h2>
      <p>
        Mantemos os dados pelo tempo necessário às finalidades descritas ou
        conforme exigido por lei.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Esta política pode ser atualizada. A versão vigente estará sempre
        disponível no aplicativo e neste site.
      </p>

      <p>
        Este texto é um placeholder e será substituído pela versão jurídica
        definitiva.
      </p>
    </LegalDocument>
  );
};

export default PrivacyPolicy;
