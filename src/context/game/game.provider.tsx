import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  buildPossibleMoves,
  GameContext,
  LinesData,
  PiecesData,
  type AppConfig,
  type Corner,
  type ModeType,
  type PlayerProp,
  type PlayerStateProps,
} from "./game";
import { CheckWin, squaredDistance } from "../../utils/game.utils";
import {
  GetCornerPositionByIndex,
  GetDeviceConfigs,
  GetDeviceMode,
} from "../../utils/config.utils";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [Pieces, setPieces] = useState(PiecesData);
  const [Lines, setLines] = useState(LinesData);
  const [Config, setConfig] = useState<AppConfig>({
    board_padding: BOARD_PADDING,
    board_width: BOARD_WIDTH,
    per_point_gap: PER_POINT_GAP,
    mode: GetDeviceMode(innerWidth /* innerHeight */),
    initial_gap: 100,
    offset: 30,
    centerY: innerHeight / 2,
    piece_gap: 0,
    piece_offset_x: 0,
    board_size: innerWidth,
    board_start_x: 0,
  });
  const [Corners, setCorners] = useState<Corner[]>([]);
  const [Turn, setTurn] = useState<PlayerProp>("1");
  const [AllPiecesPlaced, setAllPiecesPlaced] = useState(false);
  const [MoveStarted, setMoveStarted] = useState(false);
  const [Win, setWin] = useState<{ win: boolean; who?: "1" | "2" }>({
    win: false,
  });
  const [mode, setMode] = useState<ModeType>(null);
  const [CurrentPlayer, setCurrentPlayer] = useState<PlayerProp>(null);
  const [PlayerStates, setPlayerStates] = useState<PlayerStateProps>({
    player1: {
      score: 0,
      lifes: 3,
    },
    player2: {
      score: 0,
      lifes: 3,
    },
  });

  const [Toast, setToast] = useState("");

  const PossibleMoves = useMemo(() => buildPossibleMoves(Lines), [Lines]);

  useEffect(() => {
    const corners = new Array(9).fill("_").map((_, i) => {
      const Position = GetCornerPositionByIndex(i, Config);
      return {
        index: i,
        player: null,
        piece: null,
        position: Position,
      };
    });

    setCorners(corners);

    return () => {};
  }, [Config]);

  useEffect(() => {
    let timeout = 0;

    const Resize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setConfig(GetDeviceConfigs(innerWidth, innerHeight));
      }, 100);
    };

    Resize();

    window.addEventListener("resize", Resize);
    return () => window.removeEventListener("resize", Resize);
  }, []);

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
        playerStates: PlayerStates,
        setPlayerStates,
        toast: Toast,
        setToast,

        config: Config,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
