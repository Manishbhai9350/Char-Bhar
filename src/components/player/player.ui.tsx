import { useGame } from "../../context/game/game.hook";
import PlayerCard from "./playerCard/playerCard";

const PlayersUI = () => {
  const { turn } = useGame();

  return (
    <>
      <PlayerCard
        name="Manish"
        isActive={turn == "1"}
        player="1"
        avatarUrl="/images/avatars/a1.png"
      />
      <div className="scores">
        <div className="left active">5</div>
        <div className="seperator"></div>
        <div className="right">0</div>
      </div>
      <PlayerCard
        side="right"
        name="Bot"
        isActive={turn == "2"}
        player="2"
        avatarUrl="https://media.istockphoto.com/id/1130320134/vector/cute-robot-character-chatbot-icon.jpg?s=612x612&w=0&k=20&c=A6vKE6rSFFvNmjzjRgM9UHQF_hXzNk6SZfMbVHJXao8="
      />
    </>
  );
};

export default PlayersUI;
