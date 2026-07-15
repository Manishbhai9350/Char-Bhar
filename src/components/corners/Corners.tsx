import { useGame } from "../../context/game/game.hook";
import { GetCornerPositionByIndex } from "../../utils/game.utils";
import Corner from "./Corner";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

const Corners = () => {
  const { corners } = useGame();

  return corners.map((_, i) => {
    const Position = GetCornerPositionByIndex(i, PER_POINT_GAP, BOARD_PADDING);
    return <Corner key={"corner-" + i} index={i} position={Position} />;
  });
};

export default Corners;
