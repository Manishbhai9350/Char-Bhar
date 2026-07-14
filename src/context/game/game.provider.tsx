import { useState, type ReactNode } from "react";
import {
  GameContext,
  LinesData,
  PiecesData,
  type Corner,
  type Players,
} from "./game";
import { distance, GetCornerPositionByIndex } from "../../utils/game.utils";
import gsap from "gsap";

const BOARD_WIDTH = innerWidth;
const BOARD_PADDING = 40;
const PER_POINT_GAP = (BOARD_WIDTH - 2 * BOARD_PADDING) / 3;
const PIN_RADIUS = 200;

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [Pieces, setPieces] = useState(PiecesData);
  const [Lines, setLines] = useState(LinesData);
  const [Corners, setCorners] = useState<Corner[]>(
    new Array(9).fill("_").map((_, i) => {
      const Position = GetCornerPositionByIndex(
        i,
        PER_POINT_GAP,
        BOARD_PADDING,
      );
      return {
        index: i,
        player: null,
        piece: null,
        position:Position,
      };
    }),
  );
  const [Turn, setTurn] = useState<Players>("1");

  // useEffect(() => {
  //   const corners = new Array(9).fill("_").map((_, i) => {
  //     const Position = GetCornerPositionByIndex(
  //       i,
  //       PER_POINT_GAP,
  //       BOARD_PADDING,
  //     );
  //     return {
  //       index: i,
  //       player: null,
  //       piece: null,
  //       ...Position,
  //     };
  //   });

  //   setCorners(corners);

  //   return () => {};
  // }, []);

  function TryMovePiece(index: number, dropX: number, dropY: number) {
    console.log(index,dropX,dropY)

    const piece = Pieces[index];

    if(piece.player !== Turn) return false;

    // TODO Check for if it is a valid move

    // Finding the nearest corner and placing the piece there

    let nearest = Infinity;
    let nearestIdx:number | null = null;

    console.log(Corners)

    for(let i = 0; i < Corners.length; i++) {
      const corner = Corners[i];
      const dist = distance(corner.position.x,dropX,corner.position.y,dropY);

      if(dist < nearest && dist <= PIN_RADIUS) {
        nearest = dist;
        nearestIdx = i;
      }

      console.log(dist)

    }

    if(!nearestIdx) {
      // console.log()
      return false;
    };
    console.log(nearest)
    console.log(Corners[nearestIdx])

    const debug1 = document.createElement('div')
    debug1.classList.add('debug', 'debug-1')
    const debug2 = document.createElement('div')
    debug2.classList.add('debug', 'debug-2')

    gsap.set(debug1,{
      left:dropX,
      top: dropY
    })
    gsap.set(debug2,{
      left:Corners[nearestIdx].position.x,
      top: Corners[nearestIdx].position.y
    })

    document.body.append(debug1,debug2)


    return false
  }

  return (
    <GameContext.Provider
      value={{
        lines: Lines,
        pieces: Pieces,
        turn: Turn,
        corners: Corners,
        setCorners: setCorners,
        setLines,
        setPieces,
        setTurn,
        TryMovePiece,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
