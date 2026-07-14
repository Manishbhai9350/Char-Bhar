import { createContext, type Dispatch, type SetStateAction } from "react";

export type Players = "1" | "2";

export interface Line {
  startPieceIndex: number;
  middlePieceIndex: number;
  endPieceIndex: number;
}

export interface PieceProps {
  index: number;
  player: string;
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Corner {
  index: number;
  player: string | null;
  piece: number | null;
  position: {
    x: number;
    y: number;
  };
}

interface GameData {
  lines: Line[];
  setLines: Dispatch<SetStateAction<Line[]>>;
  pieces: PieceProps[];
  setPieces: Dispatch<SetStateAction<PieceProps[]>>;
  corners: Corner[];
  setCorners: Dispatch<SetStateAction<Corner[]>>;
  turn: string;
  setTurn: Dispatch<SetStateAction<Players>>;
  TryMovePiece: (index: number, dropX: number, dropY: number) => boolean;
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

// The id of each piece represents its player and piece number p-n respectively;
export const PiecesData: PieceProps[] = [
  {
    index: 0,
    player: "1",
    id: "1-1",
    position: {
      x: 20,
      y: innerHeight / 2 - 100,
    },
  },
  {
    index: 1,
    player: "1",
    id: "1-2",
    position: {
      x: 20,
      y: innerHeight / 2,
    },
  },
  {
    index: 2,
    player: "1",
    id: "1-3",
    position: {
      x: 20,
      y: innerHeight / 2 + 100,
    },
  },
  {
    index: 3,
    player: "2",
    id: "2-1",
    position: {
      x: innerWidth - 20 - 50,
      y: innerHeight / 2 - 100,
    },
  },
  {
    index: 4,
    player: "2",
    id: "2-2",
    position: {
      x: innerWidth - 20 - 50,
      y: innerHeight / 2,
    },
  },
  {
    index: 5,
    player: "2",
    id: "2-3",
    position: {
      x: innerWidth - 20 - 50,
      y: innerHeight / 2 + 100,
    },
  },
];

export const CornersData: Corner[] = [];


export const GameContext = createContext<GameData>({
  lines: LinesData,
  pieces: PiecesData,
  turn: Math.random() < 0.5 ? "1" : "2",
  corners: CornersData,
  setCorners: () => {},
  setLines: () => {},
  setPieces: () => {},
  setTurn: () => {},
  TryMovePiece: () => false,
});
