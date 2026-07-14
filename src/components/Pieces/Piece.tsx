import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";
import type { PieceProps } from "../../context/game/game";
import { useGame } from "../../context/game/game.hook";

gsap.registerPlugin(Draggable);

const Piece = ({ position, player, index }: PieceProps) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | null>(null);

  const { turn, TryMovePiece } = useGame();

  const isMyTurn = turn === player;

  useGSAP(() => {
    gsap.set(pieceRef.current, {
      ...position,
    });

    draggableRef.current = Draggable.create(pieceRef.current, {
      type: "x,y",
      bounds: ".board", // constrain drag within the board container
      onDragStart: function () {
        gsap.to(this.target, { scale: 1.1, duration: 0.15 });
      },
      onDrag: function () {
        // this.x / this.y available here if you want live feedback,
        // e.g. highlighting the nearest valid corner while dragging
      },
      onDragEnd: function () {
        gsap.to(this.target, { scale: 1, duration: 0.15 });

        const dropX = this.x;
        const dropY = this.y;

        const moved = TryMovePiece(index, dropX, dropY);

        if (!moved) {
          // illegal move (not a neighbour, occupied, not your turn, etc.)
          // snap back to original position
          gsap.to(this.target, {
            ...position,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        // if moved, your game state update should re-render Piece
        // with the new `position`, and the effect below will
        // animate it there via gsap.set/to on re-mount or update
      },
    });

    return () => {
      draggableRef.current?.[0]?.kill();
    };
  }, []);

  // Enable/disable dragging based on whose turn it is,
  // without recreating the Draggable instance
  useGSAP(() => {
    const instance = draggableRef.current?.[0];
    if (!instance) return;

    if (isMyTurn) {
      instance.enable();
    } else {
      instance.disable();
    }
  }, [isMyTurn]);

  return (
    <div
      ref={pieceRef}
      className={`piece player-${player} ${isMyTurn ? "turn" : ""}`}
    >
      <div className="ring ring-1"></div>
      <div className="ring ring-2"></div>
    </div>
  );
};

export default Piece;