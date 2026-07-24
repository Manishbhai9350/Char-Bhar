import { useEffect, useMemo, useRef } from "react";
import Board from "../../components/boards/Board";
import { useGame } from "../../context/game/game.hook";
import { buildPossibleMoves } from "../../context/game/game";
import { GetBotMove } from "./utils/bot.util";
import Toast from "../../components/toast/toast";

const SinglePlayer = () => {
  const {
    AllPiecesPlaced,
    setMode,
    setCurrentPlayer,
    turn,
    setTurn,
    currentPlayer,
    corners,
    pieces,
    setPieces,
    setCorners,
    lines,
    win: GameWon,
  } = useGame();

  const PossibleMoves = useMemo(() => buildPossibleMoves(lines), [lines]);

  const AiMoveTimeout = useRef(0);

  useEffect(() => {
    setMode("single");
    setCurrentPlayer("1");
    setTurn(Math.random() <= 0.5 ? "1" : "2");
    return () => {
      setMode(null);
    };
  }, [setCurrentPlayer, setMode, setTurn]);
  useEffect(() => {
    if (turn && currentPlayer && turn !== currentPlayer) {
      clearTimeout(AiMoveTimeout.current);

      AiMoveTimeout.current = window.setTimeout(() => {
        // 🛑 CRITICAL FIX: re-check latest state
        if (GameWon.win) return;

        const AIPlayer = turn;

        const move = GetBotMove(
          corners,
          pieces,
          lines,
          PossibleMoves,
          AIPlayer,
          AIPlayer == "1" ? "2" : "1",
          AllPiecesPlaced,
          "hard",
        );

        if (!move || !move.MoveCorner || !move.MovePiece) return;

        const { MoveCorner, MovePiece } = move;
        const fromCornerIndex = MovePiece.corner;

        setCorners((crns) =>
          crns.map((c) => {
            if (c.index === MoveCorner.index) {
              return { ...c, piece: MovePiece.index, player: AIPlayer };
            }
            if (
              typeof fromCornerIndex === "number" &&
              c.index === fromCornerIndex
            ) {
              return { ...c, piece: null, player: null };
            }
            return c;
          }),
        );

        setPieces((Ps) =>
          Ps.map((P) =>
            P.index === MovePiece.index
              ? {
                  ...P,
                  corner: MoveCorner.index,
                  player: AIPlayer,
                  position: MoveCorner.position,
                }
              : P,
          ),
        );

        setTurn((T) => (T === "1" ? "2" : "1"));
      }, 1000);
    }

    return () => {
      clearTimeout(AiMoveTimeout.current);
    };
  }, [
    turn,
    currentPlayer,
    corners,
    pieces,
    AllPiecesPlaced,
    lines,
    PossibleMoves,
    GameWon.win, // 👈 IMPORTANT (not whole object)
    setPieces,
    setCorners,
    setTurn,
  ]);
  return (
    <div className="single-player">
      <Toast />
      <Board />
    </div>
  );
};

export default SinglePlayer;
