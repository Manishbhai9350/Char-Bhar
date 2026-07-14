import type { Corner, Line } from "../context/game/game";


export default function BoardLine({ corners, lines }: { corners: Corner[]; lines: Line[] }) {
  return (
    <svg className="board-lines" width="100%" height="100%">
      {lines.map((line, i) => {
        const start = corners[line.startPieceIndex].position;
        const end = corners[line.endPieceIndex].position;
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