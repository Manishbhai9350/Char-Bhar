import { useEffect, useRef } from "react";
import { useGame } from "../../context/game/game.hook";
import BoardLine from "../lines/Line";
import Pieces from "../Pieces/Pieces";
import Corners from "./../corners/Corners";
import { CheckWin } from "../../utils/game.utils";
import PlayersUI from "../player/player.ui";
import { PiecesData } from "../../context/game/game";

const Board = () => {
  const {
    setAllPiecesPlaced,
    pieces,
    setPieces,
    corners,
    setCorners,
    lines,
    setWin,
    setScores,
    win: GameWon,
  } = useGame();

  useEffect(() => {
    let AllPlaced = true;

    pieces.forEach((p) => {
      if (p.corner !== 0 && !p.corner) {
        AllPlaced = false;
      }
    });
    setAllPiecesPlaced(AllPlaced);
  }, [pieces, setAllPiecesPlaced]);

  const TimeoutID = useRef(0);

  useEffect(() => {
    if (GameWon.win) return; // 🛑 STOP if already won
    clearTimeout(TimeoutID.current);

    const win = CheckWin(corners, lines);

    if (win.win) {
      if (win.who == "1") {
        setScores((s) => ({
          ...s,
          player1: s.player1 + 1,
        }));
      }

      if (win.who == "2") {
        setScores((s) => ({
          ...s,
          player2: s.player2 + 1,
        }));
      }

      setWin(win); // 🔒 lock

      TimeoutID.current = window.setTimeout(() => {
        setPieces(PiecesData);

        setCorners((Crns) =>
          Crns.map((C) => ({
            ...C,
            piece: null,
            player: null,
          })),
        );

        setAllPiecesPlaced(false);
        setWin({ win: false, who: undefined });
      }, 2000);
    }

    return () => {};
  }, [corners, lines, GameWon.win]); // 👈 IMPORTANT deps
  return (
    <div className="board">
      <PlayersUI />
      <Pieces />
      <Corners />
      <BoardLine />
    </div>
  );
};

export default Board;
