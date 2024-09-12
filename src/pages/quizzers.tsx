import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Moon,
  Sun,
  Globe,
  ArrowLeft,
  Trophy,
  Frown,
  Medal,
  BrainCircuit,
} from "lucide-react";
import { useTheme } from "@/context/themeContext";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { constants } from "@/services/api.service";

interface Country {
  name: string;
  capital: string;
  continent: string;
  flag: string;
}

interface Score {
  correct: number;
  incorrect: number;
}

const fetchCountry = async (
  continent: string = ""
): Promise<Country | null> => {
  try {
    const response = await axios.get<Country[]>(
      `${constants.API_URL}/api/quiz/countries`,
      { params: { continent: continent === "todos" ? "" : continent } }
    );
    console.log("API_URL", constants.API_URL);
    const countries = response.data;
    return countries[Math.floor(Math.random() * countries.length)] || null;
  } catch (error) {
    console.error("Erro ao buscar país:", error);
    return null;
  }
};

export default function CountryCapitalQuiz() {
  const [country, setCountry] = useState<Country | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState<Score>({ correct: 0, incorrect: 0 });
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "results">(
    "menu"
  );
  const [selectedContinent, setSelectedContinent] = useState<string>("todos");
  const [showAnswer, setShowAnswer] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (gameState === "playing") {
      loadNextCountry();
    }
  }, [gameState, currentQuestion]);

  const startNewGame = () => {
    setScore({ correct: 0, incorrect: 0 });
    setCurrentQuestion(0);
    setGameState("playing");
    setShowAnswer(false);
  };

  const loadNextCountry = async () => {
    const newCountry = await fetchCountry(selectedContinent);
    setCountry(newCountry);
    setUserAnswer("");
    setShowAnswer(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (country && userAnswer.toLowerCase() === country.capital.toLowerCase()) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      handleNextQuestion();
    } else {
      setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setShowAnswer(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 >= questionCount) {
      setGameState("results");
      if (score.correct / questionCount >= 0.8) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      setCurrentQuestion((prev) => prev + 1);
      loadNextCountry();
    }
  };

  const getPerformanceMessage = (correct: number, total: number) => {
    const percentage = (correct / total) * 100;
    if (percentage >= 80) {
      return {
        icon: <Trophy className="mx-auto h-16 w-16 text-primary" />,
        title: "Excelente!",
        message: "PQP, você tem um conhecimento impressionante de capitais!",
      };
    } else if (percentage >= 60) {
      return {
        icon: <Medal className="mx-auto h-16 w-16 text-primary" />,
        title: "Muito bom!",
        message: "Você tem um bom conhecimento de capitais!",
      };
    } else if (percentage >= 40) {
      return {
        icon: <Medal className="mx-auto h-16 w-16 text-primary" />,
        title: "Bom trabalho!",
        message: "Você está no caminho certo. Continue praticando!",
      };
    } else {
      return {
        icon: <Frown className="mx-auto h-16 w-16 text-primary" />,
        title: "Hmm, precisamos melhorar!",
        message: "Tu sabe pelo menos a capital do país que você mora?",
      };
    }
  };

  const renderGameState = () => {
    switch (gameState) {
      case "menu":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Quiz de Capitais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Número de perguntas
                  </label>
                  <Input
                    type="number"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Continente
                  </label>
                  <Select
                    onValueChange={(value) => setSelectedContinent(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um continente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="América do Sul">
                        América do Sul
                      </SelectItem>
                      <SelectItem value="Europa">Europa</SelectItem>
                      <SelectItem value="Ásia">Ásia</SelectItem>
                      <SelectItem value="África">África</SelectItem>
                      <SelectItem value="América do Norte">
                        América do Norte
                      </SelectItem>
                      <SelectItem value="Oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startNewGame} className="w-full">
                Iniciar Novo Jogo
              </Button>
            </CardFooter>
          </Card>
        );
      case "playing":
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{country?.name || "Carregando..."}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGameState("menu")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {country ? (
                  <>
                    <img
                      src={
                        country.flag || `/placeholder.svg?height=200&width=300`
                      }
                      alt={`Bandeira de ${country.name}`}
                      className="w-full h-[200px] object-cover rounded-md"
                    />
                    <form onSubmit={handleSubmit} className="space-y-2">
                      <Input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Digite a capital"
                        required
                        disabled={showAnswer}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={showAnswer}
                      >
                        Enviar
                      </Button>
                    </form>
                    {showAnswer && (
                      <div className="mt-4 p-4 bg-secondary rounded-md">
                        <p className="text-sm font-medium">
                          Resposta correta: {country.capital}
                        </p>
                        <p className="text-sm">Sua resposta: {userAnswer}</p>
                        <Button
                          onClick={handleNextQuestion}
                          className="mt-2 w-full"
                        >
                          Próxima pergunta
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div>Corretas: {score.correct}</div>
              <div>Incorretas: {score.incorrect}</div>
              <div>
                {currentQuestion + 1}/{questionCount}
              </div>
            </CardFooter>
          </Card>
        );
      case "results":
        const { icon, title, message } = getPerformanceMessage(
          score.correct,
          questionCount
        );
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Resultado Final</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {icon}
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-xl">
                  Você acertou {score.correct} de {questionCount}
                </p>
                <p className="text-lg">{message}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setGameState("menu")} className="w-full">
                Jogar Novamente
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground w-full">
      <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div className="flex items-end space-x-2">
          <BrainCircuit className="h-6 w-6" />
          <span className="text-3xl font-bold">quizzer</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </nav>

      <main className="container mx-auto mt-8 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderGameState()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
