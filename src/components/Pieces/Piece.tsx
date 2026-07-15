import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect, useRef } from "react";
import type { PieceProps } from "../../context/game/game";
import { useGame } from "../../context/game/game.hook";

gsap.registerPlugin(Draggable);

const Piece = ({ position, player, index, corner }: PieceProps) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | null>(null);

  const {
    turn,
    TryMovePiece,
    setPieces,
    setCorners,
    setTurn,
    AllPiecesPlaced,
  } = useGame();

  // Always holds the latest TryMovePiece, updated every render
  const tryMovePieceRef = useRef(TryMovePiece);
  useEffect(() => {
    tryMovePieceRef.current = TryMovePiece;
  }, [TryMovePiece]);

  const isMyTurn = turn === player;

  useGSAP(() => {
    gsap.set(pieceRef.current, {
      ...position,
      xPercent: -50,
      yPercent: -50,
    });

    draggableRef.current = Draggable.create(pieceRef.current, {
      type: "x,y",
      bounds: ".board",
      onDragStart: function () {
        gsap.to(this.target, { scale: 1.1, duration: 0.15 });
      },
      onDragEnd: function () {
        gsap.to(this.target, { scale: 1, duration: 0.15 });

        const dropX = this.x;
        const dropY = this.y;

        const move = tryMovePieceRef.current(index, dropX, dropY);

        if (!move.move) {
          gsap.to(this.target, {
            x: move.fromCorner?.position.x ?? position.x,
            y: move.fromCorner?.position.y ?? position.y,
            duration: 0.3,
            ease: "power2.out",
          });
          return;
        }

        setCorners((crns) => {
          const updated = crns.map((C) => {
            if (C.index === move.corner?.index) {
              return { ...C, piece: index, player: turn };
            }
            if (C.index === move.fromCorner?.index) {
              return { ...C, piece: null, player: null };
            }
            return C;
          });

          return updated;
        });

        setTurn((t) => (t === "1" ? "2" : "1"));

        gsap.to(this.target, {
          x: move.corner!.position.x,
          y: move.corner!.position.y,
          duration: 0.3,
          ease: "power2.out",
          onUpdate: function () {
            //this.update();
          },
          onComplete: () => {
            setPieces((pieces) =>
              pieces.map((p) =>
                p.index === index
                  ? {
                      ...p,
                      position: move.corner!.position,
                      corner: move.corner?.index,
                    }
                  : p,
              ),
            );
          },
        });
      },
    });

    return () => {
      draggableRef.current?.[0]?.kill();
    };
  }, []);

  useGSAP(() => {
    const instance = draggableRef.current?.[0];
    if (!instance) return;

    const isPlaced = corner === 0 || !!corner;

    // Unplaced pieces can always be dragged on your turn (placement phase).
    // Placed pieces can only be dragged once every piece is down (movement phase).
    const Enabled = isMyTurn && (!isPlaced || AllPiecesPlaced);

    if (Enabled) {
      instance.enable();
    } else {
      instance.disable();
    }

    return () => instance.disable();
  }, [isMyTurn, AllPiecesPlaced, corner]);

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
