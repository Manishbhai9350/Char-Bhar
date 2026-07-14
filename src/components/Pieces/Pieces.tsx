import { PiecesData } from "../../context/game/game";
import Piece from "./Piece";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;

const Pieces = () => {
  return (
    <>
      {PiecesData.map((p, i) => {
        return <Piece {...p} key={i} />;
      })}
    </>
  );
};

export default Pieces;
