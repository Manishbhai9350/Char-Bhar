import { createContext } from "react";

export interface Line {
  startPieceIndex: number;
  middlePieceIndex: number;
  endPieceIndex: number;
}

interface GameData {
  pieces: number[];
  lines: Line[];
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

export const InitialData: GameData = {
  pieces: [],
  lines: LinesData,
};

export const GameContext = createContext(InitialData);
