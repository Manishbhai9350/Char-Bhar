import { useGame } from "../../context/game/game.hook";
import Piece from "./Piece";

// const BOARD_WIDTH = innerWidth;
// const BOARD_PADDING = 40;
// const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

const Pieces = () => {
  const { pieces } = useGame();
  return (
    <>
      {pieces.map((p, i) => {
        return <Piece {...p} key={'piece-'+i} />;
      })}
    </>
  );
};

export default Pieces;
