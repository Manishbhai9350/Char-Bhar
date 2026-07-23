import { useRef } from "react";
import { useGame } from "../../context/game/game.hook";
import PlayerCard from "./playerCard/playerCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PlayersUI = () => {
  const { turn, scores } = useGame();

  const PlayerOneScoreRef = useRef<HTMLDivElement | null>(null);
  const PlayerTwoScoreRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    console.log(scores.player1)
    const container = PlayerOneScoreRef.current;
    if (!container) return;

    const current = container.querySelector(".current") as HTMLElement;
    const upcoming = container.querySelector(".upcoming") as HTMLElement;

    if (!current || !upcoming) return;

    // set upcoming value
    upcoming.innerText = String(scores.player1);

    // place upcoming below
    gsap.set(upcoming, { yPercent: 100 });

    // animate both
    gsap.to([current, upcoming], {
      yPercent: "-=100",
      duration: 0.4,
      ease: "power2.out",
      onComplete() {
        // swap classes
        current.classList.remove("current");
        current.classList.add("upcoming");

        upcoming.classList.remove("upcoming");
        upcoming.classList.add("current");

        // reset old current (now upcoming)
        gsap.set(current, { yPercent: 100 });
      },
    });
  }, [scores.player1]);

  useGSAP(() => {
    console.log(scores.player2)
    const container = PlayerTwoScoreRef.current;
    if (!container) return;

    const current = container.querySelector(".current") as HTMLElement;
    const upcoming = container.querySelector(".upcoming") as HTMLElement;

    if (!current || !upcoming) return;

    // set upcoming value
    upcoming.innerText = String(scores.player2);

    // place upcoming below
    gsap.set(upcoming, { yPercent: 100 });

    // animate both
    gsap.to([current, upcoming], {
      yPercent: "-=100",
      duration: 0.4,
      ease: "power2.out",
      onComplete() {
        // swap classes
        current.classList.remove("current");
        current.classList.add("upcoming");

        upcoming.classList.remove("upcoming");
        upcoming.classList.add("current");

        // reset old current (now upcoming)
        gsap.set(current, { yPercent: 100 });
      },
    });
  }, [scores.player2]);

  return (
    <>
      <PlayerCard
        name="Manish"
        isActive={turn == "1"}
        player="1"
        avatarUrl="/images/avatars/a1.png"
      />
      <div className="scores">
        <div className={`left ${turn == "1" && "active"}`}>
          <div ref={PlayerOneScoreRef} className="score">
            <div className="current"></div>
            <div className="upcoming"></div>
          </div>
        </div>
        <div className="seperator"></div>
        <div className={`right ${turn == "2" && "active"}`}>
          <div ref={PlayerTwoScoreRef} className="score">
            <div className="current">1</div>
            <div className="upcoming">0</div>
          </div>
        </div>
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
