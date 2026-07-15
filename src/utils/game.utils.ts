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

export const squaredDistance = (x1: number, y1: number, x2: number, y2: number) => (x2 - x1) ** 2 + (y2 - y1) ** 2;