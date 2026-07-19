import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useRef } from "react";
import type { PieceProps, PlayerProp } from "../../context/game/game";
import { useGame } from "../../context/game/game.hook";

gsap.registerPlugin(useGSAP, Draggable);

const Piece = ({ position, player, index, corner }: PieceProps) => {
  const pieceRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable[] | null>(null);

  const {
    mode,
    turn,
    TryMovePiece,
    setPieces,
    setCorners,
    setTurn,
    AllPiecesPlaced,
    currentPlayer,
  } = useGame();

  const turnRef = useRef<PlayerProp>(turn);
  useGSAP(() => {
    turnRef.current = turn;
  }, [turn]);

  // Always holds the latest TryMovePiece, so Draggable's callbacks
  // (created once, on mount) never call a stale closure.
  const tryMovePieceRef = useRef(TryMovePiece);
  useGSAP(() => {
    tryMovePieceRef.current = TryMovePiece;
  }, [TryMovePiece]);

  // Guards against the position-sync effect re-animating a piece
  // that this component *itself* just finished animating via drag.
  const skipNextPositionSync = useRef(false);
  const hasMounted = useRef(false);

  const isMyTurn =
    (turn === player && turn === currentPlayer) ||
    (turn === player && mode === "local");

  // ---- Mount: create the draggable ONCE, place the piece instantly ----
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

        setCorners((crns) =>
          crns.map((C) => {
            if (C.index === move.corner?.index) {
              return { ...C, piece: index, player: turnRef.current };
            }
            if (C.index === move.fromCorner?.index) {
              return { ...C, piece: null, player: null };
            }
            return C;
          }),
        );

        setTurn((t) => (t === "1" ? "2" : "1"));

        // This tween IS the drop animation. Tell the position-sync
        // effect (below) to skip once, so it doesn't re-tween the
        // same move a second time when `position` updates in state.
        skipNextPositionSync.current = true;

        gsap.to(this.target, {
          x: move.corner!.position.x,
          y: move.corner!.position.y,
          duration: 0.3,
          ease: "power2.out",
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

    hasMounted.current = true;

    return () => {
      draggableRef.current?.[0]?.kill();
    };
  }, []);

  // ---- Position sync: animate to `position` whenever it changes for   ----
  // ---- any reason OTHER than this component's own drag-drop above.    ----
  useGSAP(() => {
    console.log("position sync fired", index, position);
    if (!hasMounted.current) return;
    if (skipNextPositionSync.current) {
      skipNextPositionSync.current = false;
      return;
    }
    gsap.to(pieceRef.current, {
      ...position,
      xPercent: -50,
      yPercent: -50,
      duration: 0.3,
    });
  }, [position]);

  // ---- Enable/disable dragging based on turn/phase ----
  useGSAP(() => {
    const instance = draggableRef.current?.[0];
    if (!instance) return;

    const isPlaced = corner === 0 || !!corner;

    // Unplaced pieces can be dragged on your turn (placement phase).
    // Placed pieces can only be dragged once every piece is down (movement phase).
    const enabled = isMyTurn && (!isPlaced || AllPiecesPlaced);

    if (enabled) {
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
