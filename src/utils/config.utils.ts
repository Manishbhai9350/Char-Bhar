import type { AppConfig, PieceProps } from "../context/game/game";

export const GetDeviceMode = (width: number /* , height: number */) => {
  const mode = width < 900 ? (width < 400 ? "mobile" : "tablet") : "desktop";

  return mode;
};

export const GetDeviceConfigs = (width: number, height: number): AppConfig => {
  const mode = GetDeviceMode(width);

  const baseSize = Math.min(width, height);

  let boardSize = 0;
  let paddingRatio = 0;

  if (mode === "mobile") {
    boardSize = baseSize * 0.9;
    paddingRatio = 0.08;
  } else if (mode === "tablet") {
    boardSize = baseSize * 0.7;
    paddingRatio = 0.1;
  } else {
    // 🔥 Desktop rules
    boardSize = height * 0.7;
    boardSize = Math.min(boardSize, width * 0.6);

    paddingRatio = 0.15;
  }

  // clamp for safety
  boardSize = Math.max(260, Math.min(boardSize, 650));

  const padding = boardSize * paddingRatio;
  const gap = (boardSize - padding * 2) / 2;

  const pieceOffsetX = boardSize * 0.2;
  const pieceGap = gap * 0.8;

  const centerX = width / 2;
  const centerY = height / 2;

  const boardStartX = centerX - boardSize / 2;

  const offsetY = 0; // you can tweak later (for UI space)

  return {
    mode,

    board_size: boardSize,
    board_padding: padding,
    per_point_gap: gap,
    board_start_x: boardStartX,

    piece_offset_x: pieceOffsetX,
    piece_gap: pieceGap,

    centerX,
    centerY,

    offsetY,
  };
};

export const GetCornerPositionByIndex = (i: number, config: AppConfig) => {
  const { per_point_gap, board_padding, centerY, board_start_x } = config;

  return {
    x: board_start_x + ((i % 3) + 0.5) * per_point_gap + board_padding,

    y: centerY - per_point_gap + Math.floor(i / 3) * per_point_gap,
  };
};

export const GetPieces = (config: AppConfig, width: number) => {
  const { piece_offset_x, piece_gap, centerY } = config;

  return [
    // Left side
    {
      index: 0,
      player: "1",
      id: "1-1",
      position: {
        x: piece_offset_x,
        y: centerY - piece_gap,
      },
    },

    // Right side
    {
      index: 3,
      player: "2",
      id: "2-1",
      position: {
        x: width - piece_offset_x,
        y: centerY - piece_gap,
      },
    },

    // ...same for others
  ];
};
