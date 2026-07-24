import { useGame } from "../../context/game/game.hook";
import { GetCornerPositionByIndex } from "../../utils/config.utils";
import Corner from "./Corner";

const Corners = () => {
  const { corners, config } = useGame();

  return corners.map((_, i) => {
    const Position = GetCornerPositionByIndex(i, config);
    return <Corner key={"corner-" + i} index={i} position={Position} />;
  });
};

export default Corners;
