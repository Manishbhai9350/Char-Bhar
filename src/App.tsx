import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home/home";
import Local from "./pages/local/local";
import SinglePlayer from "./pages/singlePlayer/singlePlayer";
import PlayerCard from "./components/player/playerCard/playerCard";
import Board from "./components/boards/Board";

const App = () => {
  return (
    <div className="char-bhar">
      <PlayerCard name="Manish" player="1" avatarUrl="/images/avatars/a1.png" />
      <PlayerCard
        side="right"
        name="Bot"
        player="2"
        avatarUrl="/images/avatars/a1.png"
      />
      <Board />
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/single" element={<SinglePlayer />} />
          <Route path="/local" element={<Local />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
};

export default App;
