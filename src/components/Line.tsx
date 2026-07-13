import type { Line } from "../context/game/game";

interface Corner {
  index: number;
  x: number; // pixel position within the board
  y: number;
}

export default function BoardLine({ corners, lines }: { corners: Corner[]; lines: Line[] }) {
  return (
    <svg className="board-lines" width="100%" height="100%">
      {lines.map((line, i) => {
        const start = corners[line.startPieceIndex];
        const end = corners[line.endPieceIndex];
        return (
          <line
            key={i}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="var(--line-color)"
            strokeWidth="var(--line-width)"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}