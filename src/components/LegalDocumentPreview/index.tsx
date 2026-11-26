import React from "react";

import { Preview } from "./styles";

interface LegalDocumentPreviewProps {
  content: string;
  compact?: boolean;
}

const LegalDocumentPreview: React.FC<LegalDocumentPreviewProps> = ({
  content,
  compact = false,
}) => {
  const hasText = content.trim().length > 0;

  return (
    <Preview $compact={compact} $empty={!hasText}>
      {hasText ? content : "Nada para visualizar ainda."}
    </Preview>
  );
};

export default LegalDocumentPreview;
