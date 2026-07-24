import { useGame } from "../../../context/game/game.hook";
import "./css/player.css";

interface PlayerCardProps {
  name: string;
  player: "1" | "2";
  avatarUrl?: string;
  progress?: number; // 0-100, drives the ring around the avatar
  isActive?: boolean;
  side?: "left" | "right";
  lifes: number;
}

export default function PlayerCard({
  name,
  player,
  avatarUrl,
  progress = 100,
  isActive = false,
  side = "left",
  lifes = 3,
}: PlayerCardProps) {
  const colorClass =
    player === "1" ? "player-card--teal" : "player-card--coral";

  const { win } = useGame();

  return (
    <div
      className={`player-card player-card-${side} ${colorClass} ${isActive && !win.win ? "player-card--active" : ""}`}
      style={{ "--progress": progress } as React.CSSProperties}
    >
      <div className="avatar-ring">
        <div className="avatar">
          {avatarUrl && <img src={avatarUrl} alt={`${name}'s avatar`} />}
        </div>
      </div>

      <div className="content">
        <div className="name">{name}</div>
        <div className="lifes">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`life ${i > lifes - 1 ? "life--lost" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
