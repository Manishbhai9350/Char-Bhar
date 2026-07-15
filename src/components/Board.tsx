import { LinesData } from "../context/game/game";
import BoardLine from "./Line";
import Pieces from "./Pieces/Pieces";
import { useGame } from "../context/game/game.hook";
import Corners from "./corners/Corners";

const Board = () => {
  const { turn, corners } = useGame();

  return (
    <div className="board">
      <p>Turn For Player {turn}</p>
      <Pieces />
      <Corners />
      <BoardLine corners={corners} lines={LinesData} />
    </div>
  );
};

export default Board;
