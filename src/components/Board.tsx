import { LinesData } from "../context/game/game";
import BoardLine from "./Line";
import Piece from "./Piece";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

const GetPiecePositionByIndex = (i: number) => {
  return {
    x: ((i % 3) + 0.5) * PER_POINT_GAP + BOARD_PADDING,
    y: innerHeight / 2 - PER_POINT_GAP + Math.floor(i / 3) * PER_POINT_GAP,
  };
};

const Board = () => {
  const Corners = new Array(9).fill("_").map((_, i) => {
    const Position = GetPiecePositionByIndex(i);
    return {
      index: i,
      ...Position,
    };
  });
  return (
    <div className="board">
      {new Array(9).fill("_").map((_, i) => {
        const Position = GetPiecePositionByIndex(i);
        return (
          <>
            <Piece key={i} index={i} position={Position} />
          </>
        );
      })}
      <BoardLine corners={Corners} lines={LinesData} />
    </div>
  );
};

export default Board;
