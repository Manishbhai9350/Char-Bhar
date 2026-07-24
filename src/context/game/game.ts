import { createContext, type Dispatch, type SetStateAction } from "react";
import { GetDeviceMode } from "../../utils/config.utils";

export interface PlayerStateProps {
  player1: {
    score: number;
    lifes: number;
  };
  player2: {
    score: number;
    lifes: number;
  };
}

export interface Line {
  startPieceIndex: number;
  middlePieceIndex: number;
  endPieceIndex: number;
}

export interface PieceProps {
  index: number;
  player: string;
  id: string;
  corner?: number;
  position: {
    x: number;
    y: number;
  };
}

export type PlayerProp = "1" | "2" | null;

export interface Corner {
  index: number;
  player: PlayerProp;
  piece: number | null;
  position: {
    x: number;
    y: number;
  };
}

export interface WinProps {
  win: boolean;
  who?: "1" | "2";
}

interface TryMovePieceReturn {
  move: boolean | string;
  corner?: Corner;
  fromCorner?: Corner;
}

export type ModeType = "single" | "local" | "multiplayer" | null;

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

export interface AppConfig {
  mode: "mobile" | "tablet" | "desktop";

  // board
  board_size: number;
  board_padding: number;
  per_point_gap: number;
  board_start_x: number;

  // pieces
  piece_offset_x: number;
  piece_gap: number;

  // layout helpers
  centerX: number;
  centerY: number;

  // optional but useful
  offsetY: number;
};

interface GameData {
  currentPlayer: PlayerProp;
  setCurrentPlayer: Dispatch<SetStateAction<PlayerProp>>;
  mode: ModeType;
  setMode: Dispatch<SetStateAction<ModeType>>;
  lines: Line[];
  setLines: Dispatch<SetStateAction<Line[]>>;
  pieces: PieceProps[];
  setPieces: Dispatch<SetStateAction<PieceProps[]>>;
  corners: Corner[];
  setCorners: Dispatch<SetStateAction<Corner[]>>;
  turn: PlayerProp;
  setTurn: Dispatch<SetStateAction<PlayerProp>>;
  AllPiecesPlaced: boolean;
  setAllPiecesPlaced: Dispatch<SetStateAction<boolean>>;
  MoveStarted: boolean;
  setMoveStarted: Dispatch<SetStateAction<boolean>>;
  win: WinProps;
  setWin: Dispatch<SetStateAction<WinProps>>;
  playerStates: PlayerStateProps;
  setPlayerStates: Dispatch<SetStateAction<PlayerStateProps>>;
  toast: string;
  setToast: Dispatch<SetStateAction<string>>;
  config: AppConfig;
  TryMovePiece: (
    index: number,
    dropX: number,
    dropY: number,
  ) => TryMovePieceReturn;
}

export const LinesData: Line[] = [
  // Rows
  { startPieceIndex: 0, middlePieceIndex: 1, endPieceIndex: 2 },
  { startPieceIndex: 3, middlePieceIndex: 4, endPieceIndex: 5 },
  { startPieceIndex: 6, middlePieceIndex: 7, endPieceIndex: 8 },

  // Columns
  { startPieceIndex: 0, middlePieceIndex: 3, endPieceIndex: 6 },
  { startPieceIndex: 1, middlePieceIndex: 4, endPieceIndex: 7 },
  { startPieceIndex: 2, middlePieceIndex: 5, endPieceIndex: 8 },

  // Diagonals
  { startPieceIndex: 0, middlePieceIndex: 4, endPieceIndex: 8 },
  { startPieceIndex: 2, middlePieceIndex: 4, endPieceIndex: 6 },
];

const PIECES_INITIAL_GAP = 100;
const OFFSET = 30;

// The id of each piece represents its player and piece number p-n respectively;
export const PiecesData: PieceProps[] = [
  {
    index: 0,
    player: "1",
    id: "1-1",
    position: {
      x: 50,
      y: OFFSET + innerHeight / 2 - PIECES_INITIAL_GAP,
    },
  },
  {
    index: 1,
    player: "1",
    id: "1-2",
    position: {
      x: 50,
      y: OFFSET + innerHeight / 2,
    },
  },
  {
    index: 2,
    player: "1",
    id: "1-3",
    position: {
      x: 50,
      y: OFFSET + innerHeight / 2 + PIECES_INITIAL_GAP,
    },
  },
  {
    index: 3,
    player: "2",
    id: "2-1",
    position: {
      x: innerWidth - 50,
      y: OFFSET + innerHeight / 2 - PIECES_INITIAL_GAP,
    },
  },
  {
    index: 4,
    player: "2",
    id: "2-2",
    position: {
      x: innerWidth - 50,
      y: OFFSET + innerHeight / 2,
    },
  },
  {
    index: 5,
    player: "2",
    id: "2-3",
    position: {
      x: innerWidth - 50,
      y: OFFSET + innerHeight / 2 + PIECES_INITIAL_GAP,
    },
  },
];

export const CornersData: Corner[] = [];

export type PossibleMoves = Record<number, number[]>;

/**
 * Builds a map of each corner index to the list of corners
 * reachable from it in a single move — its neighbours, plus
 * its own index (so "did it move to a valid spot, including
 * staying in place" can be checked with one lookup).
 *
 * Each line contributes two adjacency pairs:
 *   start <-> middle
 *   middle <-> end
 * (start <-> end is intentionally NOT a direct neighbour,
 * since a piece can't hop over the middle corner.)
 *
 * @param lines - The board's line definitions (rows, columns, diagonals).
 * @returns A map from corner index to itself + its neighbouring corner indices.
 */
export function buildPossibleMoves(lines: Line[]): PossibleMoves {
  const moves: PossibleMoves = {};
  for (let i = 0; i < 9; i++) moves[i] = [];

  const addNeighbour = (a: number, b: number) => {
    if (!moves[a].includes(b)) moves[a].push(b);
    if (!moves[b].includes(a)) moves[b].push(a);
  };

  lines.forEach(({ startPieceIndex, middlePieceIndex, endPieceIndex }) => {
    addNeighbour(startPieceIndex, middlePieceIndex);
    addNeighbour(middlePieceIndex, endPieceIndex);
  });

  return moves;
}
export const GameContext = createContext<GameData>({
  lines: LinesData,
  pieces: PiecesData,
  currentPlayer: null,
  setCurrentPlayer: () => {},
  mode: null,
  setMode: () => {},
  turn: Math.random() < 0.5 ? "1" : "2",
  corners: CornersData,
  setCorners: () => {},
  setLines: () => {},
  setPieces: () => {},
  setTurn: () => {},
  TryMovePiece: () => ({ move: false }),
  AllPiecesPlaced: false,
  MoveStarted: false,
  setAllPiecesPlaced: () => {},
  setMoveStarted: () => {},
  win: { win: false },
  setWin: () => {},
  playerStates: {
    player1: {
      lifes: 3,
      score: 0,
    },
    player2: {
      lifes: 3,
      score: 0,
    },
  },
  setPlayerStates: () => {},
  toast: "",
  setToast: () => {},

  config: {
    mode: GetDeviceMode(innerWidth,/* innerHeight */),
    board_padding: BOARD_PADDING,
    per_point_gap: PER_POINT_GAP,
    centerY: innerHeight / 2,
    piece_gap:0,
    piece_offset_x:0,
    board_size:0,
    board_start_x:0,
    centerX:innerWidth/2,
    offsetY:0
  },
});
