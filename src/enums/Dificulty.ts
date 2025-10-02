export enum Dificulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export const DificultyText: Record<Dificulty, string> = {
  [Dificulty.EASY]: "Fácil",
  [Dificulty.MEDIUM]: "Médio",
  [Dificulty.HARD]: "Difícil",
};

export const DIFICULTY_OPTIONS = [
  { value: Dificulty.EASY, label: DificultyText[Dificulty.EASY] },
  { value: Dificulty.MEDIUM, label: DificultyText[Dificulty.MEDIUM] },
  { value: Dificulty.HARD, label: DificultyText[Dificulty.HARD] },
];
