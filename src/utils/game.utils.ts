export const GetCornerPositionByIndex = (
  i: number,
  PER_POINT_GAP: number,
  BOARD_PADDING: number,
) => {
  return {
    x: ((i % 3) + 0.5) * PER_POINT_GAP + BOARD_PADDING,
    y: innerHeight / 2 - PER_POINT_GAP + Math.floor(i / 3) * PER_POINT_GAP,
  };
};

export const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
