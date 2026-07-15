import { useState, type ReactNode } from "react";
import {
  GameContext,
  LinesData,
  PiecesData,
  type Corner,
  type Players,
} from "./game";
import {
  GetCornerPositionByIndex,
  squaredDistance,
} from "../../utils/game.utils";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [Pieces, setPieces] = useState(PiecesData);
  const [Lines, setLines] = useState(LinesData);
  const [Corners, setCorners] = useState<Corner[]>(
    new Array(9).fill("_").map((_, i) => {
      const Position = GetCornerPositionByIndex(
        i,
        PER_POINT_GAP,
        BOARD_PADDING,
      );
      return {
        index: i,
        player: null,
        piece: null,
        position: Position,
      };
    }),
  );
  const [Turn, setTurn] = useState<Players>("1");

  // useEffect(() => {
  //   const corners = new Array(9).fill("_").map((_, i) => {
  //     const Position = GetCornerPositionByIndex(
  //       i,
  //       PER_POINT_GAP,
  //       BOARD_PADDING,
  //     );
  //     return {
  //       index: i,
  //       player: null,
  //       piece: null,
  //       ...Position,
  //     };
  //   });

  //   setCorners(corners);

  //   return () => {};
  // }, []);
  /**
   * Finds the corner closest to a given drop coordinate.
   *
   * @param dropX - The x coordinate where the piece was dropped.
   * @param dropY - The y coordinate where the piece was dropped.
   * @param corners - The current list of corners to search through.
   * @returns The `index` of the nearest corner, or `-1` if none found.
   */
  function getNearestCornerIndex(
    dropX: number,
    dropY: number,
    corners: Corner[],
  ): number {
    let nearestIndex = -1;
    let nearestDist = Infinity;

    corners.forEach((corner) => {
      const d = squaredDistance(
        dropX,
        dropY,
        corner.position.x,
        corner.position.y,
      );
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = corner.index;
      }
    });

    return nearestIndex;
  }

  /**
   * Attempts to move a piece to the corner nearest the given drop position.
   *
   * @param index - The index of the piece being moved (its position in `Pieces`).
   * @param dropX - The x coordinate where the piece was dropped.
   * @param dropY - The y coordinate where the piece was dropped.
   * @returns An object describing the result of the move:
   *  - `move`: whether the move was accepted.
   *  - `corner`: the destination corner, if the move succeeded.
   *  - `fromCornerIndex`: the corner the piece moved *from*, if found.
   */
  function TryMovePiece(index: number, dropX: number, dropY: number) {
    const targetCornerIndex = getNearestCornerIndex(dropX, dropY, Corners);

    if (targetCornerIndex < 0) {
      return { move: false };
    }

    const corner = Corners[targetCornerIndex];

    // Find which corner this piece is currently sitting on,
    // so the caller can clear it after a successful move.
    const fromCorner = Corners.find((c) => c.piece === index);

    // If the nearest corner is the same one the piece started on,
    // treat it as no move at all (e.g. user picked it up and dropped
    // it back in roughly the same spot) rather than a valid move.
    if (fromCorner?.index == corner.index)
      return {
        move: "same",
        fromCorner,
      };

    return {
      move: true,
      corner,
      fromCorner,
    };
  }


  return (
    <GameContext.Provider
      value={{
        lines: Lines,
        pieces: Pieces,
        turn: Turn,
        corners: Corners,
        setCorners: setCorners,
        setLines,
        setPieces,
        setTurn,
        TryMovePiece,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
