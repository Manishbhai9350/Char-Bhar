import { useEffect } from "react";
import { useGame } from "../context/game/game.hook";
import BoardLine from "./Line";
import Pieces from "./Pieces/Pieces";
import Corners from "./corners/Corners";

const Board = () => {
  const { setAllPiecesPlaced, pieces } = useGame();

  useEffect(() => {
    let AllPlaced = true;

    pieces.forEach((p) => {
      if (p.corner !== 0 && !p.corner) {
        AllPlaced = false;
      }
    });
    setAllPiecesPlaced(AllPlaced);
  }, [pieces, setAllPiecesPlaced]);

  return (
    <div className="board">
      <Pieces />
      <Corners />
      <BoardLine />
    </div>
  );
};

export default Board;
