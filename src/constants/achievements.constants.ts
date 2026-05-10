import type { AchievementDef } from "@/types/game.types";

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_game",
    name: "Primeiro Passo",
    description: "Complete seu primeiro jogo",
    icon: "🎯",
  },
  {
    id: "perfect_game",
    name: "Perfeição",
    description: "Acerte 100% em um jogo",
    icon: "💎",
  },
  {
    id: "streak_5",
    name: "Em Chamas!",
    description: "Alcance um streak de 5 acertos seguidos",
    icon: "🔥",
  },
  {
    id: "streak_10",
    name: "Imparável",
    description: "Alcance um streak de 10 acertos seguidos",
    icon: "⚡",
  },
  {
    id: "all_continents",
    name: "Cidadão Global",
    description: "Jogue em todos os continentes",
    icon: "🌍",
  },
  {
    id: "daily_7",
    name: "Dedicado",
    description: "Complete 7 desafios diários",
    icon: "📅",
  },
  {
    id: "no_hints_10",
    name: "Sem Ajuda",
    description: "Complete 10 jogos sem usar dicas",
    icon: "🧠",
  },
  {
    id: "score_1000",
    name: "Mil Pontos!",
    description: "Alcance 1000 pontos em um jogo",
    icon: "🏆",
  },
  {
    id: "correct_100",
    name: "Centenário",
    description: "Acerte 100 perguntas no total",
    icon: "💯",
  },
  {
    id: "correct_500",
    name: "Enciclopédia",
    description: "Acerte 500 perguntas no total",
    icon: "📚",
  },
];
