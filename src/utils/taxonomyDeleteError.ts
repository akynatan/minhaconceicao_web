import getApiErrorMessage from "./getApiErrorMessage";

export function taxonomyDeleteError(
  error: unknown,
  kind: "categoria" | "tag"
): { title: string; description: string } {
  const fallback =
    kind === "categoria"
      ? "Não é possível excluir uma categoria que está em uso"
      : "Não é possível excluir uma tag que está em uso";
  const message = getApiErrorMessage(
    error,
    kind === "categoria"
      ? "Erro ao excluir a categoria"
      : "Erro ao excluir a tag"
  );
  const inUse = /em uso/i.test(message);

  if (inUse) {
    return {
      title: kind === "categoria" ? "Categoria em uso" : "Tag em uso",
      description: message || fallback,
    };
  }

  return {
    title: "Erro ao excluir",
    description: message,
  };
}
