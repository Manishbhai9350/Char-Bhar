import { useMemo, useState, type ReactNode } from "react";
import {
  buildPossibleMoves,
  GameContext,
  LinesData,
  PiecesData,
  type Corner,
  type ModeType,
  type PlayerProp,
} from "./game";
import {
  CheckWin,
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
  const [Turn, setTurn] = useState<PlayerProp>("1");
  const [AllPiecesPlaced, setAllPiecesPlaced] = useState(false);
  const [MoveStarted, setMoveStarted] = useState(false);
  const [Win, setWin] = useState<{ win: boolean; who?: "1" | "2" }>({
    win: false,
  });
  const [mode, setMode] = useState<ModeType>(null);
  const [CurrentPlayer, setCurrentPlayer] = useState<PlayerProp>(null);
  const [Scores, setScores] = useState({
    player1: 0,
    player2: 0,
  });

  const PossibleMoves = useMemo(() => buildPossibleMoves(Lines), [Lines]);

  /**
   * Finds the corner closest to a given drop coordinate.
   *
   * @param corner - The corner where player tried of move.
   * @param index - The index of the piece.
   * @param fromCornerIndex - The index of the corner from where user moved.
   */

  function validateMove(
    corner: Corner,
    index: number,
    fromCornerIndex?: number,
  ) {
    let valid: boolean = true;

    if (typeof corner.piece == "number" && corner.piece !== index) {
      valid = false;
      return valid;
    }

    if (typeof fromCornerIndex == "number") {
      const ValidMoves = PossibleMoves[fromCornerIndex];
      if (ValidMoves.indexOf(corner.index) < 0) {
        valid = false;
        return valid;
      }
    }

    // Rule: can't win during placement — must move at least once first.
    if (valid && !AllPiecesPlaced) {
      const dummyCorners = Corners.map((c) => {
        if (c.index === corner.index)
          return { ...c, piece: index, player: Turn };
        if (
          typeof fromCornerIndex === "number" &&
          c.index === fromCornerIndex
        ) {
          return { ...c, piece: null, player: null };
        }
        return c;
      });

      const { win } = CheckWin(dummyCorners, Lines);

      if (win) valid = false;
    }

    return valid;
  }

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
    if (fromCorner?.index === corner.index) {
      return { move: false, reason: "same-corner", fromCorner };
    }

    const ValidMove = validateMove(corner, index, fromCorner?.index);

    if (!ValidMove) {
      return { move: false, reason: "invalid-move", fromCorner };
    }

    return {
      move: true,
      corner,
      fromCorner,
    };
  }

  return (
    <GameContext.Provider
      value={{
        currentPlayer: CurrentPlayer,
        setCurrentPlayer,
        mode,
        setMode,
        lines: Lines,
        pieces: Pieces,
        turn: Turn,
        corners: Corners,
        setCorners: setCorners,
        setLines,
        setPieces,
        setTurn,
        TryMovePiece,
        AllPiecesPlaced,
        setAllPiecesPlaced,
        MoveStarted,
        setMoveStarted,
        win: Win,
        setWin,
        scores: Scores,
        setScores,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
