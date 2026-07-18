import { useEffect } from "react";
import { useGame } from "../../context/game/game.hook";
import BoardLine from "../lines/Line";
import Pieces from "../Pieces/Pieces";
import Corners from "./../corners/Corners";
import { CheckWin } from "../../utils/game.utils";

const Board = () => {
  const { setAllPiecesPlaced, pieces, corners, lines, setWin } = useGame();

  useEffect(() => {
    let AllPlaced = true;

    pieces.forEach((p) => {
      if (p.corner !== 0 && !p.corner) {
        AllPlaced = false;
      }
    });
    setAllPiecesPlaced(AllPlaced);
  }, [pieces, setAllPiecesPlaced]);

  useEffect(() => {
    const win = CheckWin(corners, lines);

    console.log(win);

    if (win.win) {
      setWin(win);
    }

    return () => {};
  }, [corners, lines, setWin]);

  return (
    <div className="board">
      <Pieces />
      <Corners />
      <BoardLine />
    </div>
  );
};

export default Board;
