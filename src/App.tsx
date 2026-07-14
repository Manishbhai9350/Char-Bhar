import "./App.css";
import Board from "./components/Board";
import { GameProvider } from "./context/game/game.provider";

const App = () => {
  return (
    <GameProvider>
      <div className="char-bhar">
        <Board />
      </div>
    </GameProvider>
  );
};

export default App;
