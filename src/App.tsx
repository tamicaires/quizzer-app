import { ThemeProvider } from "./context/themeContext";
import CountryCapitalQuiz from "./pages/quizzers";

function App() {
  return (
    <ThemeProvider>
      <CountryCapitalQuiz />
    </ThemeProvider>
  );
}

export default App;
