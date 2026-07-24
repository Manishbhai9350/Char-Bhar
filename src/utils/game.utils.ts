import type { Corner, Line, WinProps } from "../context/game/game";


export const squaredDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) => (x2 - x1) ** 2 + (y2 - y1) ** 2;

export const CheckWin = (corners: Corner[], lines: Line[]): WinProps => {
  let win = false;
  let who: '1' | '2' | undefined;

  // Use .every because other methods can not be break;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    const startCorner = corners[L.startPieceIndex];
    const middleCorner = corners[L.middlePieceIndex];
    const endCorner = corners[L.endPieceIndex];

    if (
      startCorner.player == middleCorner.player &&
      middleCorner.player == endCorner.player &&
      typeof startCorner.player == "string" &&
      typeof middleCorner.player == "string" &&
      typeof endCorner.player == "string"
    ) {
      win = true;
      who = startCorner.player;
      break;
    }
  }

  return { win, who };
};
