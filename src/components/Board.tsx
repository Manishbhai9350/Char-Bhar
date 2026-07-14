import { LinesData } from "../context/game/game";
import BoardLine from "./Line";
import Corner from "./Corner";
import Pieces from "./Pieces/Pieces";
import { GetCornerPositionByIndex } from "../utils/game.utils";
import { useGame } from "../context/game/game.hook";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

const Board = () => {
  const { turn, corners } = useGame();

  return (
    <div className="board">
      <p>Turn For Player {turn}</p>
      <Pieces />
      {new Array(9).fill("_").map((_, i) => {
        const Position = GetCornerPositionByIndex(
          i,
          PER_POINT_GAP,
          BOARD_PADDING,
        );
        return (
          <>
            <Corner key={i} index={i} position={Position} />
          </>
        );
      })}
      <BoardLine corners={corners} lines={LinesData} />
    </div>
  );
};

export default Board;
