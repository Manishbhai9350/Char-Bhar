import { useEffect, useRef } from "react";
import Board from "../../components/boards/Board";
import { useGame } from "../../context/game/game.hook";
import {
  type Corner,
  type PieceProps,
  type PlayerProp,
} from "../../context/game/game";

function GetBotMove(
  corners: Corner[],
  pieces: PieceProps[],
  aiPlayer: PlayerProp,
  allPlaced: boolean,
) {
  const PossibleCorners = corners.filter(
    (C) => C.player !== "1" && C.player !== "2",
  );

  const PossiblePieces = pieces.filter(
    (P) => !P.corner && P.player == aiPlayer,
  );

  let MoveCorner, MovePiece, move;

  if (!allPlaced) {
    const randomCorner = Math.floor(Math.random() * PossibleCorners.length);
    const randomPiece = Math.floor(Math.random() * PossiblePieces.length);
    const Corner = PossibleCorners[randomCorner];
    const Piece = PossiblePieces[randomPiece];

    MoveCorner = Corner;
    MovePiece = Piece;
    move = "place";
  } else {
    // TODO?? Bot Move
  }

  return {
    move,
    MoveCorner,
    MovePiece,
  };
}

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
  } = useGame();

  const AiMoveTimeout = useRef(0);

  useEffect(() => {
    setMode("single");
    setCurrentPlayer("1");
    setTurn(Math.random() <= 0.5 ? "1" : "2");
    return () => {
      setMode(null);
    };
  }, []);

  useEffect(() => {
    if (turn && currentPlayer && turn !== currentPlayer) {
      clearTimeout(AiMoveTimeout.current);

      AiMoveTimeout.current = setTimeout(() => {
        const AIPlayer = currentPlayer == "1" ? "2" : "1";
        const move = GetBotMove(corners, pieces, AIPlayer, AllPiecesPlaced);

        console.log(move);

        setPieces((Ps) => {
          if (!move.MoveCorner || !move.MovePiece) return Ps; // nothing to update, bail safely

          const Updated = Ps.map((P) => {
            return P.index === move.MovePiece!.index
              ? {
                  ...P,
                  corner: move.MoveCorner!.index,
                  player: AIPlayer,
                  position: move.MoveCorner!.position,
                }
              : P;
          });

          return Updated;
        });
        setPieces((Ps) => {
          const { MoveCorner, MovePiece } = move;
          if (!MoveCorner || !MovePiece) return Ps;

          return Ps.map((P) =>
            P.index === MovePiece.index
              ? {
                  ...P,
                  corner: MoveCorner.index,
                  player: AIPlayer,
                  position: MoveCorner.position,
                }
              : P,
          );
        });

        setTurn((T) => (T == "1" ? "2" : "1"));
      }, 1000);
    }

    return () => {
      clearTimeout(AiMoveTimeout.current);
    };
  }, [
    turn,
    setTurn,
    currentPlayer,
    corners,
    pieces,
    AllPiecesPlaced,
    setCorners,
    setPieces,
  ]);

  return (
    <div className="single-player">
      <p>Turn For {turn}</p>
      <Board />
    </div>
  );
};

export default SinglePlayer;
