import "./App.css";
// import Board from "./components/boards/Board";
import Home from "./components/home/home";
import { GameProvider } from "./context/game/game.provider";

const App = () => {
  return (
    <GameProvider>
      <div className="char-bhar">
        <Home />
        {/* <Board /> */}
      </div>
    </GameProvider>
  );
};

export default App;
